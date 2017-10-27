//Listens for omnibox commands
chrome.omnibox.onInputEntered.addListener(function(text) {
  if (!isNaN(parseFloat(text)) && isFinite(text)) {
    chrome.tabs.executeScript(null, {file: 'scripts/themeView.js'}, function(){
      paFunctions['themeView'](text);
    });
  }
});
//Listens for keyboard shortcuts
chrome.commands.onCommand.addListener(function(command) {
  try {
    chrome.tabs.executeScript(null, {file: 'scripts/'+command+'.js'}, function(){
        paFunctions[command]();
      });
  } catch (e) {
    console.log("Error: unregistered function");
  }
  return true;
});
//Listens for events comping from popup.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.type) {
    case "globalNavigate":
      chrome.tabs.update(request.tabId, {url: request.url});
      break;
    default:
      try {
        chrome.tabs.executeScript(null, {file: 'scripts/'+request.type+'.js'}, function(){
          paFunctions[request.type](function(status) {
            sendResponse(status);
          });
        });
      } catch (e) {
        sendResponse({
          completed: false,
          message: "Unregistered function"
        });
      }
    }
  return true;
});

var paFunctions = {
  "adminLogin" : function(respond, tabId) {
    if(tabId) {
      chrome.tabs.get(tabId, function(tab){
        chrome.tabs.sendMessage(tab.id, {
          type: "adminLogin",
          tabId: tab.id
        }, respond);
      });
    }
    else {
      chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "adminLogin",
            tabId: tabs[0].id
          }, respond);
        }
      });
    }
  },
  "comboVideoUpgrade" : function(respond) {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "comboVideoUpgrade"
        }, respond);
      }
    });
  },
  "mapFix" : function(respond) {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "mapFix"
        }, respond);
      }
    });
  },
  "ulFix" : function(respond) {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "ulFix"
        }, respond);
      }
    });
  },
  "themeView" : function(templateNumber) {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "themeView",
          number: templateNumber
        });
      }
    });
  },
  "themeInfo" : function(respond) {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "themeInfo"
        }, respond);
      }
    });
  },
  "copyInfo" : function(respond) {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "copyInfo"
        }, respond);
      }
    });
  },
  "pasteInfo" : function(respond) {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "pasteInfo"
        }, respond);
      }
    });
  },
  "purgeCustomStyles" : function(respond) {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "purgeCustomStyles"
        }, respond);
      }
    });
  },
  "purgeFiles" : function(respond, file) {
    file = typeof file !== 'undefined' ? file : 'css';
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "purgeFiles",
          file: file
        }, respond);
      }
    });
  },
  "purgeMinified" : function(respond) {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "purgeMinified"
        }, respond);
      }
    });
  },
  "dnsLookup" : function(respond) {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "dnsLookup"
        }, respond);
      }
    });
  },
  "liveWidgetView" : function(respond) {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "liveWidgetView"
        }, respond);
      }
    });
  }
};


//Clears stored practice information to prevent pasting the wrong information
function loadedInfo() {
    localStorage.removeItem("practiceName");
    localStorage.removeItem("fullName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("address");
    localStorage.removeItem("city");
    localStorage.removeItem("state");
    localStorage.removeItem("zip");
    localStorage.removeItem("phone");
    localStorage.removeItem("fax");
    localStorage.removeItem("email");
    localStorage.removeItem("specialty");
    localStorage.removeItem("nearby_locations");
    return true;
  }
  //Stores copied practice information so that it can be pasted into the new site

function setLocalStorage(info) {
  localStorage["practiceName"] = info[0];
  localStorage["fullName"] = info[1];
  localStorage["lastName"] = info[2];
  localStorage["address"] = info[3];
  localStorage["city"] = info[4];
  localStorage["state"] = info[5];
  localStorage["zip"] = info[6];
  localStorage["phone"] = info[7];
  localStorage["fax"] = info[8];
  localStorage["email"] = info[9];
  localStorage["specialty"] = info[10];
  localStorage["nearby_locations"] = info[11];
  return true;
}
chrome.webNavigation.onCompleted.addListener(function(details) {
  if (details.url.indexOf('wp-login.php?redirect_to') != -1) {
    chrome.tabs.executeScript(details.tabId, {file: 'scripts/'+'adminLogin'+'.js'}, function(){
        paFunctions.adminLogin(function(response) {}, details.tabId);
      });
  }
});

function rightClickHandler(info, tab) {
  switch (info.menuItemId) {
    case "contextimage":
    chrome.tabs.executeScript(null, {file: 'scripts/'+'purgeFiles'+'.js'}, function(){
        paFunctions.purgeFiles(function(response) {}, info.srcUrl);
      });
      break;
  }
};
chrome.contextMenus.onClicked.addListener(rightClickHandler);
chrome.runtime.onInstalled.addListener(function() {
  var context = "image";
  var title = "Purge image";
  var id = chrome.contextMenus.create({
    "title": title,
    "contexts": [context],
    "id": "context" + context
  });
});

function currentExtensionVersion() {
  return chrome.runtime.getManifest().version;
}

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true && JSON.stringify(obj) === JSON.stringify({});
}
