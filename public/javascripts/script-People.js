// add button
$('#people-add').click(function() {
  // pls check for empty string, || null
  var data = {
    id: 1207444,
    first_name: 'Zhicong',
    username: 'zhicong',
    area: 'RDA',
    section: 'Eng Proc',
    shift: '1DAY',
    gjs: 'E2',
    status: 'active',
    permission: 'section',
    manager_id: 1038891
  }

  $.ajax({
    url:'/people',
    type: 'POST',
    data: data,

    success: function(msg) {
      alert('Success: ' + msg.rowsAffected + ' row(s) affected')
    },

    error: function(err) {
      alert('Error '+ err.status + ':\r\n' + err.responseText)
    }
  })
})