import Highcharts from 'highcharts';
import HighMaps from 'highcharts/highmaps';
import 'bootstrap/js/dist/tab';
import DataTable from 'datatables.net-bs4';
import 'datatables.net-fixedcolumns';
import mapData from '../data/us-all.js';

$(document).ready(function() {

  /* Sales: Sales to Customers */
  if ($('#chart-sales_customers').length > 0) {
    Highcharts.chart('chart-sales_customers', {
      chart: {
        height: 9 / 21 * 100 + '%'
      },
      title: {
        text: 'Sales to Customers'
      },
      xAxis: {
        categories: ['20 May', '21 May', '22 May', '23 May', '24 May', '25 May']
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Sales($)'
        }
      },
      legend: {
        align: 'left',
        x: 30,
        verticalAlign: 'bottom',
        y: 0,
        backgroundColor: Highcharts.theme && Highcharts.theme.background2 || 'white',
        shadow: false
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },
      series: [{
        name: '3P Sales - MFN',
        type: 'column',
        data: [105, 0, 35, 35, 0, 140]
      }, {
        name: '3P Sales - FBA',
        type: 'column',
        data: [119, 0, 52, 39, 26, 0]
      }, {
        name: 'Amazon Sales',
        type: 'column',
        data: [25960, 26450, 52480, 30897, 32584, 0]
      }, {
        name: 'Amazon COGS',
        data: [21545, 25443, 48564, 25153, 31544, 0]
      }],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            chart: {
              height: 300
            },
            subtitle: {
              text: null
            },
            navigator: {
              enabled: false
            }
          }
        }]
      }
    });
  }

  if ($('#chart-sales_amazon').length > 0) {
    Highcharts.chart('chart-sales_amazon', {
      chart: {
        type: 'column',
        height: 9 / 21 * 100 + '%'
      },
      title: {
        text: 'Sales to Amazon'
      },
      xAxis: {
        categories: ['20 May', '21 May', '22 May', '23 May', '24 May', '25 May']
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Sales($)'
        }
      },
      legend: {
        align: 'center',
        x: 0,
        verticalAlign: 'bottom',
        y: 0,
        backgroundColor: Highcharts.theme && Highcharts.theme.background2 || 'white',
        shadow: false
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}'
      },
      series: [{
        name: 'Amazon PO',
        data: [25960, 26450, 52480, 30897, 32584, 0]
      }, {
        name: 'Amazon Shipped - Confirmed PO',
        data: [25450, 24343, 52130, 29765, 31575, 0]
      }],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            chart: {
              height: 300
            },
            subtitle: {
              text: null
            },
            navigator: {
              enabled: false
            }
          }
        }]
      }
    });
  }

  if ($('#chart-sales_geographic').length > 0) {
    $.getJSON('data/sales-demography.json', function({
      data
    }) {
      // Make codes uppercase to match the map data
      $.each(data, function() {
        this.code = this.code.toUpperCase();
      });

      // Instantiate the map
      HighMaps.mapChart('chart-sales_geographic', {
        title: {
          text: 'Sales per State'
        },
        legend: {
          layout: 'vertical',
          borderWidth: 0,
          backgroundColor: 'rgba(255,255,255,0.85)',
          floating: true,
          verticalAlign: 'middle',
          align: 'right',
          y: 0
        },
        mapNavigation: {
          enabled: true
        },
        colorAxis: {
          dataClasses: [{
            from: 0,
            to: 0.5,
            color: '#ffffff',
            name: ' '
          }, {
            from: 1,
            to: 25,
            color: '#6592CA',
            name: '< 25'
          }, {
            from: 26,
            to: 50,
            color: '#D3DFF0',
            name: '26 - 50'
          }, {
            from: 51,
            to: 75,
            color: '#FAB2B5',
            name: '51 - 75'
          }, {
            from: 76,
            color: '#F8696B',
            name: '76 - 100'
          }]
        },
        series: [{
          data: data,
          mapData: mapData,
          joinBy: ['postal-code', 'code'],
          dataLabels: {
            enabled: true,
            color: '#000',
            format: '{point.code}'
          },
          name: 'Sales per State',
          tooltip: {
            pointFormat: '{point.code}: ${point.value}'
          }
        }]
      });
    });
  }

  $('#table-products_trends').DataTable({
    columnDefs: [{
      className: 'text-center',
      targets: 0,
    }, {
      className: 'text-center',
      width: 100,
      targets: [2, 4, 6, 8, 10, 12, 14]
    }, {
      className: 'text-right',
      targets: [1, 3, 5, 7, 9, 11, 13],
      width: 120
    }],
    dom: 'rt<"mt-2 d-flex align-items-center justify-content-between"lp>',
    fixedHeader: true,
    fixedColumns: true,
    orderCellsTop: true,
    scrollX: true,
    scrollCollapse: true,
    scrollY: 300,
  });

  $('#table-customers_trends').DataTable({
    autoWidth: true,
    columnDefs: [{
      className: 'text-center',
      targets: [0, 3, 6, 9, 12, 15, 18]
    }, {
      className: 'text-right',
      width: 100,
      targets: '_all'
    }, {
      targets: [1, 4, 7, 10, 13, 16, 19],
      width: 120
    }],
    dom: 'rt<"my-2 d-flex align-items-center justify-content-between"lp>',
    fixedHeader: true,
    fixedColumns: {
      leftColumns: 1
    },
    orderCellsTop: true,
    scrollX: true,
    scrollCollapse: true,
    scrollY: 300,
  });

  $('#table-customers_trends_new').DataTable({
    columnDefs: [{
      className: 'text-center',
      targets: [0, 3, 6, 9, 12, 15, 18]
    }, {
      className: 'text-right',
      width: 100,
      targets: '_all'
    }, {
      targets: [1, 4, 7, 10, 13, 16, 19],
      width: 120
    }],
    dom: 'rt<"my-2 d-flex align-items-center justify-content-between"lp>',
    fixedHeader: true,
    fixedColumns: {
      leftColumns: 1
    },
    orderCellsTop: true,
    scrollX: true,
    scrollCollapse: true,
    scrollY: 300,
  });

  $('#table-customers_trends_repeat').DataTable({
    columnDefs: [{
      className: 'text-center',
      targets: [0, 3, 6, 9, 12, 15, 18]
    }, {
      className: 'text-right',
      width: 100,
      targets: '_all'
    }, {
      targets: [1, 4, 7, 10, 13, 16, 19],
      width: 120
    }],
    dom: 'rt<"my-2 d-flex align-items-center justify-content-between"lp>',
    fixedHeader: true,
    fixedColumns: {
      leftColumns: 1
    },
    orderCellsTop: true,
    scrollX: true,
    scrollCollapse: true,
    scrollY: 300,
  });

  $('#table-sales_geography').DataTable({
    ajax: 'data/sales-demography.json',
    dom: 'rt<"my-2 d-flex align-items-center justify-content-end"lp>',
    searching: false,
    lengthChange: false,
    fixedHeader: true,
    info: false,
    "pageLength": 7,
    columns: [{
      data: 'code',

      className: 'text-center text-primary',
      render: (data, type, row) => data.toUpperCase()
    }, {
      data: 'value',
      width: '20%',
      className: 'text-right text-primary'
    }, {
      data: 'units',
      className: 'text-center text-primary'
    }]
  });

  $('#table-conversion_metrics').DataTable({
    columnDefs: [{
      targets: [1, 4, 7, 10, 13, 16, 19],
      width: 120
    }, {
      className: 'text-center',
      width: 100,
      targets: '_all'
    }],
    dom: 'rt<"my-2 d-flex align-items-center justify-content-between"lp>',
    fixedHeader: true,
    fixedColumns: {
      leftColumns: 1
    },
    orderCellsTop: true,
    scrollX: true,
    scrollCollapse: true,
    scrollY: 300,
  });

  $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    $($.fn.dataTable.tables(true)).DataTable()
      .columns.adjust().draw();
  });

});
