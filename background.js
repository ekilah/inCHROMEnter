 var pattern = /(.*\/)([\d]+)([\/]?[.\w]{0,5}$)/; //if the URL ends in a number, which is preceeded by a forward slash, and optionally followed by a slash and/or optionally followed by an extension of up to 5 characters (including decimal)
 
 function checkForUrlMatch(tabId, changeInfo, tab) {
  var isGoodUrl =  tab.url.match(pattern);
  
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