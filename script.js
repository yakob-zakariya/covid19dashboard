function abbrState(input, to){
    
    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to == 'abbr'){
        input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        for(i = 0; i < states.length; i++){
            if(states[i][0] == input){
                return(states[i][1]);
            }
        }    
    } else if (to == 'name'){
        input = input.toUpperCase();
        for(i = 0; i < states.length; i++){
            if(states[i][1] == input){
                return(states[i][0]);
            }
        }    
    }
}

const fetchPromise = fetch(`https://api.covidtracking.com/v1/us/daily.json`);
fetchPromise
.then(response =>response.json())
.then((data) =>{
    const deathData = []
    const posetiveData = []
    for(let i=0;i<12;i++){
     deathData.push(data[i].death);
     posetiveData.push(data[i].positive)
    };


    Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Covi19 positive Vs death data 2021',
        align: 'center'
    },
    subtitle: {
        text:
            'Source: <a target="_blank" ' +
            'href="https://www.indexmundi.com/agriculture/?commodity=corn">covid19 Data</a>',
        align: 'center'
    },
    xAxis: {
        categories: ['JAN', 'FEB', 'MAR','APR','MAY', 'JUN', 'JUL', 'AUG','SEP','OCT','NOV','DEC'],
        crosshair: true,
        accessibility: {
            description: 'Countries'
        }
    
},
    yAxis: {
        min: 0,
        title: {
            text: 'Millions'
        }
    },
    tooltip: {
        valueSuffix: ' (1000 MT)'
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [
        {
            name: 'Death',
            data: deathData
        },
        {
            name:'posetive',
            data:posetiveData
        }
    
    ]
});
})
const fetchPromise2 = fetch('https://api.covidtracking.com/v1/states/current.json');
fetchPromise2
.then(responses =>responses.json())
.then((data) =>{
    const allData = {};
    const states = [];
    const death = []
    let sum = 0;
    let op = []
    for(state of data){
     states.push(state.state);
     death.push(state.death)
     sum += state.death
    
    }
    states.forEach((value,index)=>{
        let st = abbrState(states[index],'name');
        op.push({name:st,y:death[index]/sum})
        
    })


    // Data retrieved from https://netmarketshare.com
Highcharts.chart('container1', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Current US covid19 death comaparsion by States',
        align: 'center'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
        }
    },
    series: [{
        name: 'Death Rate',
        colorByPoint: true,
          data:op
    }]
});

})


function getMonthString(monthNumber) {
const months = [
 'January', 'February', 'March', 'April', 'May', 'June',
 'July', 'August', 'September', 'October', 'November', 'December'
];

// Adjust the monthNumber to be within the range of valid months
monthNumber = Math.max(1, Math.min(12, monthNumber));

// Retrieve the corresponding month string
let  monthString = months[monthNumber - 1];

return monthString;
}
const fetchPromis3 = fetch('https://api.covidtracking.com/v1/us/daily.json')
fetchPromis3
.then(response =>response.json())
.then((response) =>{
const deathData = [];
const postiveData = [];
const deathCase = {}
const positiveCase = {}
let sum = 0;
for(let i = 0;i<response.length;i++){
   let date = `${response[i].date}`;
   let year = date.slice(0,4);
   let month= getMonthString(Number(date.slice(4,6)));

   if(deathCase[`${month}-${year}`]){
       deathCase[`${month}-${year}`] = deathCase[`${month}-${year}`] + response[i].death;
   }
   else{
       deathCase[`${month}-${year}`] = response[i].death;
   }

   if(positiveCase[`${month}-${year}`]){
       deathCase[`${month}}-${year}`] = positiveCase[`${month}-${year}`] + response[i].positive;
   }
   else{
       positiveCase[`${year}-${month}-01`] = response[i].positive;
   }
}
for(let x in deathCase){
   let d = {month:x,death:deathCase[x]}
   deathData.push(d)
}

for(let x in positiveCase){
   let d = {month:x,death:positiveCase[x]}
   postiveData.push(d)
}
deathData.reverse();
postiveData.reverse();
deathData[0].death = 0;
postiveData[0].positive = 0;

// Create an array to store the xAxis categories
const  xAxisCategories = deathData.map(item => item.month);
const  xAxisCategories1 = postiveData.map(item => item.month);

// Create an array to store the yAxis values
const yAxisValues = deathData.map(item => item.death);
const yAxisValues1 = postiveData.map(item => item.death);

// Create the Highcharts chart
Highcharts.chart('chartContainer3', {
chart: {
type: 'line'
},
title: {
text: 'Positive and Death comparsion for covi19 starting from january 2020 until march 2021'
},
xAxis: {
categories: xAxisCategories
},
yAxis: {
title: {
 text: 'Death and Positive'
}
},

series: [
{
name: 'Death Cases',
tooltip: {
formatter: function() {
 var pointIndex = this.point.index;
 var month = xAxisCategories[pointIndex];
 var death = yAxisValues[pointIndex];
 return 'Month: ' + month + '<br>Death: ' + death;
}
},
data: yAxisValues
},
{
name: 'Postive Cases',
tooltip: {
formatter: function() {
 const pointIndex = this.point.index;
 const month = xAxisCategories1[pointIndex];
 const positive = yAxisValues1[pointIndex];
 return 'Month: ' + month + '<br>Posivtive: ' + death;
}
},
data:yAxisValues1
}
]
});

})

