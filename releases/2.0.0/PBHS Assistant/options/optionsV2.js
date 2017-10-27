function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false;
    }
    return true && JSON.stringify(obj) === JSON.stringify({});
}

function loadLayout() {
    $.getJSON("plugins.json", function(data) {
      data = data.plugins[0];
      var layoutSection = $('.flex-row', '#layoutSection');
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var option =
            "<div class=\"checkbox\"><input type=\"checkbox\" id=\"layout" +
            key + "\" name=\"" + key + "\" data-title=\"" + data[key][
              "title"
            ] + "\" data-type=\"" + data[key]["type"] +
            "\"><label for=\"layout" + key +
            "\"><div class=\"layout-container\"><div class=\"layout-title\">" +
            data[key]["title"] +
            "</div><div class=\"layout-description well\">" + data[key][
              "description"
            ] +
            "<i class=\"fa fa-check layout-enabled\"></i><i class=\"fa fa-times layout-disabled\"></i></div></div></label></div>";
          $(layoutSection).append(option);
        }
      }
    });
    showSelectedBoxes();
  }

  function updateStatus(message, devMessage) {
      if(devMessage) {
          console.log(devMessage);
      }
      document.getElementById('statusText').innerText = message;
  }

  function loadCredentials() {
    chrome.storage.local.get('credentials', function(result) {
        if (!isEmpty(result)) {
            document.getElementById('wUser').value = result.credentials.wUser;
            document.getElementById('wPass').value = result.credentials.wPass;
        }
      });
  }

  function loadPlugins() {
    function createMarkup() {
        var data = null;
        var markup = '';
        console.log(this);
        if(this.status = 200) {
            try {
                var data = this.response;
            }
            catch(e) {
                updateStatus('Error parsing plugins.json', e);
            }
            if(data === null) return;

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    markup += '<div class="spacer">';
                    markup += `<input id="layout${key}" name="${key}" data-title="${data[key]["title"]}" data-type="${data[key]["type"]}" type="checkbox">`;
                    markup += `<label for="layout${key}">${data[key]["title"]}</label>`;
                    markup += `<div class="spacer-double">${data[key]["description"]}</div>`;
                    markup += '</div>';
                }
            }
            document.getElementById('plugins').innerHTML = markup;
            showSelectedPlugins();
        } else {
            updateStatus('Error downloading plugins.json', 'status: ' + this.status);
        }
    }
    
    var request = new XMLHttpRequest();
    request.open("GET", "plugins.json", true);
    request.responseType = 'json';
    request.addEventListener("load", createMarkup);
    request.send();
  }

  function showSelectedPlugins() {
    chrome.storage.local.get('layout', function(result) {
        for (var key in result["layout"]) {
          if (result["layout"].hasOwnProperty(key)) {
              var element = document.querySelector(`input[name="${result["layout"][key]["name"]}"]`);
              if(element) {
                  element.checked = true;
              }
          }
        }
      });
  }

  function saveOptions() {
    var credentials = {
        'wUser': document.getElementById('wUser').value,
        'wPass': document.getElementById('wPass').value,
    };
    layout = [];

    var activePlugins = document.querySelectorAll('input:checked');

    activePlugins.forEach(function(element, index, list){
        if(element.checked) {
            layout.push({
                'name': element.name,
                'title': element.dataset.title,
                'type': element.dataset.type
              });
        }
    });

    chrome.storage.local.set({
        'credentials': credentials,
        'layout': layout
      }, function() {
        if(chrome.runtime.lastError == null){
          updateStatus('Options saved successfully');
        }
        else {
          updateStatus('Error while saving options', chrome.runtime.lastError);
        }
      });
  }

  loadPlugins();
  loadCredentials();
  document.getElementById('save').addEventListener('click', saveOptions);