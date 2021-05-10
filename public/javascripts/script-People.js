// add button - show modal
$('#people-add-modal').click(function() {
  $('#people-add-edit').show()
})

// edit button - show modal and fill in textarea
$('#people-edit-modal').click(function() {
  $('#people-add-edit').show()
  
  let random = $('#the-table').DataTable().rows( { selected: true } ).data()
  if (random.length == 0) {
    $('#people-add-edit').hide()
    return throwAlert('#add-edit-throw-alert', 'Warning', 'Please select the rows to edit')
  }

  // fill in the selected rows to textarea
  for ( let i=0; i < random.length; i++) {
    let txt

    txt = $('<div>').html(random[i][0]).text() // to get innerHTML text
    $('#people-workerNo').val($('#people-workerNo').val() + txt + '\n')
    
    txt = random[i][1]
    $('#people-firstName').val($('#people-firstName').val() + txt + '\n')

    txt = random[i][2]
    $('#people-username').val($('#people-username').val() + txt + '\n')

    txt = random[i][3]
    $('#people-section').val($('#people-section').val() + txt + '\n')

    txt = random[i][4]
    $('#people-shift').val($('#people-shift').val() + txt + '\n')

    txt = random[i][5]
    $('#people-gjs').val($('#people-gjs').val() + txt + '\n')

    txt = random[i][6]
    $('#people-status').val($('#people-status').val() + txt + '\n')

    txt = random[i][7]
    $('#people-permission').val($('#people-permission').val() + txt + '\n')

    txt = random[i][8].substring(
      random[i][8].indexOf('#') + 1, 
      random[i][8].lastIndexOf('"'))
    $('#people-managerNo').val($('#people-managerNo').val() + txt + '\n')
  }
})

// delete button - show modal and fill in list
$('#people-delete-modal').click(function() {
  $('#people-delete').show()
  
  let random = $('#the-table').DataTable().rows( { selected: true } ).data()
  if (random.length == 0) {
    $('#people-delete').hide()
    return throwAlert('#delete-throw-alert', 'Warning', 'Please select the rows to delete')
  }

  // fill in the selected rows to the delete list
  $('#delete-content').append(`
    <table class="table table-bordered table-hover table-sm">
      <thead>
        <tr>
          <th><input type="checkbox" id="allcb" onchange="allcb()" checked></th>
          <th>Worker No</th>
          <th>Username</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  `)

  for ( let i=0; i < random.length; i++) {
    let id = $('<div>').html(random[i][0]).text() // to get innerHTML text
    let username = random[i][2]

    $('#delete-content > table > tbody:last-child').append(`
      <tr>
        <td><input type="checkbox" value="${id}" checked></td>
        <td>${id}</td>
        <td>${username}</td>
      </tr>
    `)
  }
})

// add-edit button - sql execution
$('#people-add-edit').click(function() {

  // the main function outside
  let valueString = bulkOfFunction()
  if (!valueString) { return }

  $.ajax({
    url:'/people',
    type: 'POST',
    data: {valueString},

    beforeSend: function(){ 
      $('#people-add-edit, #people-delete').prop('disabled', true)
    },

    success: function(msg) {
      $('#people-add-edit, #people-delete').prop('disabled', false)
      throwAlert('#add-edit-throw-alert', 'Success', msg.rowsAffected.pop() + ' row(s) affected')
      setTimeout(window.location.reload(), 750)
    },

    error: function(err) {
      $('#people-add-edit, #people-delete').prop('disabled', false)
      throwAlert('#add-edit-throw-alert', 'Error', err.responseText)
    }
  })
})

// delete button - sql execution
$('#people-delete').click(function() {
  // get the list of IDs for deletion in an array
  let deleteIDs = $('#delete-content > table > tbody input:checkbox:checked').map(function(){
    return $(this).val()
  }).get() // <-- to transform into true array

  if (deleteIDs.length == 0) {
    return throwAlert('#delete-throw-alert', 'Warning', 'Please select the rows to delete')
  }

  let valueString = ""
  deleteIDs.forEach(id => {
    valueString = valueString + "(" + id + "), "
  })
  valueString = valueString.slice(0, -2)
  valueString = valueString + ";"

  $.ajax({
    url:'/people',
    type: 'DELETE',
    data: {valueString},

    beforeSend: function(){ 
      $('#people-add-edit, #people-delete').prop('disabled', true)
    },

    success: function(msg) {
      $('#people-add-edit, #people-delete').prop('disabled', false)
      throwAlert('#delete-throw-alert', 'Success', msg.rowsAffected.pop() + ' row(s) affected')
      setTimeout(window.location.reload(), 750)
    },

    error: function(err) {
      $('#people-add-edit, #people-delete').prop('disabled', false)
      throwAlert('#delete-throw-alert', 'Error', err.responseText)
    }
  })
})

