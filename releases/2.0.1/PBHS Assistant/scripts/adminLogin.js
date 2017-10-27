chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case "adminLogin":
      login(message, sendResponse, message.tabId);
      return true;
      break;
  }
});

function login(message, callback, tabId) {
  var status = {
    completed: false,
    message: ""
  }
  if (window.location.pathname.indexOf('wp-login') == -1 ) {
      globalNavigateTab(globalGetBaseUrl() + "/admin", tabId);
  } else {
    chrome.storage.local.get('credentials', function(result) {
      if(chrome.runtime.lastError == null && result.credentials.wUser && result.credentials.wPass){
        globalFullPageNotification('Logging you into wordpress...');
        document.getElementById('user_login').value = result.credentials.wUser;
        document.getElementById('user_pass').value = result.credentials.wPass;
        document.close();
        document.getElementById('loginform').submit();
        status.completed = true;
        status.message = "Logged In";
      }
      else {
        status.message = "No credentials set";
      }
      callback(status);
    });
  }
}
