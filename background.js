// background.js

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs;
    //alert(activeTab[0].id);
    //chrome.tabs.update(activeTab, {selected: true});
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "open_new_tab" ) {
      //chrome.tabs.create({"url": request.url});
    }
  }
);
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
});

chrome.tabs.onCreated.addListener(function(tab) {
    alert("123123asdfzxcv");
});

chrome.tabs.onUpdated.addListener(function() {
    alert("XX");
});

chrome.tabs.onHighlighted.addListener(function(){
    alert("L");
});
