 //var pattern = /(.*\/)([\d]+)([\/]?[.\w]{0,5}$)/; //if the URL ends in a number, which is preceeded by a forward slash, and optionally followed by a slash and/or optionally followed by an extension of up to 5 characters (including decimal)
var patterns;
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
 
 function checkForUrlMatch(tabId, changeInfo, tab) {
	patterns= new Array();
	var isGoodUrl;// =  tab.url.match(pattern);
	
	loadSavedPatterns();
	
	for(var i in patterns){
		if(patterns[i].enabled.valueOf() && tab.url.match(patterns[i].objRegex)){
			console.log("URL: <" + tab.url + "> matched regular expression: " + patterns[i].strRegex);
			isGoodUrl = true;
			break;
		}else if(!patterns[i].enabled.valueOf()){
			console.log("URL: <" + tab.url + "> matched DISABLED regular expression: " + patterns[i].strRegex);
		}else{
			console.log("URL: <" + tab.url + "> DID NOT match regular expression: " + patterns[i].strRegex);
		}
	}

  
  
  //tab.url.match(/github\.com/);
 // If the URL of the tab contains the string github.com
  if (isGoodUrl) {
   //show page action on this tab
   chrome.pageAction.show(tabId);
   console.log("Adding page action to tab #",tabId," with URL: ",tab.url);
  }
  else
  {
   chrome.pageAction.hide(tabId);
   console.log("Removing page action from tab: ", tabId);
  }
 };
 
//Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForUrlMatch);
console.log("hello?");

var defaultDelta;
if(localStorage["delta"]==undefined || Number.isNaN(localStorage["delta"])){
	defaultDelta=1;
	console.log("Delta value could not be loaded in background... default: " + delta);
}else{
	defaultDelta=Number(localStorage["delta"]);
	console.log("Delta value loaded in background: " + defaultDelta);
}


function loadSavedPatterns(){
	if(localStorage["options"]==null || localStorage["options"]==undefined){
		console.log("Options array was "+(localStorage["options"]==null ? "null" : "undefined") + " on entry in background.");
		patterns = new Array();
		/**
			The below code is all from options.js:loadDefaults()
		*/
			patterns[0] = new objOption("()([\\d]{1,16})($)", true);
			patterns[1] = new objOption("(.*\\/)([\\d]{1,16})([\\/]?[.\\w]{0,5}$)", true);
			console.log("Default options loaded");
		/** */
	}
	else{
		console.log("Options array was found saved in background!");
		var temp = JSON.parse(localStorage["options"]);
		patterns = new Array();
		for(var i in temp){
			console.log("Parsing object["+i+"]: " + temp[i]);
			patterns[i] = new objOption(temp[i].strRegex, temp[i].enabled.valueOf());
		}
	}
}


chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse){
		console.log("Message received..");
		if(request.msg == "increment"){
			changeURL(defaultDelta);
			
		}else if(request.msg == "decrement"){
			changeURL(-1*defaultDelta);
			
		}else if(request.msg == "updateDelta"){
			defaultDelta=request.delta;
			console.log("Default delta value updated to: " + defaultDelta);
		
		}else{
			console.log("ERROR: unknown message sent. Contents: " + request.msg);
			return;
		}
			
	}
);



function changeURL(delta){
	chrome.tabs.getSelected(null, function(tab){
		console.log("INCREMENT/DECREMENT by: "+delta+" in background");
		var patterns = chrome.extension.getBackgroundPage().patterns;
		console.log("Patterns retrieved from background: " + patterns);
		var oldurl = tab.url;
		var newurl = null;
		var alerted=false;
		for(var i in patterns){
			
			var r = new RegExp(patterns[i].strRegex);
			console.log("Regex to check: " + r);
			newurl= oldurl.replace(r, function(fullMatch, pre, num, post){
				console.log("Full match: " + fullMatch);
				console.log("Pre: " + pre);
				console.log("Int parsed for incrementation was: " + num);
				
				console.log("Post: " + post);
				if(Number(num)==Number.NaN){
					console.log("Err: No number found to increment using regex: "+ patterns[i]);
					return fullMatch;
				}
				else{
					console.log("Int parsed for incrementation was (as a number): " + Number(num));
				}
				if(Number(num) + delta < 0){
					console.error("Cannot handle negative numbers...");
					if(!alerted){//don't bother whining about a negative number if we already did
						alert("inCHROMEnter cannot produce negative numbers in URLs, because future string parsing will not interpret the negative sign. Sorry!");
						alerted = true;
					}
					return fullMatch;
				}
				return pre + (Number(num)+delta) + post;
			});
			if(newurl!=null && newurl!=oldurl){
				console.log("New URL: " + newurl);
				chrome.tabs.update(tab.tabId, {url: newurl});
				return;
			}
			else if(newurl==oldurl){
				console.log("No match...or negative number was generated.");
			}
		}
		console.log("******ERROR: NO regex matched!");
	});
}

/*
console.log("Background.. checking addition. 3072397517134438 + 1 = " + (3072397517134438 + 1));
console.log("Background.. checking addition. 30723975171344384 + 1 = " + (30723975171344384 + 1));
console.log("Background.. checking addition. 307239751713443840 + 1 = " + (307239751713443840 + 1));
console.log("Background.. checking addition. Max value: " + Number.MAX_VALUE);

var x = new Number(307239751713443840 + 1);
console.log("Background.. checking addition. x = " + x.toString());

x = new Number(307239751713443840);
x=x+1;
console.log("Background.. checking addition. x = " + x.toString());*/
