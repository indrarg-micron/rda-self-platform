$(document).ready(function () {
  // offset for navbar
  var navHeight = $('#navbar-menu').outerHeight()
  $('body').css('padding-top', navHeight)

  // individual
  if ( user.gjs[0] == 'T' ) {
    let tablename = 'Individual'
    $.ajax({
      url:'/api/indiv-table',
      type: 'POST',
      data: {
        username: user.name,
        tablename: tablename
      },
  
      success: function(msg) {
        $('#indiv-table-container').html(msg)
        tableInit(tablename)
      },
  
      error: function(err) {
        throwAlert('#indiv-table-container', 'Unable to load table')
      }
    })

    $.ajax({
      url:'/api/indiv-chart',
      type: 'POST',
      data: {
        username: user.name
      },
  
      success: function(msg) {
        chartIndiv(msg, 'indiv-chart-container', 'Q-on-Q Progress')
      },
  
      error: function(err) {
        throwAlert('#indiv-chart-container', 'Unable to load chart')
      }
    })

    $.ajax({
      url:'/api/section-chart',
      type: 'POST',
      data: {
        section: user.section
      },
  
      success: function(msg) {
        chartSection(msg, 'indiv-section-container', user.section + ' Normal Distribution for current Quarter')
      },
  
      error: function(err) {
        throwAlert('#indiv-section-container', 'Unable to load chart')
      }
    })
  }

  // section - eng proc
  if ( user.permission == 'admin' || (user.permission == 'section' && user.section == 'Eng Proc') ) {
    let tablename = 'EngProc'
    $.ajax({
      url:'/api/section-table',
      type: 'POST',
      data: {
        section: 'Eng Proc',
        tablename: tablename
      },
  
      success: function(msg) {
        $('#engproc-table-container').html(msg)
        tableInit(tablename)
      },
  
      error: function(err) {
        throwAlert('#engoroc-table-container', 'Unable to load table')
      }
    })

    $.ajax({
      url:'/api/section-chart',
      type: 'POST',
      data: {
        section: 'Eng Proc'
      },
  
      success: function(msg) {
        chartSection(msg, 'engproc-chart-container', 'Eng Process Normal Distribution')
      },
  
      error: function(err) {
        throwAlert('#engproc-chart-container', 'Unable to load chart')
      }
    })
  }

  // section - equipment
  if ( user.permission == 'admin' || (user.permission == 'section' && user.section == 'Equipment') ) {
    let tablename = 'Equipment'
    $.ajax({
      url:'/api/section-table',
      type: 'POST',
      data: {
        section: 'Equipment',
        tablename: tablename
      },
  
      success: function(msg) {
        $('#equip-table-container').html(msg)
        tableInit(tablename)
      },
  
      error: function(err) {
        throwAlert('#equip-table-container', 'Unable to load table')
      }
    })

    $.ajax({
      url:'/api/section-chart',
      type: 'POST',
      data: {
        section: 'Equipment'
      },
  
      success: function(msg) {
        chartSection(msg, 'equip-chart-container', 'Equipment Normal Distribution')
      },
  
      error: function(err) {
        throwAlert('#equip-chart-container', 'Unable to load chart')
      }
    })
  }

  // section - process
  if ( user.permission == 'admin' || (user.permission == 'section' && user.section == 'Process') ) {
    let tablename = 'Process'
    $.ajax({
      url:'/api/section-table',
      type: 'POST',
      data: {
        section: 'Process',
        tablename: tablename
      },
  
      success: function(msg) {
        $('#proc-table-container').html(msg)
        tableInit(tablename)
      },
  
      error: function(err) {
        throwAlert('#proc-table-container', 'Unable to load table')
      }
    })

    $.ajax({
      url:'/api/section-chart',
      type: 'POST',
      data: {
        section: 'Process'
      },
  
      success: function(msg) {
        chartSection(msg, 'proc-chart-container', 'Process Normal Distribution')
      },
  
      error: function(err) {
        throwAlert('#proc-chart-container', 'Unable to load chart')
      }
    })
  }

  // section - ops
  if ( user.permission == 'admin' || (user.permission == 'section' && user.section == 'Ops') ) {
    let tablename = 'Ops'
    $.ajax({
      url:'/api/section-table',
      type: 'POST',
      data: {
        section: 'Ops',
        tablename: tablename
      },
  
      success: function(msg) {
        $('#ops-table-container').html(msg)
        tableInit(tablename)
      },
  
      error: function(err) {
        throwAlert('#ops-table-container', 'Unable to load table')
      }
    })

    $.ajax({
      url:'/api/section-chart',
      type: 'POST',
      data: {
        section: 'Ops'
      },
  
      success: function(msg) {
        chartSection(msg, 'ops-chart-container', 'Ops Normal Distribution')
      },
  
      error: function(err) {
        throwAlert('#ops-chart-container', 'Unable to load chart')
      }
    })
  }
  
})

// Generate column chart
function chartIndiv(data, location, title) {

  Highcharts.chart(location, {

    chart: {
      type: 'column',
      borderColor: '#39CCCC',
      borderRadius: 5,
      borderWidth: 1,
      height: (9 / 16 * 100) + '%' // 16:9 ratio
    },
    
    title: {
      text: title
    },

    credits: {
      enabled: false
    },

    legend: {
      enabled: false
    },

    xAxis: {
      categories: data.xValues
    },

    yAxis: {
      title: {
        text: 'Total Score'
      }
    },

    plotOptions: {
      series: {
          dataLabels: {
              enabled: true
          }
      }
    },

    series: [{
      name: 'Total score',
      data: data.yValues
    }]
  })

}

// Generate line chart
function chartSection(data, location, title) {
  
  Highcharts.chart(location, {

    chart: {
      borderColor: '#39CCCC',
      borderRadius: 5,
      borderWidth: 1,
      height: (9 / 16 * 100) + '%' // 16:9 ratio
    },
    
    title: {
      text: title
    },

    credits: {
      enabled: false
    },

    yAxis: {
      title: {
        text: ''
      },
      labels: {
        enabled: false
      }
    },
    /*
    xAxis: {
      lineWidth: 0,
      minorGridLineWidth: 0,
      labels: {
          enabled: false
      },
      minorTickLength: 0,
      tickLength: 0
    },
    */
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: false
            }
          }
        },  
      },
    },

    tooltip: {
      enabled: false
    },

    series: data

  })
}


// display alert
function throwAlert(loc, msg) {
  $(loc).html(
    `<div class="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Error</strong>: ${msg}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`
  )
}

// array remove duplicates
// usage: var unique = a.filter(onlyUnique); // where a is array
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}