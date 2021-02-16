function tableInit(tablename) {
  // initiate data table
  var table = $(`#${tablename}-the-table`).DataTable({
      stateSave: false,
      paging: false,
      info: false,
      searching: true,
      autoWidth: false,
      order: [],
      select: true,
      scrollX: true,
      scrollY: '60vh',
      scrollCollapse: true,
      /* fixedColumns:   {
        leftColumns: 3
      } */
  })

  // hide columns with a class of '.hide-this' (in the header)
  table.columns( '.hide-this' ).visible( false )

  // custom searchbar casts to datatable searchbar
  // on enter
  $(`#custom-search-${tablename}`).keypress(function(e) {
    if(e.which == 13){ // enter key pressed
      table.search($(this).val()).draw()
    }
  })

  /* // on input change
  $(`#custom-search-${tablename}`).on('input', function(){
    table.search($(this).val()).draw()
  })
  */

  // append export button to specified location, with export options
  var buttons = new $.fn.dataTable.Buttons(table, {
    buttons: [
        {
            extend: 'copyHtml5',
            text: '<i class="fas fa-copy fa-lg"></i>',
            title: tablename + ' - RDA Self 2.0',
            titleAttr: 'Copy',
            className: 'btn',
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'excelHtml5',
            text: '<i class="fas fa-file-excel fa-lg"></i>',
            title: tablename + ' - RDA Self 2.0',
            titleAttr: 'Excel',
            className: 'btn',
            exportOptions: {
                columns: ':visible'
            }
        }
  ]
  }).container().appendTo($(`#datatables-buttons-${tablename}`))

}