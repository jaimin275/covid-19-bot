let obj = {
  age: "2",
  cough: "2",
  fever: "2",
  headache: "2",
  sore_throat: "2",
  travel_history: "2",
  healthcare_worker: "2",
  shortness_in_breath: "2",
  previous_health_disease: "2",
  covid_19_positive_contact: "2"
}

console.log(JSON.stringify(obj, null, 2));
console.log(typeof obj["age"]);
console.log("\n\n")

/* for (var key in obj) {
  if (obj.hasOwnProperty(key)) {
	  console.log("typeof ",key, " : ", typeof obj[key]);
	  if(typeof obj[key] == "String"){
		  obj[key] = +obj[key];
	  }
	  console.log("typeof ",key, " : ", typeof obj[key]);
  }
}
 */
for(var prop in obj){
        if(obj.hasOwnProperty(prop) && obj[prop] !== null && !isNaN(obj[prop])){
            obj[prop] = +obj[prop];   
        }
    }

console.log(JSON.stringify(obj, null, 2));
console.log(typeof obj["age"]);