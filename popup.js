
function requestURLChangeFromBackground(sign){
	if(sign >0){
		console.log("Requesting increment from background");
		chrome.tabs.getSelected(null, function(myTab){
			chrome.extension.sendMessage({msg:"increment", validate:"no", tab:myTab, pad:(padWithZeroes==true?'yes':'no')});
		});
		
	}else{
		console.log("Requesting decrement from background");
		chrome.tabs.getSelected(null, function(myTab){
			chrome.extension.sendMessage({msg:"decrement", validate:"no", tab:myTab, pad:(padWithZeroes==true?'yes':'no')});
		});
	}
}

padWithZeroes=false;

function changeLeadingZero(bool){
	padWithZeroes=(bool?true:false);
	console.log(padWithZeroes?"Now padding...":"No longer padding...");
}


// Add action listeners for buttons as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  console.log("LOADED!!");
  document.getElementById("btnIncrement").addEventListener('click',function(){console.log("increment from event listener");requestURLChangeFromBackground(1);});
  document.getElementById("btnDecrement").addEventListener('click',function(){console.log("decrement from event listener");requestURLChangeFromBackground(-1);});
  document.getElementById("chkLeadingZeroes").addEventListener('click',function(){console.log("leading zero button event");changeLeadingZero(document.getElementById("chkLeadingZeroes").checked);});
});
