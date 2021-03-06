
var options, delta;

function loadDefaults(){
	loadDefaultOptions();
	loadDefaultDelta();
	loadDefaultPad();
	saveOptions();
}
function loadDefaultOptions(){
	options[0] = new objOption("()([\\d]{1,16})($)", true);
	options[1] = new objOption("(.*\\/[\\d]*?)([\\d]{1,16})([\\/]?[.\\w]{0,5}$)", true);
	console.log("Default options loaded");
	setCheckboxes();
	console.log("Initial checkbox values set");
}
function loadDefaultDelta(){
	delta =1;
	chrome.extension.sendMessage({msg:"updateDelta", delta:delta});
	setDeltaBox();
}

function loadDefaultPad(){
	localStorage["pad"]="ask";//default option
	document.getElementById("pad").value = localStorage["pad"];
}

function onScriptStart(){
	somethingFoundMissing=false;//only re-save things if localStorage is missing something
	
	if(localStorage["options"]==null || localStorage["options"]==undefined){
		console.log("Options array was "+(localStorage["options"]==null ? "null" : "undefined") + " on entry.");
		options = new Array();
		loadDefaultOptions();
		somethingFoundMissing=true;
	}
	else{
		console.log("Options array was found saved!");
		var temp = JSON.parse(localStorage["options"]);
		console.log(temp);
		options = new Array();
		for(var i in temp){
			console.log("Parsing object["+i+"]: " + temp[i]);
			options[i] = new objOption(temp[i].strRegex, temp[i].enabled.valueOf());
		}
		console.log(options);
		
		setCheckboxes();
	}
	
	if(localStorage["delta"]==undefined || Number.isNaN(localStorage["delta"])){
		loadDefaultDelta();
		console.log("Delta value could not be loaded... default: " + delta);
		somethingFoundMissing=true;
	}else{
		delta=Number(localStorage["delta"]);
		console.log("Delta value loaded: " + delta);
		setDeltaBox();
	}
	
	if(localStorage["pad"]==null || localStorage["pad"]==undefined){
		console.log("Pad option was "+(localStorage["pad"]==null ? "null" : "undefined") + " on load.");
		loadDefaultPad();
		somethingFoundMissing=true;
	}else{
		document.getElementById("pad").value = localStorage["pad"];
	}
	
	if(somethingFoundMissing){
		saveOptions();
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
	
	
	//collect padding option
	padSelect = document.getElementById("pad");
	localStorage["pad"] = padSelect.options[padSelect.selectedIndex].value;
	console.log("Pad value saved: " + localStorage["pad"]);
	
	
	var test1 = Number(document.getElementById("textDelta").value);
	var test2 = Number.isNaN(test1);
	
	if(!test2 && test1 > 0){
		delta = Number(document.getElementById("textDelta").value);
		localStorage["delta"] = delta;
		chrome.extension.sendMessage({msg:"updateDelta", delta:delta});
		console.log("Delta value saved: " + localStorage["delta"]);
	}else{
		setDeltaBox();
		alert("Please enter in a valid, positive number for new delta value. Delta value has not been changed. All regex choices have been saved, though.");	
	}
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

function setDeltaBox(){
	document.getElementById("textDelta").value=delta;
}

 function objOption(regex, enabled){
	this.strRegex = regex;
	this.objRegex = new RegExp(regex);
	this.enabled = new Boolean(enabled);
	
	this.isEnabled = isEnabled;
	function isEnabled(){
		return this.enabled.valueOf();
	}
	this.setEnabled=setEnabled;
	function setEnabled(en){
		console.log("Set enabled for option("+this.strRegex+") called with value: " + en);
		this.enabled = new Boolean(en);
		console.log("  Now, it is: " + this.enabled.valueOf());
	}
}


document.addEventListener('DOMContentLoaded', onScriptStart);
document.addEventListener('DOMContentLoaded', function(){
	document.getElementById('btnSave').addEventListener('click', saveOptions);
	document.getElementById('btnRestore').addEventListener('click', loadDefaults);
});

