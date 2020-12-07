$(document).ready(function() {
  var table = $('#the-table').DataTable({
      fixedHeader: {
        headerOffset: $('#navbar-menu').outerHeight()
      },
      paging: false,
      info: false,
      order: []
  })

  $('#the-table tbody').on( 'click', 'tr', function () {
    if ( $(this).hasClass('selected') ) {
        $(this).removeClass('selected');
    }
    else {
        table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
} );
})