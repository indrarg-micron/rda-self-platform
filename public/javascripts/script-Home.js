$(document).ready(function () {
  // offset for navbar
  var navHeight = $('#navbar-menu').outerHeight()
  $('body').css('padding-top', navHeight)

  // individual
  if ( user.gjs[0] == 'T' ) {
    $.ajax({
      url:'/api/indiv-table',
      type: 'POST',
      data: {
        username: user.name
      },
  
      success: function(msg) {
        $('#indiv-table-container').html(msg)
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
  }

/*
  if ( user.permission == 'admin' || user.section == 'Ops') {
    $.ajax({
      url:'/',
      type: 'POST',
      data: {section: 'Ops'},
  
      success: function(msg) {
        // generateChart(msg, 'ops-container', 'Ops Overall')
        $('#ops-container').val(msg.recordset)
        console.log(msg)
      },
  
      error: function(err) {
        throwAlert('#ops-container', ' Ops Overall chart failed to load')
      }
    })
  }


  var example = [{
    name: 'Installation',
    data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
  }, {
    name: 'Manufacturing',
    data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
  }, {
    name: 'Sales & Distribution',
    data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
  }, {
    name: 'Project Development',
    data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
  }, {
    name: 'Other',
    data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
  }]
  generateChart(example, 'engproc-container', 'Eng Process Overall')
  generateChart(example, 'equip-container', 'Equipment Overall')

  */
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

// Generate chart
function generateChart(data, location, title) {
  // prepare the data
  
  // Highcharts proper
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
        text: 'Number of Employees'
      }
    },

    xAxis: {
      accessibility: {
        rangeDescription: 'Range: 2010 to 2017'
      }
    },

    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },
        pointStart: 2010,
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

    series: data,

    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
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