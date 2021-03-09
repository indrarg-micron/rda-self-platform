// go to the selected date range
$('#date-range').on('click', function() {
  var from = $('#from').val()
  var to = $('#to').val()
  var url = `/log?from=${from}&to=${to}`
  if (url) { // require a URL
    window.location = url // redirect
  }
})