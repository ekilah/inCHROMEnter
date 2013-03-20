 //var pattern = /(.*\/)([\d]+)([\/]?[.\w]{0,5}$)/; //if the URL ends in a number, which is preceeded by a forward slash, and optionally followed by a slash and/or optionally followed by an extension of up to 5 characters (including decimal)
var patterns;
var defaultDelta;

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


function validateUrl(tab){
	
	loadSavedPatterns();
	
	for(var i in patterns){
		if(patterns[i].enabled.valueOf() && tab.url.match(patterns[i].objRegex)){
			console.log("URL: <" + tab.url + "> matched regular expression: " + patterns[i].strRegex);
			return true;
		}else if(!patterns[i].enabled.valueOf()){
			console.log("URL: <" + tab.url + "> matched DISABLED regular expression: " + patterns[i].strRegex);
		}else{
			console.log("URL: <" + tab.url + "> DID NOT match regular expression: " + patterns[i].strRegex);
		}
	}
	return false;
}

 
 function checkForUrlMatch(tabId, changeInfo, tab) {
	var isGoodUrl;// =  tab.url.match(pattern);
	
	isGoodUrl = validateUrl(tab);
  
  
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
//document.addEventListener('DOMContentLoaded', checkForUrlMatch);//do this so that if the script is just loaded, the current tab will be checked immediately.
console.log("hello?");


if(localStorage["delta"]==undefined || Number.isNaN(localStorage["delta"])){
	defaultDelta=1;
	console.log("Delta value could not be loaded from storage in background... default: " + defaultDelta);
}else{
	defaultDelta=Number(localStorage["delta"]);
	console.log("Delta value loaded from storage in background: " + defaultDelta);
}


function loadSavedPatterns(){
	if(localStorage["options"]==null || localStorage["options"]==undefined){
		console.log("Options array was "+(localStorage["options"]==null ? "null" : "undefined") + " on entry in background.");
		patterns = new Array();
		/**
			The below code is all from options.js:loadDefaults()
		*/
			patterns[0] = new objOption("()([\\d]{1,16})($)", true);
			patterns[1] = new objOption("(.*\\/[\\d]*?)([\\d]{1,16})([\\/]?[.\\w]{0,5}$)", true);
			localStorage["options"]=JSON.stringify(patterns);
			console.log("Default options loaded and saved.");
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

function getSavedPadOption(){
	if(localStorage["pad"]==null || localStorage["pad"]==undefined){
		console.log("Pad option was "+(localStorage["pad"]==null ? "null" : "undefined") + " on load in background.");
		localStorage["pad"]="ask";//default option
	}
	return (localStorage["pad"]);
}


chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse){
		console.log("Message received..");
		if(request.msg == "increment"){
			if(request.validate && request.validate=="no" && request.tab){
				changeURL(defaultDelta, request.tab, (request.pad?request.pad=='yes':null));
			}else if(sender.tab && validateUrl(sender.tab)){
				changeURL(defaultDelta, sender.tab, (request.pad?request.pad=='yes':null));
			}else if(!sender.tab){
				console.error("Sender was not a tab, background could not verify increment request.");
			}else{
				console.log("Tab with invalid URL tried to ask for increment service w/validation from background. Failed.");
			}
			
		}else if(request.msg == "decrement"){
			if(request.validate && request.validate=="no" && request.tab){
				changeURL(-1*defaultDelta, request.tab, (request.pad?request.pad=='yes':null));
			}else if(sender.tab && validateUrl(sender.tab)){
				changeURL(-1*defaultDelta, sender.tab, (request.pad?request.pad=='yes':null));
			}else if(!sender.tab){
				console.error("Sender was not a tab, background could not verify decrement request.");
			}else{
				console.log("Tab with invalid URL tried to ask for decrement service w/validation from background. Failed.");
			}
			
		}else if(request.msg == "updateDelta"){
			defaultDelta=request.delta;
			console.log("Default delta value updated to: " + defaultDelta);
		
		}else{
			console.log("ERROR: unknown message sent. Contents: " + request.msg);
			return;
		}
			
	}
);



function changeURL(delta, tab, pad){
	//chrome.tabs.getSelected(null, function(tab){
		console.log("INCREMENT/DECREMENT by: "+delta+" in background, from URL: "+tab.url);
		if(!patterns || patterns=='undefined'){
			console.log("Current tab needs to load defaults for background script.. hasn't had the chance yet!");
			loadSavedPatterns();
		}
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
				
				//old strategy
				//return pre + (Number(num)+delta) + post;
				
				//new strategy needed so that leading zeroes are respected
				//09->10
				//09->08
				//10->09 or 10->9 (user's choice...) selected by 'pad' argument
					//if pad is null, then we need to ask user with an alert
					//otherwise, they chose somewhere and we can assume they knew what they wanted
				
				newLength = String(Number(num)+delta).length;
				oldLength = String(num).length;
				newString = String(Number(num)+delta)
				if(newLength < oldLength){
					console.log("Considering leading zeroes.");
					//may need to consider leading zeroes...
					if(Number(Math.pow(10,oldLength-1)+delta)==(Number(num)+delta)){
						console.log("\tDigit boundary crossed.");
						//number rolled over from 10->9 or 100->99 or 1000->999, for example
						if(pad==null){
							tryToLoadPad=getSavedPadOption();
							
							if(tryToLoadPad=="ask"){
								pad=confirm("Do you want to add a leading zero to decremented number?");
							}else{
								pad=(tryToLoadPad=="yes"?true:false);
								console.log("\tDefault pad option from options page being used: " + pad);
							}
						}
						if(pad){
							console.log("\tPadding... old: " + newString);
							for(i=0; i<(oldLength-newLength);i++){
								newString="0".concat(newString);
							}
							console.log("\tPadded... new: " + newString);
						}
					}else{
						//did not roll over a digit boundary. this is a case like
						//09->08, etc.
						//just do it automatically
						console.log("\tAuto Padding... old: " + newString);
						for(i=0; i<(oldLength-newLength);i++){
							newString="0".concat(newString);
						}
						console.log("\tAuto Padded... new: " + newString);
					}
				}
				console.log("Padding considered, new url:" + pre + newString + post);
				return pre + newString + post;
				
				
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
	//});
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
