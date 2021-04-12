$(document).ready(function() {
  // offset for navbar - ideally should recalculate on window resize
  let navHeight = $('#navbar-menu').outerHeight()
  let firstHeight = $('#first-heading').outerHeight()
  let theadHeight = $('thead tr').outerHeight() 
  $('body').css('padding-top', navHeight)
  $('#first-heading').css('top', navHeight)
  $('a.anchor').css('top', (navHeight + firstHeight + theadHeight) * -1.05)

  // initiate data table
  let table = $('#the-table').DataTable({
      fixedHeader: { headerOffset: navHeight + firstHeight },
      stateSave: false,
      paging: false,
      info: false,
      searching: true,
      autoWidth: false,
      order: [],
      select: true,

      // highlight bookmarked row upon page and table load
      initComplete: function(settings, json) {
        let bookmark = window.location.hash
        if (bookmark) {
          $(document).scrollTop( $(bookmark).offset().top )
          $(bookmark).parent().parent().addClass('highlighted')
          setTimeout(function () {
            $(bookmark).parent().parent().removeClass('highlighted')
          }, 1500)
      }}
  })

  // hide columns with a class of '.hide-this' (in the header)
  table.columns( '.hide-this' ).visible( false )

  // highlight bookmarked row upon click
  $('.bookmark-link').click(function() {
    let url = $(this).attr("href")
    let bookmark = url.substring(url.indexOf("#"))
    $(bookmark).parent().parent().addClass('highlighted')
    setTimeout(function () {
      $(bookmark).parent().parent().removeClass('highlighted')
    }, 1500)
  })

  // custom searchbar casts to datatable searchbar
  // on enter
  $('#custom-search').keypress(function(e) {
    if(e.which == 13){ // enter key pressed
      table.search($(this).val()).draw()
    }
  })

  /* // on input change
  $('#custom-search').on('input', function(){
    table.search($(this).val()).draw()
  })
  */

  // append export button to specified location, with export options
  let buttons = new $.fn.dataTable.Buttons(table, {
    dom: {
      button: {
        tag: 'button',
        className: '' // clear button class name from default ones 
      }
    },
    buttons: [
        {
            extend: 'copyHtml5',
            text: '<i class="fas fa-copy fa-lg"></i>',
            titleAttr: 'Copy',
            className: 'btn'
        },
        {
            extend: 'excelHtml5',
            text: '<i class="fas fa-file-excel fa-lg"></i>',
            titleAttr: 'Excel',
            className: 'btn'
        }
  ]
  }).container().appendTo($('#datatables-buttons'))

  // link scrolling of textarea in modal box
  $('.linked').scroll(function(){
    $('.linked').scrollTop($(this).scrollTop()) 
  })

  // clear all input type and alerts on any modal exit
  // also clear delete list inside delete-content
  // extras are clear input, select, checkbox and radio
  $('.modal').on('hidden.bs.modal', function (e) {
    $(this)
      .find('input,textarea,select')
        .val('')
        .end()
      .find('input[type=checkbox], input[type=radio]')
        .prop('checked', '')
        .end()
      .find('.alert')
        .alert('close')
        .end()
      .find('#delete-content')
        .empty()
  })
})