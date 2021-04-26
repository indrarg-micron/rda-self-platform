// refresh page with new FQ filter
$('#select-fq').on('change', function() {
  let url = $(this).val() // get selected value
  if (url) { // require a URL
    window.location = url // redirect
  }
})

// add button - show modal by id
$('#score-add-modal-id').click(function() {
  $('#score-add-edit-id').show()
})

// add button - show modal by content
$('#score-add-modal-content').click(function() {
  $('#score-add-edit-content').show()
})

// edit button - show modal by id and fill in textarea
$('#score-edit-modal-id').click(function() {
  $('#score-add-edit-id').show()
  
  let random = $('#the-table').DataTable().rows( { selected: true } ).data()
  if (random.length == 0) {
    $('#score-add-edit-id').hide()
    return throwAlert('#add-edit-id-throw-alert', 'Warning', 'Please select the rows to edit')
  }

  // fill in the selected rows to textarea
  for ( let i=0; i < random.length; i++) {
    let txt
    
    txt = $('<div>').html(random[i][0]).text() // to get innerHTML text
    $('#score-id-id').val($('#score-id-id').val() + txt + '\n')

    txt = random[i][1].substring(
      random[i][1].indexOf('#') + 1, 
      random[i][1].lastIndexOf('"'))
    $('#score-userId').val($('#score-userId').val() + txt + '\n')

    txt = random[i][5].substring(
      random[i][5].indexOf('#') + 1, 
      random[i][5].indexOf('"', random[i][5].indexOf('#'))) // get ID between # and "
    $('#score-checklistId').val($('#score-checklistId').val() + txt + '\n')

    txt = random[i][6]
    $('#score-score-id').val($('#score-score-id').val() + txt + '\n')

    txt = random[i][7]
    $('#score-quarter-id').val($('#score-quarter-id').val() + txt + '\n')
  }
})

// edit button - show modal by content and fill in textarea
$('#score-edit-modal-content').click(function() {
  $('#score-add-edit-content').show()
  
  let random = $('#the-table').DataTable().rows( { selected: true } ).data()
  if (random.length == 0) {
    $('#score-add-edit-content').hide()
    return throwAlert('#add-edit-content-throw-alert', 'Warning', 'Please select the rows to edit')
  }

  // fill in the selected rows to textarea
  for ( let i=0; i < random.length; i++) {
    let txt

    txt = $('<div>').html(random[i][0]).text() // to get innerHTML text
    $('#score-id-content').val($('#score-id-content').val() + txt + '\n')

    txt = $('<div>').html(random[i][1]).text() // to get innerHTML text
    $('#score-username').val($('#score-username').val() + txt + '\n')

    txt = random[i][2]
    $('#score-section').val($('#score-section').val() + txt + '\n')

    txt = random[i][3]
    $('#score-level').val($('#score-level').val() + txt + '\n')

    txt = $('<div>').html(random[i][4]).text() // to get special char like '&' instead of '&amp;'
    $('#score-category').val($('#score-category').val() + txt + '\n')

    txt = $('<div>').html(random[i][5]).text() // to get special char like '&' instead of '&amp;'
    $('#score-item').val($('#score-item').val() + txt + '\n')

    txt = random[i][6]
    $('#score-score-content').val($('#score-score-content').val() + txt + '\n')

    txt = random[i][7]
    $('#score-quarter-content').val($('#score-quarter-content').val() + txt + '\n')
  }
})

// delete button - show modal and fill in list
$('#score-delete-modal').click(function() {
  $('#score-delete').show()
  
  let random = $('#the-table').DataTable().rows( { selected: true } ).data()
  if (random.length == 0) {
    $('#score-delete').hide()
    return throwAlert('#delete-throw-alert', 'Warning', 'Please select the rows to delete')
  }

  // fill in the selected rows to the delete list
  $('#delete-content').append(`
    <table class="table table-bordered table-hover table-sm">
      <thead>
        <tr>
          <th><input type="checkbox" id="allcb" onchange="allcb()" checked></th>
          <th>ID</th>
          <th>Username</th>
          <th>Item Section</th>
          <th>Level</th>
          <th>Category</th>
          <th>Item</th>
          <th>Score</th>
          <th>FY Quarter</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  `)

  for ( let i=0; i < random.length; i++) {
    let id = $('<div>').html(random[i][0]).text() // to get innerHTML text
    let username = random[i][1]
    let section = random[i][2]
    let level = random[i][3]
    let category = random[i][4]
    let item = random[i][5]
    let score = random[i][6]
    let quarter = random[i][7]

    $('#delete-content > table > tbody:last-child').append(`
      <tr>
        <td><input type="checkbox" value="${id}" checked></td>
        <td>${id}</td>
        <td>${username}</td>
        <td>${section}</td>
        <td>${level}</td>
        <td>${category}</td>
        <td>${item}</td>
        <td>${score}</td>
        <td>${quarter}</td>
      </tr>
    `)
  }
})

