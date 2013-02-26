 function checkForUrlMatch(tabId, changeInfo, tab) {
 // If the URL of the tab contains the string github.com
  var isGoodUrl =  tab.url.match(/github\.com/);
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
				var pattern = /issues\/[\d]+/;
				var newnum  = parseInt(pattern.exec(tab.url)[0].substring(7));//will silently fail if URL does not match pattern and nothing will be changed about URL
				console.log("Int parsed for incrementation was: " + newnum);
				newnum++;
				var newurl = tab.url.replace(/issues\/[\d]+/, "issues/"+newnum);
				
				chrome.tabs.update(tab.tabId, {url: newurl});
			
			});
			}else if(request.msg=="decrement"){
				console.log("DECREMENT from background");
				chrome.tabs.getSelected(null, function(tab){
					var pattern = /issues\/[\d]+/;
					var newnum  = parseInt(pattern.exec(tab.url)[0].substring(7));//will silently fail if URL does not match pattern and nothing will be changed about URL
					console.log("Int parsed for decrementation was: " + newnum);
					newnum--;
					var newurl = tab.url.replace(/issues\/[\d]+/, "issues/"+newnum);
					
					chrome.tabs.update(tab.tabId, {url: newurl});
					
				});
			}
	}
);