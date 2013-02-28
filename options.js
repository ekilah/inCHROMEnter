
var options;

function loadDefaults(){
	options[0] = new objOption("[\\d]+$", true);
	options[1] = new objOption("(.*\\/)([\\d]+)([\\/]?[.\\w]{0,5}$)", true);
	console.log("Default options loaded");
	setCheckboxes();
	console.log("Initial checkbox values set");
}

function onScriptStart(){
	if(localStorage["options"]==null){
		console.log("Options array was null on entry.");
		options = new Array();
		loadDefaults();
	}
	else{
		console.log("Options array was found saved!");
		var temp = JSON.parse(localStorage["options"]);
		console.log(temp);
		options = new Array();
		for(var i in temp){
			console.log("Parsing object["+i+"]: " + temp[i]);
			treg = new RegExp(temp[i].regex);
			console.log("Regex: " + treg);
			options[i] = new objOption(temp[i].regex, temp[i].enabled.valueOf());
		}
		console.log(options);
		
		setCheckboxes();
	}
}

function saveOptions(){
	for(i=0; i<options.length;i++){
		var obj;
		if(obj=document.getElementById("default"+i)){
			//object exists
			options[i].setEnabled(obj.checked==true);
			console.log("Saving option " + i + " as " + options[i].isEnabled());
		}
	}
	localStorage["options"] = JSON.stringify(options);
}

function restoreDefaults(){
	options[0]=true;
	options[1]=true;
	
	setCheckboxes();
}


function setCheckboxes(){
	for(i=0; i<options.length;i++){
		var obj;
		if(obj=document.getElementById("default"+i)){
			if(options[i].isEnabled()){
				obj.checked=true;
				console.log("Setting option " + i + " as checked");
			}
			else{
				obj.checked=false;
				console.log("Setting option " + i + " as unchecked");
			}
		}
	}
}

function objOption(regex, enabled){
	this.regex = regex;
	this.enabled = new Boolean(enabled);
	
	this.isEnabled = isEnabled;
	function isEnabled(){
		return this.enabled.valueOf();
	}
	this.setEnabled=setEnabled;
	function setEnabled(en){
		console.log("Set enabled for option("+this.regex+") called with value: " + en);
		this.enabled = new Boolean(en);
		console.log("  Now, it is: " + this.enabled.valueOf());
	}
}


document.addEventListener('DOMContentLoaded', onScriptStart);
document.addEventListener('DOMContentLoaded', function(){
	document.getElementById('btnSave').addEventListener('click', saveOptions);
	document.getElementById('btnRestore').addEventListener('click', loadDefaults);
});

