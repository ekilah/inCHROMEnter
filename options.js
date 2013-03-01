
var options, delta;

function loadDefaults(){
	loadDefaultOptions();
	loadDefaultDelta();
}
function loadDefaultOptions(){
	options[0] = new objOption("()([\\d]{1,16})($)", true);
	options[1] = new objOption("(.*\\/)([\\d]{1,16})([\\/]?[.\\w]{0,5}$)", true);
	console.log("Default options loaded");
	setCheckboxes();
	console.log("Initial checkbox values set");
}
function loadDefaultDelta(){
	delta =1;
	setDeltaBox();
}

function onScriptStart(){
	if(localStorage["options"]==null || localStorage["options"]==undefined){
		console.log("Options array was "+(localStorage["options"]==null ? "null" : "undefined") + " on entry.");
		options = new Array();
		loadDefaultOptions();
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
	}else{
		delta=Number(localStorage["delta"]);
		console.log("Delta value loaded: " + delta);
		setDeltaBox();
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

function restoreDefaults(){
	options[0]=true;
	options[1]=true;
	setCheckboxes();
	
	delta=1;
	chrome.extension.sendMessage({msg:"updateDelta", delta:delta});
	setDeltaBox();
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

