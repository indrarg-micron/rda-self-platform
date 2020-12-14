$(document).ready(function() {
  // offset for navbar
  var navHeight = $('#navbar-menu').outerHeight()
  var theadHeight = $('thead tr').outerHeight() 
  $('body').css('padding-top', navHeight)
  $('#first-heading').css('top', navHeight)
  $('a.anchor').css('top', (navHeight * 2 + theadHeight) * -1.05)

  // initiate data table
  var table = $('#the-table').DataTable({
      fixedHeader: { headerOffset: navHeight * 2 },
      stateSave: false,
      paging: false,
      info: false,
      searching: false,
      autoWidth: true,
      order: [],
      select: { style: 'multi' },

      // highlight bookmarked row upon page and table load
      initComplete: function(settings, json) {
        var bookmark = window.location.hash
        if (bookmark) {
          $(document).scrollTop( $(bookmark).offset().top )
          $(bookmark).parent().parent().addClass('highlighted')
          setTimeout(function () {
            $(bookmark).parent().parent().removeClass('highlighted')
          }, 1500);
      }}
  })

  // highlight bookmarked row upon click
  $('.bookmark-link').click(function() {
    var url = $(this).attr("href")
    var bookmark = url.substring(url.indexOf("#"))
    $(bookmark).parent().parent().addClass('highlighted')
    setTimeout(function () {
      $(bookmark).parent().parent().removeClass('highlighted')
    }, 1500);
  })

  // link scrolling of textarea in modal box
  $('.linked').scroll(function(){
    $('.linked').scrollTop($(this).scrollTop()) 
  })
})