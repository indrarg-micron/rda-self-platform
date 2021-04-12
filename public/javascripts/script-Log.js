// go to the selected date range
$('#date-range').on('click', function() {
  let from = $('#from').val()
  let to = $('#to').val()

  // check if from date is before or the same as to date
  if (new Date(from) > new Date(to)) {
    return throwAlert('#alert-box','End date should be later than or on Start date')
  }

  let url = `/log?from=${from}&to=${to}`
  if (url) { // require a URL
    window.location = url // redirect
  }
})

// display alert
function throwAlert(loc, msg) {
  $(loc).html(
    `<div class="alert alert-danger alert-dismissible fade show mb-0" role="alert">
      <strong>Error</strong>: ${msg}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`
  )
}