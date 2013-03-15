
function requestURLChangeFromBackground(sign){
	if(sign >0){
		console.log("Requesting increment frob background");
		chrome.tabs.getSelected(null, function(myTab){
			chrome.extension.sendMessage({msg:"increment", validate:"no", tab:myTab});
		});
		
	}else{
		console.log("Requesting decrement frob background");
		chrome.tabs.getSelected(null, function(myTab){
			chrome.extension.sendMessage({msg:"decrement", validate:"no", tab:myTab});
		});
	}
}

// Add action listeners for buttons as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  console.log("LOADED!!");
  document.getElementById("btnIncrement").addEventListener('click',function(){console.log("increment from event listener");requestURLChangeFromBackground(1);});
  document.getElementById("btnDecrement").addEventListener('click',function(){console.log("decrement from event listener");requestURLChangeFromBackground(-1);});
  
});
