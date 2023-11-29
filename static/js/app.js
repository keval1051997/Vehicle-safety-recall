const url = 'http://127.0.0.1:5000';

function init(){
    // Calls first query
    d3.json(`${url}/api/v1.0/q1`).then(response => {
        //console.log(response);
        let components = response.component;
        //console.log('Component: ', components);
        let totalAffected = response.sum_pa;

        // Data info
        let trace1 = {
            x: components.slice(0,10),
            y: totalAffected.slice(0,10),
            type: 'bar'
        };
        let data = [trace1];

        // Layout info
        let layout = {
            title: 'Top 10, Number of Affected Vehicles<br>by Component category (10 yr)',
            //height: 500,
            //width: 1200,
            margin: {b:100}
        };

        Plotly.newPlot('bar',data,layout);

    });

    // Second query and Pie chart using chart.js
    d3.json(`${url}/api/v1.0/q2`).then(response => {
        //console.log(response);
        let manufacturers = response.manufacturer;
        let totalAffected = response.sum_pa;
        console.log('manufacturers: ', manufacturers,totalAffected);
        //const DATA_COUNT = 5;
        
        
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
            label: 'Potentially affected Manufacturers',
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
                    text: 'Potentially affected Manufacturers',
                    fontSize: 36
                  }
                }
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

};

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
                orientation: 'h'
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

function optionChanged(value){
    buildChart1(value);
}

init();