// add-edit button - sql execution by id
$('#score-add-edit-id').click(function() {

  // the main function outside
  let valueString = bulkOfFunctionById()
  if (!valueString) { return }

  $.ajax({
    url:'/score',
    type: 'POST',
    data: {valueString},

    beforeSend: function(){ 
      $('#score-add-edit-id, #score-add-edit-content, #score-delete').prop('disabled', true)
    },

    success: function(msg) {
      $('#score-add-edit-id, #score-add-edit-content, #score-delete').prop('disabled', false)
      throwAlert('#add-edit-id-throw-alert', 'Success', msg.rowsAffected.pop() + ' row(s) affected')
      setTimeout(window.location.reload(), 750)
    },

    error: function(err) {
      $('#score-add-edit-id, #score-add-edit-content, #score-delete').prop('disabled', false)
      throwAlert('#add-edit-id-throw-alert', 'Error', err.responseText)
    }
  })
})

// add-edit button - sql execution by content
$('#score-add-edit-content').click(function() {

  // the main function outside
  let valueString = bulkOfFunctionByContent()
  if (!valueString) { return }

  $.ajax({
    url:'/score',
    type: 'PATCH',
    data: {valueString},

    beforeSend: function(){ 
      $('#score-add-edit-id, #score-add-edit-content, #score-delete').prop('disabled', true)
    },

    success: function(msg) {
      $('#score-add-edit-id, #score-add-edit-content, #score-delete').prop('disabled', false)
      throwAlert('#add-edit-content-throw-alert', 'Success', msg.rowsAffected.pop() + ' row(s) affected')
      setTimeout(window.location.reload(), 750)
    },

    error: function(err) {
      $('#score-add-edit-id, #score-add-edit-content, #score-delete').prop('disabled', false)
      throwAlert('#add-edit-content-throw-alert', 'Error', err.responseText)
    }
  })
})

// delete button - sql execution
$('#score-delete').click(function() {
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
    url:'/score',
    type: 'DELETE',
    data: {valueString},

    beforeSend: function(){ 
      $('#score-add-edit-id, #score-add-edit-content, #score-delete').prop('disabled', true)
    },

    success: function(msg) {
      $('#score-add-edit-id, #score-add-edit-content, #score-delete').prop('disabled', false)
      throwAlert('#delete-throw-alert', 'Success', msg.rowsAffected.pop() + ' row(s) affected')
      setTimeout(window.location.reload(), 750)
    },

    error: function(err) {
      $('#score-add-edit-id, #score-add-edit-content, #score-delete').prop('disabled', false)
      throwAlert('#delete-throw-alert', 'Error', err.responseText)
    }
  })
})

