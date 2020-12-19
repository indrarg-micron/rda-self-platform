// add button - show modal
$('#people-add-modal').click(function() {
  $('#people-edit').hide()
  $('#people-add').show()
})

// edit button - show modal and fill in textarea
$('#people-edit-modal').click(function() {
  $('#people-add').hide()
  $('#people-edit').show()
  
  var random = $('#the-table').DataTable().rows( { selected: true } ).data()
  if (random.length == 0) {
    $('#people-edit').hide()
    return throwAlert('Error', 'Please select the rows to edit')
  }

  // fill in the selected rows to textarea
  for ( var i=0; i < random.length; i++) {
    var txt = random[i][0].substring(
      random[i][0].lastIndexOf('>') + 1, )
    $('#people-workerNo').val($('#people-workerNo').val() + txt + '\n')
    
    var txt = random[i][1]
    $('#people-firstName').val($('#people-firstName').val() + txt + '\n')

    var txt = random[i][2]
    $('#people-username').val($('#people-username').val() + txt + '\n')

    var txt = random[i][3]
    $('#people-area').val($('#people-area').val() + txt + '\n')

    var txt = random[i][4]
    $('#people-section').val($('#people-section').val() + txt + '\n')

    var txt = random[i][5]
    $('#people-shift').val($('#people-shift').val() + txt + '\n')

    var txt = random[i][6]
    $('#people-gjs').val($('#people-gjs').val() + txt + '\n')

    var txt = random[i][7]
    $('#people-status').val($('#people-status').val() + txt + '\n')

    var txt = random[i][8]
    $('#people-permission').val($('#people-permission').val() + txt + '\n')

    var txt = random[i][9].substring(
      random[i][9].indexOf('#') + 1, 
      random[i][9].lastIndexOf('"'))
    $('#people-managerNo').val($('#people-managerNo').val() + txt + '\n')
  }
})

// add button - sql execution
$('#people-add').click(function() {

  // the main function outside
  var valueString = bulkOfFunction()
  if (!valueString) { return }

  $.ajax({
    url:'/people',
    type: 'POST',
    data: {valueString},

    success: function(msg) {
      throwAlert('Success', msg.rowsAffected + ' row(s) affected')
      setTimeout(window.location.reload(), 750)
    },

    error: function(err) {
      throwAlert('Error', err.responseText)
    }
  })
})

// edit button - sql execution
$('#people-edit').click(function() {

  // the main function outside
  var valueString = bulkOfFunction()
  if (!valueString) { return }

  $.ajax({
    url:'/people',
    type: 'PATCH',
    data: {valueString},

    success: function(msg) {
      throwAlert('Success', msg.rowsAffected + ' row(s) affected')
      setTimeout(window.location.reload(), 750)
    },

    error: function(err) {
      throwAlert('Error', err.responseText)
    }
  })
})

function bulkOfFunction() {
  // abstract data from form
  var workerNo = parser($('#people-workerNo').val())
  var firstName = parser($('#people-firstName').val())
  var username = parser($('#people-username').val().toLowerCase())
  var area = parser($('#people-area').val().toUpperCase())
  var section = parser($('#people-section').val())
  var shift = parser($('#people-shift').val().toUpperCase())
  var gjs = parser($('#people-gjs').val().toUpperCase())
  var status = parser($('#people-status').val())
  var permission = parser($('#people-permission').val())
  var managerNo = parser($('#people-managerNo').val())

  // check input length
  var inputLength = []
  inputLength.push(workerNo.length)
  inputLength.push(firstName.length)
  inputLength.push(username.length)
  inputLength.push(area.length)
  inputLength.push(section.length)
  inputLength.push(shift.length)
  inputLength.push(gjs.length)
  inputLength.push(status.length)
  inputLength.push(permission.length)
  inputLength.push(managerNo.length)

  if ( inputLength.every( (val, i, arr) => val === 0 ) ) {
    throwAlert('Error', 'No input detected, please try again')
    return false
  }

  if ( !(inputLength.every( (val, i, arr) => val === arr[0] )) ) {
    throwAlert('Error', 'Inputs are not of the same length')
    return false
  }

  // iterate through every row and check for input sanity
  // then concatenate to sql value string
  var valueString = ""
  for (var i = 0; i < workerNo.length; i++) {
    if ( $.isNumeric(workerNo[i]) ) {
      var dataId = workerNo[i]
    } else {
      throwAlert('Error', 'Worker No should be numeric')
      return false
    }

    var dataFirstName = firstName[i]
    
    if ( !/[^a-z]/.test(username[i]) ) {
      var dataUsername = username[i]
    } else {
      throwAlert('Error', 'Username should only contain letters')
      return false
    }
    
    var dataArea = area[i] ? area[i] : 'RDA'
    var dataSection = section[i]

    if ( shift[i].length === 4) {
      var dataShift = shift[i]
    } else {
      throwAlert('Error', 'Shift code should contain exactly 4 characters')
      return false
    }
    
    if ( gjs[i].length === 2) {
      var dataGjs = gjs[i]
    } else {
      throwAlert('Error', 'GJS code should contain exactly 2 characters')
      return false
    }
    
    if ( status[i] === 'active' || status[i] === 'inactive') {
      var dataStatus = status[i]
    } else {
      throwAlert('Error', 'Status should be either "active" or "inactive"')
      return false
    }
    
    if ( permission[i] === 'admin' || permission[i] === 'section' || permission[i] === 'user') {
      var dataPermission = permission[i]
    } else {
      var dataPermission = 'user'
    }
    
    if ( $.isNumeric(managerNo[i]) ) {
      var dataManagerId = managerNo[i]
    } else {
      throwAlert('Error', 'Manager No should be numeric')
      return false
    }
    
    valueString = valueString + "("
    + dataId + ", '"
    + dataFirstName + "', '"
    + dataUsername + "', '"
    + dataArea + "', '"
    + dataSection + "', '"
    + dataShift + "', '"
    + dataGjs + "', '"
    + dataStatus + "', '"
    + dataPermission + "', "
    + dataManagerId + "), "
  }
  valueString = valueString.slice(0, -2)
  valueString = valueString + ";"

  return valueString
}

// parse input from textarea
function parser(input) {
  // parse newlines regardless of the platform (operation system)
  var array = input.split(/\r?\n/)
  // remove trailing white spaces
  array = array.map(s => s.trim())
  // filter empty string in the array
  // array = array.filter(item => item)
  // remove last element if it is empty string
  if (!array[array.length - 1]) {
    array.pop()
  }

  return array
}

// display alert
function throwAlert(type, msg) {
  switch(type) {
    case 'Error': alertClass = 'danger'; break;
    case 'Success': alertClass = 'success'; break;
  }

  $('#throw-alert').html(
    `<div class="alert alert-${alertClass} alert-dismissible fade show" role="alert">
      <strong>${type}</strong>: ${msg}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`
  )
}