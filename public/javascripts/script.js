$(document).ready(function() {
  // offset for navbar
  var navHeight = $('#navbar-menu').outerHeight()
  var firstHeight = $('#first-heading').outerHeight()
  var theadHeight = $('thead tr').outerHeight() 
  $('body').css('padding-top', navHeight)
  $('#first-heading').css('top', navHeight)
  $('a.anchor').css('top', (navHeight + firstHeight + theadHeight) * -1.05)

  // initiate data table
  var table = $('#the-table').DataTable({
      fixedHeader: { headerOffset: navHeight + firstHeight },
      stateSave: false,
      paging: false,
      info: false,
      searching: true,
      autoWidth: true,
      order: [],
      select: true,

      // highlight bookmarked row upon page and table load
      initComplete: function(settings, json) {
        var bookmark = window.location.hash
        if (bookmark) {
          $(document).scrollTop( $(bookmark).offset().top )
          $(bookmark).parent().parent().addClass('highlighted')
          setTimeout(function () {
            $(bookmark).parent().parent().removeClass('highlighted')
          }, 1500)
      }}
  })

  // hide columns with a class of '.hide-this' (in the header)
  table.columns( '.hide-this' ).visible( false );

  // highlight bookmarked row upon click
  $('.bookmark-link').click(function() {
    var url = $(this).attr("href")
    var bookmark = url.substring(url.indexOf("#"))
    $(bookmark).parent().parent().addClass('highlighted')
    setTimeout(function () {
      $(bookmark).parent().parent().removeClass('highlighted')
    }, 1500)
  })

  // custom searchbar casts to datatable searchbar
  $('#custom-search').on('input', function(){
    table.search($(this).val()).draw()
  })

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