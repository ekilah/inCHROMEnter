
//var pattern = /(.*\/)([\d]+)([\/]?[.\w]{0,5}$)/; //if the URL ends in a number, which is preceeded by a forward slash, and optionally followed by a slash and/or optionally followed by an extension of up to 5 characters (including decimal)

function increment(){
	console.log("INCREMENT");
	chrome.tabs.getSelected(null, function(tab){
		var pattern = chrome.extension.getBackgroundPage().pattern;
		console.log("Pattern retrieved from background: " + pattern);
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
