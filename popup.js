console.log('Actions Simulator Add-ons: Popup initialized');
document.body.addEventListener('click', console.log);

const bindSetting = function (settingsKey, checkbox) {
  console.log('Actions Simulator Add-ons: bindSetting ' + settingsKey);
  chrome.storage.sync.get(settingsKey, function (data) {
    console.log('Get settings: ' + settingsKey + ' == ' + data[settingsKey]);
    checkbox.checked = data[settingsKey];
  });
  checkbox.addEventListener('change', function (e) {
    let value = e.target.checked;

    chrome.storage.sync.set({ [settingsKey]: value }, function () {
      console.log('Set settings: ' + settingsKey + ' == ' + value);
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const message = { command: "settingChange", settingsKey: settingsKey, value: value };
      console.log('Actions Simulator Add-ons: sending message:', message)
      chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
        console.log(response);
      });
    });
  });
}

var enableContinuousListenCheckbox = document.getElementById('enableContinuousListen');
bindSetting('enableContinuousListen', enableContinuousListenCheckbox);

var enableAutoInvokeCheckbox = document.getElementById('enableAutoInvoke');
bindSetting('enableAutoInvoke', enableAutoInvokeCheckbox);

var forceSmartSpeakerCheckbox = document.getElementById('forceSmartSpeaker');
bindSetting('forceSmartSpeaker', forceSmartSpeakerCheckbox);
