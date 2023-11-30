const url = 'http://127.0.0.1:5000';

function init(){
    // Calls first query
    d3.json(`${url}/api/v1.0/q1`).then(response => {
        let components = response.component;
        let totalAffected = response.sum_pa;

        // Bar chart info
        let trace1 = {
            x: components.slice(0,10),
            y: totalAffected.slice(0,10),
            type: 'bar',
            marker: {color: '#647C90'}
        };
        let data = [trace1];

        let layout = {
            title: 'Top 10, Number of Affected Vehicles<br>by Component category (10 yr)',
            margin: {b:100},
            xaxis: {
                tickfont: {size: 10}
            }
        };

        Plotly.newPlot('bar',data,layout);

        // Create selector2 options and properties for timeseries dataset for fourth query
        compSort = components.sort();
        let selector2 = d3.select('#selDataset2');
        for (let i = 0; i < compSort.length; i++){
            selector2.append('option').text(compSort[i]).property('value',compSort[i]);
        };
        let firstComponent = compSort[0];
        buildChart2(firstComponent);

    });

    // Second query and Pie chart using chart.js
    d3.json(`${url}/api/v1.0/q2`).then(response => {
        console.log('q2 : ',response);
        let manufacturers = response.manufacturer;
        let totalAffected = response.sum_pa;
        console.log('manufacturers: ', manufacturers,totalAffected);
        
        // Data info
        const customColors = [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
        ];
        const data = {
        labels: manufacturers,
        datasets: [
            {
            label: 'Potentially Affected Manufacturers',
            data: totalAffected,
            backgroundColor: customColors ,
            borderColor: customColors,
            borderWidth: 1
            }
        ]
        };

        var ctx = document.getElementById('pie').getContext('2d');
        var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                plugins: {
                  title: {
                    display: true,
                    text: 'Potentially Affected Manufacturers (n=73613074)',
                    fontSize: 36
                  },
                  tooltip: {
                    callbacks: {
                        label: function(context) {
                            
                            var dataset = context.dataset; 
                            var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                            });
                            var currentValue = dataset.data[context.dataIndex];
                            var percentage = ((currentValue / total) * 100).toFixed(2);
                            return currentValue + ' (' + percentage + '%)';
                        }
                    }
                }
             },
                
            },
        });      
    });


    // Calls third query
    d3.json(`${url}/api/v1.0/q3`).then(response => {
        // get unique year values from response for dropdown list
        let yearArray = response.map(response => response.year);
        let yearUnique = yearArray.filter((value, index) => yearArray.indexOf(value)===index);
        console.log('Years: ', yearUnique);

        // Create selector1 options and properties for first dropdown menu
        let selector1 = d3.select('#selDataset1');
        for (let i = 0; i < yearUnique.length; i++){
            selector1.append('option').text(yearUnique[i]).property('value',yearUnique[i]);
        };
        let firstYear = yearUnique[0];
        buildChart1(firstYear);

    });

}

function buildChart1(value){
    d3.json(`${url}/api/v1.0/q3`).then(response => {
        let results = response.filter(response => response.year == value);
        let components = results.map(result => result.component);
        let totalAffected = results.map(result => result.sum_pa);

        // Horizontal bar chart info
        let bar_yticks = components.slice(0,10).reverse();
        let bar_xticks = totalAffected.slice(0,10).reverse();
        
        let barData = [
            {
                y: bar_yticks,
                x: bar_xticks,
                type: 'bar',
                orientation: 'h',
                marker: {color: '#647C90'}
            }
        ];
        let barLayout = {
            title: `${value} Top 10 Recalls by Category`,
            margin: {l:150},
            yaxis: {
                tickfont: {size: 10}
            }
        };

        Plotly.newPlot('bar1', barData, barLayout);
    });
};

function option1Changed(value){
    buildChart1(value);
}

// Fourth query and Polar chart using chart.js
d3.json(`${url}/api/v1.0/q4`).then(response => {
    console.log(response);
    let recall_type = response.component;
    let num_manufacturers = response.sum_pa;
    console.log('num_manufacturers: ',num_manufacturers)
    
    var total = num_manufacturers.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
    }, 0);
    console.log('total manufacturer: ',total)
    var percent_manufacturers = num_manufacturers.map(function (value) {
        return value * 100 / total;
    });
    console.log(percent_manufacturers)
    
    // Data info
    const customColors = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
    ];

    const customColors2 = [
        'rgb(148, 0, 211)',  // Violet
        'rgb(255, 127, 0)',  // Orange
        'rgb(75, 0, 130)',   // Indigo
        'rgb(0, 255, 0)',    // Green
        'rgb(0, 0, 255)',    // Blue
        'rgb(255, 255, 0)',  // Yellow
        'rgb(255, 0, 0)'     // Red
    ]

    const data = {
    labels: recall_type,
    datasets: [
        {
        label: '% of Major Components Recalled  ',
        data: percent_manufacturers,
        backgroundColor: customColors2 ,
        borderColor: customColors2,
        borderWidth: 1
        }
    ]
    };

    var ctx = document.getElementById('polar').getContext('2d');
    var myPolarChart = new Chart(ctx, {
        type: 'polarArea',
        data: data,
        options: {
            plugins: {
              title: {
                display: true,
                text: '% of Major Components Recalled (excluding Air Bags)',
                fontSize: 36
              },
              tooltip: {
                callbacks: {
                    label: function(context) {
                        
                        var dataset = context.dataset; 
                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                        return previousValue + currentValue;
                        });
                        var currentValue = dataset.data[context.dataIndex];
                        var percentage = ((currentValue / total) * 100).toFixed(2);
                        return currentValue + ' (' + percentage + '%)';
                    }
                }
            }
         },
            
        },
    });
});

// Fifth query (time series)
function buildChart2(value){
    d3.json(`${url}/api/v1.0/q5`).then(response => {
        let startDate = response[0].date_reported;
        let endDate = response[response.length-1].date_reported;
        let results = response.filter(response => response.component == value);
        let date = results.map(result => result.date_reported);
        let noVehicles = results.map(result => result.affected);
        let components = results.map(result => result.component);
        let mfr = results.map(result => result.manufacturer);
        let subject = results.map(result => result.subject);
        
        // Create timeseries chart
        let trace1 = {
            x: date,
            y: noVehicles,
            type: 'scatter',
            line: {color: '#de425b'},
            name: value,
            text: mfr,
            hovertext: subject,
            hovertemplate: '%{y}'+'<br>%{text}'+'<br>%{hovertext}<extra></extra>'
        };
        let data = [trace1];

        let layout = {
            title: 'Time Series, Affected Vehicles',
            xaxis: {
                autorange: true,
                range: [startDate, endDate],
                rangeselector: {buttons: [
                    {
                        count: 6,
                        label: '6m',
                        step: 'month',
                        stepmode: 'backward'
                    },
                    {
                        count: 1,
                        label: '1y',
                        step: 'year',
                        stepmode: 'backward'
                    },
                    {step: 'all'}
                ]},
                rangeslider: {range: [startDate, endDate]},
                type: 'date'
            },
            yaxis: {
                autorange: true,
                type: 'linear'
            }
        };

        Plotly.newPlot('tseries', data, layout);
    });
};

function option2Changed(value){
    buildChart2(value);
};

init();