// bulk of the function for add and edit by id
function bulkOfFunctionById() {
  // abstract data from form
  let id = parser($('#score-id-id').val())
  let userId = parser($('#score-userId').val())
  let checklistId = parser($('#score-checklistId').val())
  let score = parser($('#score-score-id').val())
  let quarter = parser($('#score-quarter-id').val())

  // check input length
  let inputLength = []
  inputLength.push(userId.length)
  inputLength.push(checklistId.length)
  inputLength.push(score.length)
  inputLength.push(quarter.length)

  if ( inputLength.every( (val, i, arr) => val === 0 ) ) {
    throwAlert('#add-edit-id-throw-alert', 'Error', 'No input detected, please try again')
    return false
  }

  if ( !(inputLength.every( (val, i, arr) => val === arr[0] )) ) {
    throwAlert('#add-edit-id-throw-alert', 'Error', 'Inputs are not of the same length')
    return false
  }

  // iterate through every row and check for input sanity
  // then concatenate to sql value string
  let valueString = ""
  for (let i = 0; i < inputLength[0]; i++) {
    let dataId, dataUserId, dataChecklistId, dataScore, dataQuarter

    dataId = id[i] ? id[i] : null

    if ( Number.isInteger(parseInt(userId[i])) ) {
      dataUserId = userId[i]
    } else {
      throwAlert('#add-edit-id-throw-alert', 'Error', 'Worker No should be an integer, please check people page')
      return false
    }

    if ( Number.isInteger(parseInt(checklistId[i])) ) {
      dataChecklistId = checklistId[i]
    } else {
      throwAlert('#add-edit-id-throw-alert', 'Error', 'Checklist ID should be an integer, please check checklist page')
      return false
    }

    if ( Number.isInteger(parseInt(score[i])) ) {
      dataScore = score[i]
    } else {
      throwAlert('#add-edit-id-throw-alert', 'Error', 'Score should be an integer')
      return false
    }

    if ( quarter[i].length === 6) {
      dataQuarter = quarter[i]
    } else {
      throwAlert('#add-edit-id-throw-alert', 'Error', 'FY Quarter should contain exactly 6 characters')
      return false
    }
        
    valueString = valueString + "("
    + dataId + ", "
    + dataUserId + ", "
    + dataChecklistId + ", "
    + dataScore + ", '"
    + dataQuarter + "'), "
  }
  valueString = valueString.slice(0, -2)
  valueString = valueString + ";"

  return valueString
}

// bulk of the function for add and edit by content
function bulkOfFunctionByContent() {
  // abstract data from form
  let id = parser($('#score-id-content').val())
  let username = parser($('#score-username').val().toLowerCase())
  let section = parser($('#score-section').val())
  let level = parser($('#score-level').val())
  let category = parser($('#score-category').val())
  let item = parser($('#score-item').val())
  let score = parser($('#score-score-content').val())
  let quarter = parser($('#score-quarter-content').val().toUpperCase())

  // check input length
  let inputLength = []
  inputLength.push(username.length)
  inputLength.push(section.length)
  inputLength.push(level.length)
  inputLength.push(category.length)
  inputLength.push(item.length)
  inputLength.push(score.length)
  inputLength.push(quarter.length)

  if ( inputLength.every( (val, i, arr) => val === 0 ) ) {
    throwAlert('#add-edit-content-throw-alert', 'Error', 'No input detected, please try again')
    return false
  }

  if ( !(inputLength.every( (val, i, arr) => val === arr[0] )) ) {
    throwAlert('#add-edit-content-throw-alert', 'Error', 'Inputs are not of the same length')
    return false
  }

  // iterate through every row and check for input sanity
  // then concatenate to sql value string
  let valueString = ""
  for (let i = 0; i < inputLength[0]; i++) {
    let dataId, dataUsername, dataSection, dataLevel, dataCategory, dataItem, dataScore, dataQuarter

    dataId = id[i] ? id[i] : null
    
    if ( !/[^a-z]/.test(username[i]) ) {
      dataUsername = username[i]
    } else {
      throwAlert('#add-edit-content-throw-alert', 'Error', 'Username should only contain letters, please check people page')
      return false
    }

    dataSection = section[i]

    if ( Number.isInteger(parseInt(level[i])) ) {
      dataLevel = level[i]
    } else {
      throwAlert('#add-edit-content-throw-alert', 'Error', 'Level should be an integer')
      return false
    }

    dataCategory = category[i]
    dataItem = item[i]
    
    if ( Number.isInteger(parseInt(score[i])) ) {
      dataScore = score[i]
    } else {
      throwAlert('#add-edit-content-throw-alert', 'Error', 'Score should be an integer')
      return false
    }

    if ( quarter[i].length === 6) {
      dataQuarter = quarter[i]
    } else {
      throwAlert('#add-edit-content-throw-alert', 'Error', 'FY Quarter should contain exactly 6 characters')
      return false
    }
        
    valueString = valueString + "("
    + dataId + ", '"
    + dataUsername + "', '"
    + dataSection + "', "
    + dataLevel + ", '"
    + dataCategory + "', '"
    + dataItem + "', "
    + dataScore + ", '"
    + dataQuarter + "'), "
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
