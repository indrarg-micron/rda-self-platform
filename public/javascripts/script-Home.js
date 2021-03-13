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
  
      success: function(msg) {
        chartIndiv(msg, 'indiv-chart-container', 'Q-to-Q Progress')
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

  // load section
  sectionLoader()
})

// Section loader
function sectionLoader() {
  // section - eng proc
  if ( user.permission == 'admin' || (user.permission == 'section' && user.section == 'Eng Proc') ) {
    sectionAjax('EngProc', 'Eng Proc', 'engproc')
  }

  // section - equipment
  if ( user.permission == 'admin' || (user.permission == 'section' && user.section == 'Equipment') ) {
    sectionAjax('Equipment', 'Equipment', 'equip')
  }

  // section - process
  if ( user.permission == 'admin' || (user.permission == 'section' && user.section == 'Process') ) {
    sectionAjax('Process', 'Process', 'proc')
  }

  // section - ops
  if ( user.permission == 'admin' || (user.permission == 'section' && user.section == 'Ops') ) {
    sectionAjax('Ops', 'Ops', 'ops')
  }
}

// Section generator
function sectionAjax(tablename, sectionname, divname) {
  let quarter = $('#select-fq').val()

  $.ajax({
    url:'/api/section-table',
    type: 'POST',
    data: {
      section: sectionname,
      tablename: tablename,
      quarter: quarter
    },

    success: function(msg) {
      $(`#${divname}-table-container`).html(msg)
      tableInit(tablename)
    },

    error: function(err) {
      throwAlert(`#${divname}-table-container`, `Unable to load ${sectionname} table`)
    }
  })

  $.ajax({
    url:'/api/section-sum',
    type: 'POST',
    data: {
      section: sectionname
    },

    success: function(msg) {
      chartSum(msg, `${divname}-sum-container`, `${sectionname} Total Score Q-on-Q by Shift`)
    },

    error: function(err) {
      throwAlert(`#${divname}-sum-container`, `Unable to load ${sectionname} chart`)
    }
  })

  $.ajax({
    url:'/api/section-chart',
    type: 'POST',
    data: {
      section: sectionname,
      quarter: quarter
    },

    success: function(msg) {
      chartSection(msg, `${divname}-chart-container`, `${sectionname} Normal Distribution for ${$('.selected-fq').html()}`)
    },

    error: function(err) {
      throwAlert(`#${divname}-chart-container`, `Unable to load ${sectionname} chart`)
    }
  })
}

// select FQ from dropdown
$('#select-fq').on('change', function() {
  sectionLoader()
  $('.selected-fq').html( this.value )
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

// Generate stacked column chart
function chartSum(data, location, title) {

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
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical'
    },

    xAxis: {
      categories: data.xCategories
    },

    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
          text: 'Score'
      }
    },

    tooltip: {
      formatter: function () {
        var stackName = this.series.userOptions.stack

        return '<b>' + this.x + '</b><br/>' +
          this.series.name + ': ' + this.y + '<br/>' +
          'Total: ' + this.point.stackTotal + '<br/>' +
          'Shift: ' + stackName
      }
    },

    plotOptions: {
      column: {
        stacking: 'normal'
      }
    },

    series: data.ySeries
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


// display alert, should not be dismissable
function throwAlert(loc, msg) {
  $(loc).html(
    `<div class="alert alert-danger" role="alert">
      <strong>Error</strong>: ${msg}
    </div>`
  )
}

// array remove duplicates
// usage: var unique = a.filter(onlyUnique); // where a is array
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}