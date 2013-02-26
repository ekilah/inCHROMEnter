
function increment(){
	console.log("INCREMENT");
	chrome.tabs.getSelected(null, function(tab){
		var pattern = /issues\/[\d]+/;
		var newnum  = parseInt(pattern.exec(tab.url)[0].substring(7));
		console.log("Int parsed for incrementation was: " + newnum);
		newnum++;
		var newurl = tab.url.replace(/issues\/[\d]+/, "issues/"+newnum);
		
		chrome.tabs.update(tab.tabId, {url: newurl});
		
	});
}

function decrement(){
	console.log("DECREMENT");
	
	chrome.tabs.getSelected(null, function(tab){
		var pattern = /issues\/[\d]+/;
		var newnum  = parseInt(pattern.exec(tab.url)[0].substring(7));
		console.log("Int parsed for decrementation was: " + newnum);
		newnum--;
		var newurl = tab.url.replace(/issues\/[\d]+/, "issues/"+newnum);
		
		chrome.tabs.update(tab.tabId, {url: newurl});
		
	});
}

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  console.log("LOADED!!");
  document.getElementById("btnIncrement").addEventListener('click',increment);
  document.getElementById("btnDecrement").addEventListener('click',decrement);
  
});
