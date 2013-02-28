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
	
	if(localStorage["options"]==null){
		console.log("Options null in background");
		
		/**
			The below code is all from options.js:loadDefaults()
		*/
			patterns[0] = new objOption("(.*)([\\d]+)($)", true);
			patterns[1] = new objOption("(.*\\/)([\\d]+)([\\/]?[.\\w]{0,5}$)", true);
			console.log("Default options loaded");
		/** */
	}else{
		var temp=JSON.parse(localStorage["options"]);
		console.log("Options seen in background: " + temp);
		console.log(typeof temp + ", " + temp.length);
		for(var i in temp){
			console.log("Parsing object["+i+"]: " + temp[i]);
			patterns[i] = new objOption(temp[i].strRegex, temp[i].enabled.valueOf());
			
			console.log(patterns[i].strRegex + ", " + patterns[i].enabled);
		}
		console.log("After copy, options seen in background: " + patterns);
		console.log(typeof patterns + ", " + patterns.length);
	}
	for(var i in patterns){
		if(patterns[i].enabled.valueOf() && tab.url.match(patterns[i].objRegex)){
			console.log("URL: <" + tab.url + "> matched regular expression: " + patterns[i].strRegex);
			isGoodUrl = true;
			break;
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

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse){
		console.log("Message received..");
		
		if(request.msg == "increment"){
			console.log("INCREMENT from background");
			chrome.tabs.getSelected(null, function(tab){
				var oldurl = tab.url;
				var newurl = oldurl.replace(pattern, function(fullMatch, pre, num, post){
					console.log("Pre: " + pre);
					console.log("Int parsed for incrementation was: " + num);
					console.log("Post: " + post);
					return pre + (Number(num)+1) + post;
				});
				console.log("New URL: " + newurl);
				chrome.tabs.update(tab.tabId, {url: newurl});
			
			});
			}else if(request.msg=="decrement"){
				console.log("DECREMENT from background");
				chrome.tabs.getSelected(null, function(tab){
					var oldurl = tab.url;
					var newurl = oldurl.replace(pattern, function(fullMatch, pre, num, post){
						console.log("Pre: " + pre);
						console.log("Int parsed for decrementation was: " + num);
						console.log("Post: " + post);
						return pre + (Number(num)-1) + post;
					});
					console.log("New URL: " + newurl);
					chrome.tabs.update(tab.tabId, {url: newurl});
				
				});
			}
	}
);