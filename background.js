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