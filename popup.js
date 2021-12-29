

var enableContinuousListen = document.getElementById('enableContinuousListen');

chrome.storage.sync.get('enableContinuousListen', function (data) {
  enableContinuousListen.checked = data.enableContinuousListen;
});

enableContinuousListen.onchange = function (element) {
  let value = this.checked;

  chrome.storage.sync.set({ 'enableContinuousListen': value }, function () {
    console.debug('enableContinuousListen == ' + value);
  });

  if (value) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { command: "init", enableContinuousListen: value }, function (response) {
        console.debug(response.result);
      });
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { command: "remove", enableContinuousListen: value }, function (response) {
        console.debug(response.result);
      });
    });
  }

};

