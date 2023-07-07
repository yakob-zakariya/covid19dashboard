const fetchPromise = fetch(`https://api.covidtracking.com/v1/us/daily.json`);
fetchPromise
.then(response =>response.json())
.then((data) =>{
console.log(data[0])    
})
