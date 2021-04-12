// add button - show modal
$('#checklist-add-modal').click(function () {
  $('#checklist-add-edit').show()
})

// edit button - show modal and fill in textarea
$('#checklist-edit-modal').click(function () {
  $('#checklist-add-edit').show()

  let random = $('#the-table').DataTable().rows({ selected: true }).data()
  if (random.length == 0) {
    $('#checklist-add-edit').hide()
    return throwAlert('#add-edit-throw-alert', 'Warning', 'Please select the rows to edit')
  }

  // fill in the selected rows to textarea
  let skipCount = 0 // for section checking
  for (let i = 0; i < random.length; i++) {

    // check if checklist item is their section's
    if (user.permission == 'section' && random[i][1] != user.section) {
      skipCount++
      if (skipCount == random.length) {
        return throwAlert('#add-edit-throw-alert', 'Warning', 'Please select items of your section to edit')
      }
      continue
    }

    let txt

    txt = $('<div>').html(random[i][0]).text() // to get innerHTML text
    $('#checklist-id').val($('#checklist-id').val() + txt + '\n')

    txt = random[i][1]
    $('#checklist-section').val($('#checklist-section').val() + txt + '\n')

    txt = random[i][2]
    $('#checklist-level').val($('#checklist-level').val() + txt + '\n')

    txt = $('<div>').html(random[i][3]).text() // to get special char like '&' instead of '&amp;'
    $('#checklist-category').val($('#checklist-category').val() + txt + '\n')

    txt = $('<div>').html(random[i][4]).text() // to get special char like '&' instead of '&amp;'
    $('#checklist-item').val($('#checklist-item').val() + txt + '\n')

    txt = random[i][5]
    $('#checklist-status').val($('#checklist-status').val() + txt + '\n')

    txt = $('<div>').html(random[i][6]).text()
    $('#checklist-link').val($('#checklist-link').val() + txt + '\n')
  }
})

// delete button - show modal and fill in list
$('#checklist-delete-modal').click(function () {
  $('#checklist-delete').show()

  let random = $('#the-table').DataTable().rows({ selected: true }).data()
  if (random.length == 0) {
    $('#checklist-delete').hide()
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

  for (let i = 0; i < random.length; i++) {
    let id = $('<div>').html(random[i][0]).text() // to get innerHTML text
    let section = random[i][1]
    let level = random[i][2]
    let category = random[i][3]
    let item = random[i][4]

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
$('#checklist-add-edit').click(function () {

  // the main function outside
  let valueString = bulkOfFunction()
  if (!valueString) { return }

  $.ajax({
    url: '/checklist',
    type: 'POST',
    data: { valueString },

    success: function (msg) {
      throwAlert('#add-edit-throw-alert', 'Success', msg.rowsAffected.pop() + ' row(s) affected')
      setTimeout(window.location.reload(), 750)
    },

    error: function (err) {
      throwAlert('#add-edit-throw-alert', 'Error', err.responseText)
    }
  })
})

// delete button - sql execution
$('#checklist-delete').click(function () {
  // get the list of IDs for deletion in an array
  let deleteIDs = $('#delete-content > table > tbody input:checkbox:checked').map(function () {
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
    url: '/checklist',
    type: 'DELETE',
    data: { valueString },

    success: function (msg) {
      throwAlert('#delete-throw-alert', 'Success', msg.rowsAffected.pop() + ' row(s) affected')
      setTimeout(window.location.reload(), 750)
    },

    error: function (err) {
      throwAlert('#delete-throw-alert', 'Error', err.responseText)
    }
  })
})

// bulk of the function for add and edit
function bulkOfFunction() {
  // abstract data from form
  let id = parser($('#checklist-id').val())
  let section = parser($('#checklist-section').val())
  let level = parser($('#checklist-level').val())
  let category = parser($('#checklist-category').val())
  let item = parser($('#checklist-item').val())
  let status = parser($('#checklist-status').val().toLowerCase())
  let link = parser($('#checklist-link').val())

  // check input length
  let inputLength = []
  inputLength.push(level.length)
  inputLength.push(category.length)
  inputLength.push(item.length)
  inputLength.push(status.length)
  inputLength.push(link.length)
  if (user.name == 'admin') {
    inputLength.push(section.length)
  }

  if (inputLength.every((val, i, arr) => val === 0)) {
    throwAlert('#add-edit-throw-alert', 'Error', 'No input detected, please try again')
    return false
  }

  if (!(inputLength.every((val, i, arr) => val === arr[0]))) {
    throwAlert('#add-edit-throw-alert', 'Error', 'Inputs are not of the same length')
    return false
  }

  // iterate through every row and check for input sanity
  // then concatenate to sql value string
  let valueString = ""
  for (let i = 0; i < inputLength[0]; i++) {
    let dataId, dataSection, dataLevel, dataCategory, dataItem, dataStatus, dataLink 

    dataId = id[i] ? id[i] : null
    dataSection = section[i] ? section[i] : user.section

    if (Number.isInteger(parseInt(level[i]))) {
      dataLevel = level[i]
    } else {
      throwAlert('#add-edit-throw-alert', 'Error', 'Level should be an integer')
      return false
    }

    dataCategory = category[i]
    dataItem = item[i]

    if (status[i] === 'active' || status[i] === 'inactive') {
      dataStatus = status[i]
    } else {
      throwAlert('#add-edit-throw-alert', 'Error', 'Status should be either "active" or "inactive"')
      return false
    }

    if (isUrlValid(link[i]) || link[i] == '') {
      dataLink = link[i]
    } else {
      throwAlert('#add-edit-throw-alert', 'Error', 'Please insert a valid link')
      return false
    }

    valueString = valueString + "("
      + dataId + ", '"
      + dataSection + "', "
      + dataLevel + ", '"
      + dataCategory + "', '"
      + dataItem + "', '"
      + dataStatus + "', '"
      + dataLink + "'), "
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
  switch (type) {
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

// check if url is valid
function isUrlValid(url) {
  return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=\{\}]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=\{\}]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=\{\}]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=\{\}]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=\{\}]|:|@)|\/|\?)*)?$/i.test(url);
}
