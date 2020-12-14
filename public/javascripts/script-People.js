// add button - show modal
$('#people-add-modal').click(function() {
  $('#people-edit').hide()
  $('#people-add').show()
})

// add button - sql execution
$('#people-add').click(function() {
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

  if ( !(inputLength.every( (val, i, arr) => val === arr[0] )) ) {
    return throwAlert('Error', 'Inputs are not of the same length')
  }

  // iterate through every row and check for input sanity
  // then concatenate to sql value string
  var valueString = ""
  for (var i = 0; i < workerNo.length; i++) {
    if ( $.isNumeric(workerNo[i]) ) {
      var dataId = workerNo[i]
    } else {
      return throwAlert('Error', 'Worker No should be numeric')
    }

    var dataFirstName = firstName[i]
    
    if ( !/[^a-z]/.test(username[i]) ) {
      var dataUsername = username[i]
    } else {
      return throwAlert('Error', 'Username should only contain letters')
    }
    
    var dataArea = area[i] ? area[i] : 'RDA'
    var dataSection = section[i]

    if ( shift[i].length === 4) {
      var dataShift = shift[i]
    } else {
      return throwAlert('Error', 'Shift code should contain exactly 4 characters')
    }
    
    if ( gjs[i].length === 2) {
      var dataGjs = gjs[i]
    } else {
      return throwAlert('Error', 'GJS code should contain exactly 2 characters')
    }
    
    if ( status[i] === 'active' || status[i] === 'inactive') {
      var dataStatus = status[i]
    } else {
      return throwAlert('Error', 'Status should be either "active" or "inactive"')
    }
    
    if ( permission[i] === 'admin' || permission[i] === 'section' || permission[i] === 'user') {
      var dataPermission = permission[i]
    } else {
      var dataPermission = 'user'
    }
    
    if ( $.isNumeric(managerNo[i]) ) {
      var dataManagerId = managerNo[i]
    } else {
      return throwAlert('Error', 'Manager No should be numeric')
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

  console.log(valueString)

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