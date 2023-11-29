const url = 'http://127.0.0.1:5000';

function init(){
    // Calls first query
    d3.json(`${url}/api/v1.0/q1`).then(response => {
        console.log(response);
        let components = response.component;
        console.log('Component: ', components);
        let totalAffected = response.sum_pa;

        // Data info
        let trace1 = {
            x: components,
            y: totalAffected,
            type: 'bar'
        };
        let data = [trace1];

        // Layout info
        let layout = {
            title: 'Affected Vehicles by Component category (10 yr)',
            height: 500,
            width: 1200,
            margin: {b:200}
        };

        Plotly.newPlot('bar',data,layout);

    });
// Second query and Pie chart 
d3.json(`${url}/api/v1.0/q2`).then(response => {
        console.log(response);
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
};


init();