// bulk of the function for add and edit
function bulkOfFunction() {
  // abstract data from form
  let workerNo = parser($('#people-workerNo').val())
  let firstName = parser($('#people-firstName').val())
  let username = parser($('#people-username').val().toLowerCase())
  let section = parser($('#people-section').val())
  let shift = parser($('#people-shift').val().toUpperCase())
  let gjs = parser($('#people-gjs').val().toUpperCase())
  let status = parser($('#people-status').val().toLowerCase())
  let permission = parser($('#people-permission').val())
  let managerNo = parser($('#people-managerNo').val())

  // check input length
  let inputLength = []
  inputLength.push(workerNo.length)
  inputLength.push(firstName.length)
  inputLength.push(username.length)
  inputLength.push(shift.length)
  inputLength.push(gjs.length)
  inputLength.push(status.length)
  inputLength.push(managerNo.length)
  if (user.name == 'admin') {
    inputLength.push(section.length)
    inputLength.push(permission.length)
  }  

  if ( inputLength.every( (val, i, arr) => val === 0 ) ) {
    throwAlert('#add-edit-throw-alert', 'Error', 'No input detected, please try again')
    return false
  }

  if ( !(inputLength.every( (val, i, arr) => val === arr[0] )) ) {
    throwAlert('#add-edit-throw-alert', 'Error', 'Inputs are not of the same length')
    return false
  }

  // iterate through every row and check for input sanity
  // then concatenate to sql value string
  let valueString = ""
  for (let i = 0; i < inputLength[0]; i++) {
    let dataId, dataFirstName, dataUsername, dataSection, dataShift, dataGjs, dataStatus, dataPermission, dataManagerId

    if ( Number.isInteger(parseInt(workerNo[i])) ) {
      dataId = workerNo[i]
    } else {
      throwAlert('#add-edit-throw-alert', 'Error', 'Worker No should be an integer')
      return false
    }

    dataFirstName = firstName[i].replace(/'/g, "''")
    
    if ( !/[^a-z]/.test(username[i]) ) {
      dataUsername = username[i]
    } else {
      throwAlert('#add-edit-throw-alert', 'Error', 'Username should only contain letters')
      return false
    }

    dataSection = section[i] ? section[i] : user.section

    if ( shift[i].length === 4) {
      dataShift = shift[i]
    } else {
      throwAlert('#add-edit-throw-alert', 'Error', 'Shift code should contain exactly 4 characters')
      return false
    }
    
    if ( gjs[i].length === 2) {
      dataGjs = gjs[i]
    } else {
      throwAlert('#add-edit-throw-alert', 'Error', 'GJS code should contain exactly 2 characters')
      return false
    }
    
    if ( status[i] === 'active' || status[i] === 'inactive') {
      dataStatus = status[i]
    } else {
      throwAlert('#add-edit-throw-alert', 'Error', 'Status should be either "active" or "inactive"')
      return false
    }
    
    if ( permission[i] === 'admin' || permission[i] === 'section' || permission[i] === 'user') {
      dataPermission = permission[i]
    } else {
      dataPermission = 'user'
    }
    
    if ( managerNo[i] == '' || Number.isInteger(parseInt(managerNo[i])) ) {
      dataManagerId = managerNo[i] || null
    } else {
      throwAlert('#add-edit-throw-alert', 'Error', 'Manager No should be an integer')
      return false
    }
    
    valueString = valueString + "("
    + dataId + ", '"
    + dataFirstName + "', '"
    + dataUsername + "', '"
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
  let array = input.split(/\r?\n/)
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
function throwAlert(loc, type, msg) {
  switch(type) {
    case 'Error': alertClass = 'danger'; break;
    case 'Success': alertClass = 'success'; break;
    case 'Warning': alertClass = 'warning'; break;
  }

  $(loc).html(
    `<div class="alert alert-${alertClass} alert-dismissible fade show" role="alert">
      <strong>${type}</strong>: ${msg}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`
  )
}

// check or uncheck all checkbox
function allcb() {
  if ($('#allcb').prop('checked')) {
    $('#allcb').closest('table').find('input[type="checkbox"]').prop('checked', true)
  } else {
    $('#allcb').closest('table').find('input[type="checkbox"]').prop('checked', false)
  }
}