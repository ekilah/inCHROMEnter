
//var pattern = /(.*\/)([\d]+)([\/]?[.\w]{0,5}$)/; //if the URL ends in a number, which is preceeded by a forward slash, and optionally followed by a slash and/or optionally followed by an extension of up to 5 characters (including decimal)

function incrementFromPopup(delta){
	console.log("INCREMENT/DECREMENT by: "+delta+" in popup");
	chrome.tabs.getSelected(null, function(tab){
		var patterns = chrome.extension.getBackgroundPage().patterns;
		console.log("Patterns retrieved from background: " + patterns);
		var oldurl = tab.url;
		var newurl = null;
		var alerted = false;
		for(var i in patterns){
			
			var r = new RegExp(patterns[i].strRegex);
			console.log("Regex to check: " + r);
			newurl= oldurl.replace(r, function(fullMatch, pre, num, post){
				console.log("Pre: " + pre);
				console.log("Int parsed for incrementation was: " + num);
				console.log("Post: " + post);
				if(isNaN(Number(num) + delta) || !isFinite(Number(num) + delta)){
					console.log("Err: No number found to increment using regex: "+ patterns[i]);
					return null;
				}else{
					console.log("Int parsed for incrementation was (as a number): " + Number(num));
					var tempNum= Number(num) + delta;
					console.log("Int parsed after incrementation is (as a number): " +tempNum );
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
				console.log("No match... NewURL was found to be: " + newurl);
			}
		}
		console.log("******ERROR: NO regex matched!");
	});
}



function changeDeltaFromPopup(sign){
	fetchUpdatedDefaultDelta();
	incrementFromPopup(sign*defaultDelta);
}

function fetchUpdatedDefaultDelta(){
	//get newest value from background page
	defaultDelta = chrome.extension.getBackgroundPage().defaultDelta;
	console.log("Popup got newest delta from background: " + defaultDelta);
}

var defaultDelta=1;
// Add action listeners for buttons as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  console.log("LOADED!!");
  document.getElementById("btnIncrement").addEventListener('click',function(){console.log("decrement from event listener");changeDeltaFromPopup(1);});
  document.getElementById("btnDecrement").addEventListener('click',function(){console.log("decrement from event listener");changeDeltaFromPopup(-1);});
  
});
