$(window).keydown(function(event) {
  //console.log("key event! keyCode: " + event.keyCode);
  if(event.altKey && (event.keyCode == 107 || event.keyCode ==187)) { //ALT and either numpad plus sign or keybaord plus sign
    //event.preventDefault(); 
	//console.log("Alt+'+' event captured!");
	chrome.extension.sendMessage({msg:"increment"});
  }
  
  if(event.altKey && (event.keyCode == 109 || event.keyCode ==189)) { //ALT and either numpad minus sign or keybaord minus sign
    //event.preventDefault(); 
	//console.log("Alt+'-' event captured!");
	chrome.extension.sendMessage({msg:"decrement"});
  }
});

console.log("allpages.js was run!");
