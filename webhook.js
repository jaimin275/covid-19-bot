// import dependencies for http server
const
  express = require('express'),  //web framework for node.js. giving functionality to get and post request.
  bodyParser = require('body-parser'); //// data parser for http post request. post => bodyParser => body(data).
  
var config = require('./config.js');
  
const app = express().use(bodyParser.json()); // creates express http server and parse json data.
app.set('port', config.PORT);
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(config.PORT, () => {
	  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
	  //logger.info('Express server listening on port '+ server.address().port +' in '+ app.settings.env +' mode');
	});
	
	
app.post('/webhook', (req, res) => {
	console.log("req.body type: ", typeof req.body);
	console.log("req.body:\n", req.body);
	
	var context = convertStringValueToNumber(req.body);
	
	let response_message = getResponse(context);
	
	console.log("response: ", JSON.stringify(response_message, null, 2));
	res.json(response_message);
	//res.json({"sign": response_message["sign"], "severity": response_message["severity"]});
});	

function convertStringValueToNumber(obj){
	for(var prop in obj){
        if(obj.hasOwnProperty(prop) && obj[prop] !== null && !isNaN(obj[prop])){
            obj[prop] = +obj[prop];   
        }
    }
	return obj;
}

function getResponse(context){
	let response_message;
	let isCorona = false;
	let severity;
	
	if((context.age || context.cough || context.fever || context.headache || context.sore_throat || context.travel_history || 
		context.healthcare_worker || context.shortness_in_breath || context.previous_health_disease || context.covid_19_positive_contact) == null){
			
		//response_message = "This test is cancelled. But, you can take this test again by sending message 'i want to take an assessment test'";
	}
	else{
		if((context.travel_history > 1) || (context.healthcare_worker > 1) || (context.covid_19_positive_contact > 1)){
			isCorona = true;
			severity = checkSeverity(context);
		}
		else{
			severity = checkSeverity(context);
		}		
	}
	
	if(severity){
		response_message = {
			"successful": true,
			"sign": isCorona,
			"severity": severity
		}
	}
	else{
		response_message = {
			"successful": false,
			"sign": isCorona,
			"severity": severity
		}
	}
	/*
	if(severity && isCorona == true){
		if(severity == "no"){
			response_message = "Corona positive with no symptoms";
		}
		else if(severity == "mild"){
			response_message = "Corona positive with mild symptoms";
		}
		else if(severity == "moderate"){
			response_message = "Corona positive with moderate symptoms";
		}
		else if(severity == "sever"){
			response_message = "Corona positive with sever symptoms";
		}
		else{
			response_message = "Sorry. We could not identify your result. Please take test again to know the COVID-19 symptoms severity";
		}
	}
	else if(severity && isCorona == false){
		if(severity == "no"){
			response_message = "Corona negative with no symptoms";
		}
		else if(severity == "mild"){
			response_message = "Corona negative with mild symptoms";
		}
		else if(severity == "moderate"){
			response_message = "Corona negative with moderate symptoms";
		}
		else if(severity == "sever"){
			response_message = "Corona negative with sever symptoms";
		}
		else{
			response_message = "Sorry. We could not identify your result. Please take test again to know the COVID-19 symptoms severity";
		}
	}
	else{
		response_message = "Sorry. We could not identify your result. Please take test again to know the COVID-19 symptoms severity";
	}
	*/
	
	return response_message;
}


function checkSeverity(context){
	if((context.fever==1) && (context.cough==1) && (context.shortness_in_breath==1) && (context.headache==1) && (context.sore_throat==1)){
		return "no";
	}
	else if((context.fever==2) && (context.cough==1) && (context.shortness_in_breath==1)){
		return "mild";
	}
	else if((context.fever==3) && (context.cough==1) && (context.shortness_in_breath==1)){
		return "moderate";
	}
	else if((context.fever==1) && (context.cough==2) && (context.shortness_in_breath==1)){
		return "mild";
	}
	else if((context.fever==1) && (context.cough==1) && (context.shortness_in_breath==2)){
		return "mild";
	}
	else if((context.fever==1) && (context.cough==1) && (context.shortness_in_breath==3)){
		return "moderate";
	}
	else if((context.fever==2) && (context.cough==2) && (context.shortness_in_breath==1)){
		if(context.sore_throat==2 || context.headache==2){
			return "moderate";
		}
		else{
			return "mild";
		}
	}
	else if((context.fever==3) && (context.cough==2) && (context.shortness_in_breath==1)){
		return "moderate";
	}
	else if((context.fever==2) && (context.cough==1) && (context.shortness_in_breath==2)){
		return "mild";
	}
	else if((context.fever==3) && (context.cough==1) && (context.shortness_in_breath==2)){
		if(context.sore_throat==2 || context.headache==2){
			return "moderate";
		}
		else{
			return "mild";
		}
	}
	else if((context.fever==2) && (context.cough==1) && (context.shortness_in_breath==3)){
		return "moderate";
	}
	else if((context.fever==3) && (context.cough==1) && (context.shortness_in_breath==3)){
		return "sever";
	}
	else if((context.fever==1) && (context.cough==2) && (context.shortness_in_breath==2)){
		return "mild";
	}
	else if((context.fever==1) && (context.cough==2) && (context.shortness_in_breath==3)){
		return "moderate";
	}
	else if((context.fever==2) && (context.cough==2) && (context.shortness_in_breath==2)){
		return "mild";
	}
	else if((context.fever==2) && (context.cough==2) && (context.shortness_in_breath==3)){
		return "moderate";
	}
	else if((context.fever==3) && (context.cough==2) && (context.shortness_in_breath==2)){
		return "moderate";
	}
	else if((context.fever==3) && (context.cough==2) && (context.shortness_in_breath==3)){
		return "sever";
	}
	else{
		if(context.fever==1){
			if(context.sore_throat==2 || context.headache==2){
				return "mild";
			}
			else{
				return "no";
			}
		}
		else if(context.fever==2){
			return "mild";
		}
		else if(context.fever==3){
			return "moderate";
		}
		else if((context.fever>=2) || (context.cough==2) || (context.shortness_in_breath>=2) || (context.headache==2) || (context.sore_throat==2)){
			return "mild";
		}
		else{
			return "no";
		}
	}
}

/*
function checkSeverity(context){
	if((context.fever==1) && (context.cough==1) && (context.shortness_in_breath==1) && (context.headache==1) && (context.sore_throat==1)){
		return "no";
	}
	else if((context.fever==2) && (context.shortness_in_breath==1)){
		return "mild";
	}
	else if((context.fever>=2) && (context.cough==2) && (context.shortness_in_breath==2)){
		return "moderate";
	}
	else if((context.fever==2) && (context.cough>=1) && (context.shortness_in_breath==3) && (context.headache>=1) && (context.sore_throat>=1)){
		return "sever";
	}
	else{
		return "mild";
	}
}
*/