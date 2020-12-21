// add button - show modal
$('#checklist-add-modal').click(function() {
  $('#checklist-add-edit').show()
})

// edit button - show modal and fill in textarea
$('#checklist-edit-modal').click(function() {
  $('#checklist-add-edit').show()
  
  var random = $('#the-table').DataTable().rows( { selected: true } ).data()
  if (random.length == 0) {
    $('#checklist-add-edit').hide()
    return throwAlert('#add-edit-throw-alert', 'Warning', 'Please select the rows to edit')
  }

  // fill in the selected rows to textarea
  for ( var i=0; i < random.length; i++) {
    var txt = random[i][0].substring(
      random[i][0].lastIndexOf('>') + 1, )
    $('#checklist-id').val($('#checklist-id').val() + txt + '\n')

    var txt = random[i][1]
    $('#checklist-area').val($('#checklist-area').val() + txt + '\n')

    var txt = random[i][2]
    $('#checklist-section').val($('#checklist-section').val() + txt + '\n')

    var txt = random[i][3]
    $('#checklist-level').val($('#checklist-level').val() + txt + '\n')

    var txt = random[i][4]
    $('#checklist-category').val($('#checklist-category').val() + txt + '\n')

    var txt = random[i][5]
    $('#checklist-item').val($('#checklist-item').val() + txt + '\n')

    var txt = random[i][6]
    $('#checklist-status').val($('#checklist-status').val() + txt + '\n')
  }
})

// delete button - show modal and fill in list
$('#checklist-delete-modal').click(function() {
  $('#checklist-delete').show()
  
  var random = $('#the-table').DataTable().rows( { selected: true } ).data()
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
          <th>ID</th>
          <th>Section</th>
          <th>Level</th>
          <th>Category</th>
          <th>Item</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  `)

  for ( var i=0; i < random.length; i++) {
    var id = random[i][0].substring(
      random[i][0].lastIndexOf('>') + 1, )
    var section = random[i][2]
    var level = random[i][3]
    var category = random[i][4]
    var item = random[i][5]

    $('#delete-content > table > tbody:last-child').append(`
      <tr>
        <td><input type="checkbox" value="${id}" checked></td>
        <td>${id}</td>
        <td>${section}</td>
        <td>${level}</td>
        <td>${category}</td>
        <td>${item}</td>
      </tr>
    `)
  }
})

// add-edit button - sql execution
$('#checklist-add-edit').click(function() {

  // the main function outside
  var valueString = bulkOfFunction()
  if (!valueString) { return }

  $.ajax({
    url:'/checklist',
    type: 'POST',
    data: {valueString},

    success: function(msg) {
      throwAlert('#add-edit-throw-alert', 'Success', msg.rowsAffected.pop() + ' row(s) affected')
      setTimeout(window.location.reload(), 750)
    },

    error: function(err) {
      throwAlert('#add-edit-throw-alert', 'Error', err.responseText)
    }
  })
})

// delete button - sql execution
$('#checklist-delete').click(function() {
  // get the list of IDs for deletion in an array
  var deleteIDs = $('#delete-content > table > tbody input:checkbox:checked').map(function(){
    return $(this).val()
  }).get() // <-- to transform into true array

  if (deleteIDs.length == 0) {
    return throwAlert('#delete-throw-alert', 'Warning', 'Please select the rows to delete')
  }

  var valueString = ""
  deleteIDs.forEach(id => {
    valueString = valueString + "(" + id + "), "
  })
  valueString = valueString.slice(0, -2)
  valueString = valueString + ";"

  $.ajax({
    url:'/checklist',
    type: 'DELETE',
    data: {valueString},

    success: function(msg) {
      throwAlert('#delete-throw-alert', 'Success', msg.rowsAffected.pop() + ' row(s) affected')
      setTimeout(window.location.reload(), 750)
    },

    error: function(err) {
      throwAlert('#delete-throw-alert', 'Error', err.responseText)
    }
  })
})

// bulk of the function for add and edit
function bulkOfFunction() {
  // abstract data from form
  var id = parser($('#checklist-id').val())
  var area = parser($('#checklist-area').val().toUpperCase())
  var section = parser($('#checklist-section').val())
  var level = parser($('#checklist-level').val())
  var category = parser($('#checklist-category').val())
  var item = parser($('#checklist-item').val())
  var status = parser($('#checklist-status').val())

  // check input length
  var inputLength = []
  inputLength.push(area.length)
  inputLength.push(section.length)
  inputLength.push(level.length)
  inputLength.push(category.length)
  inputLength.push(item.length)
  inputLength.push(status.length)

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
  var valueString = ""
  for (var i = 0; i < inputLength[0]; i++) {
    var dataId = id[i] ? id[i] : null
    var dataArea = area[i] ? area[i] : 'RDA'
    var dataSection = section[i]

    if ( Number.isInteger(level[i]) ) {
      var dataLevel = level[i]
    } else {
      throwAlert('#add-edit-throw-alert', 'Error', 'Level should be an integer')
      return false
    }

    var dataCategory = category[i]
    var dataItem = item[i]
    
    if ( status[i] === 'active' || status[i] === 'inactive') {
      var dataStatus = status[i]
    } else {
      throwAlert('#add-edit-throw-alert', 'Error', 'Status should be either "active" or "inactive"')
      return false
    }
        
    valueString = valueString + "("
    + dataId + ", '"
    + dataArea + "', '"
    + dataSection + "', "
    + dataLevel + ", '"
    + dataCategory + "', '"
    + dataItem + "', '"
    + dataStatus + "'), "
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
