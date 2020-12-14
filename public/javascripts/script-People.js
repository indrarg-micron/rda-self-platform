// add button - sql execution
$('#people-add').click(function() {
  // abstract data from form
  var workerNo = parser($('#people-workerNo').val())
  var firstName = parser($('#people-firstName').val())
  var username = parser($('#people-username').val().toLowerCase())
  var area = parser($('#people-area').val())
  var section = parser($('#people-section').val())
  var shift = parser($('#people-shift').val())
  var gjs = parser($('#people-gjs').val())
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
    alert('Error:\r\n' + 'Inputs are not of the same length')
  }

  // iterate through every row and check for input sanity
  // then concatenate to sql value string
  var valueString = ""
  for (var i = 0; i < workerNo.length; i++) {
    var dataId = workerNo[i]
    var dataFirstName = firstName[i]
    var dataUsername = username[i]
    var dataArea = area[i]
    var dataSection = section[i]
    var dataShift = shift[i]
    var dataGjs = gjs[i]
    var dataStatus = status[i]
    var dataPermission = permission[i]
    var dataManagerId = managerNo[i]

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

  $.ajax({
    url:'/people',
    type: 'POST',
    data: {valueString},

    success: function(msg) {
      if ( !alert('Success:\r\n' + msg.rowsAffected + ' row(s) affected') ) {
        window.location.reload()
      }
    },

    error: function(err) {
      alert('Error:\r\n' + err.responseText)
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