chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case "themeView":
      viewTheme(message.number);
      break;
  }
});

var needsRFlag = [
  '2043',
  '2058',
  '2052',
  '2047',
  '2074',
  '2044',
  '2051',
  '2045',
  '2066',
  '2079',
  '2078',
  '2083',
  '2053',
  '2049'
]

function viewTheme(themeNumber) {
  globalFullPageNotification("Navigating to Template #" + themeNumber);
  if(themeNumber >= 2120) {
    window.location = "//www.freewaysites.com/dental/?theme=2120-template&theme_version=" + themeNumber +
      "-template";
  }
  else if(needsRFlag.includes(themeNumber)) {
    window.location = "//www.freewaysites.com/oms/?theme=" + themeNumber +
    "-template-r&preset=Default";
  }
  else {
    window.location = "//www.freewaysites.com/oms/?theme=" + themeNumber +
      "-template&preset=Default";
  }

  void(0);
}
