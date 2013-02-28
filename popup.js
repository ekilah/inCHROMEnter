
//var pattern = /(.*\/)([\d]+)([\/]?[.\w]{0,5}$)/; //if the URL ends in a number, which is preceeded by a forward slash, and optionally followed by a slash and/or optionally followed by an extension of up to 5 characters (including decimal)

function increment(){
	console.log("INCREMENT");
	chrome.tabs.getSelected(null, function(tab){
		var patterns = chrome.extension.getBackgroundPage().patterns;
		console.log("Patterns retrieved from background: " + patterns);
		var oldurl = tab.url;
		var newurl = null;
		for(var i in patterns){
			
			var r = new RegExp(patterns[i].strRegex);
			console.log("Regex to check: " + r);
			newurl= oldurl.replace(r, function(fullMatch, pre, num, post){
				console.log("Pre: " + pre);
				console.log("Int parsed for incrementation was: " + num);
				console.log("Post: " + post);
				if(Number(num)==NaN){
					console.log("Err: No number found to increment using regex: "+ patterns[i]);
					return null;
				}
				return pre + (Number(num)+1) + post;
			});
			if(newurl!=null && newurl!=oldurl){
				console.log("New URL: " + newurl);
				chrome.tabs.update(tab.tabId, {url: newurl});
				return;
			}
			else if(newurl==oldurl){
				console.log("No match...");
			}
		}
		console.log("******ERROR: NO regex matched!");
	});
}

function decrement(){
	console.log("DECREMENT");
	chrome.tabs.getSelected(null, function(tab){
		var pattern = chrome.extension.getBackgroundPage().pattern;
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

// Add action listeners for buttons as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  console.log("LOADED!!");
  document.getElementById("btnIncrement").addEventListener('click',increment);
  document.getElementById("btnDecrement").addEventListener('click',decrement);
  
});
