$(window).keydown(function(event) {
  console.log("key event! keyCode: " + event.keyCode);
  if(event.ctrlKey && event.keyCode == 107) { 
    console.log("Hey! Ctrl+'+' event captured!");
    event.preventDefault(); 
  }
  if(event.ctrlKey && event.keyCode == 109) { 
    console.log("Hey! Ctrl+'-' event captured!");
    event.preventDefault(); 
  }
});

console.log("allpages.js was run!");
