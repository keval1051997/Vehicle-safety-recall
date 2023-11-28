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

};

init();