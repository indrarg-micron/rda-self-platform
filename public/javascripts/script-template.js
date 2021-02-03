$(document).ready(function() {
  // initiate data table
  var table = $(`#${tablename}-the-table`).DataTable({
      stateSave: false,
      paging: false,
      info: false,
      searching: true,
      autoWidth: false,
      order: [],
      select: true,
      scrollY: '60vh',
      scrollCollapse: true
  })

  // hide columns with a class of '.hide-this' (in the header)
  table.columns( '.hide-this' ).visible( false )

  // custom searchbar casts to datatable searchbar
  $(`#custom-search-${tablename}`).on('input', function(){
    table.search($(this).val()).draw()
  })

  // append export button to specified location, with export options
  var buttons = new $.fn.dataTable.Buttons(table, {
    buttons: [
        {
            extend: 'copyHtml5',
            text: '<i class="fas fa-copy fa-lg"></i>',
            titleAttr: 'Copy',
            className: 'btn',
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'excelHtml5',
            text: '<i class="fas fa-file-excel fa-lg"></i>',
            titleAttr: 'Excel',
            className: 'btn',
            exportOptions: {
                columns: ':visible'
            }
        }
  ]
  }).container().appendTo($(`#datatables-buttons-${tablename}`))

})