// go to the selected date range
$('#date-range').on('click', function() {
  var from = $('#from').val()
  var to = $('#to').val()

  // check if from date is before or the same as to date
  if (new Date(from) > new Date(to)) {
    return alert('End date should be after or on From date')
  }

  var url = `/log?from=${from}&to=${to}`
  if (url) { // require a URL
    window.location = url // redirect
  }
})