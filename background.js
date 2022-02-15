chrome.runtime.onInstalled.addListener(function () {
  console.log("Actions Simulator Add-ons installed. Setting up preference storage...");
  const defaultPrefs = {
    enableContinuousListen: false,
    enableAutoInvoke: false,
    forceSmartSpeaker: false,
  };
  chrome.storage.sync.set(defaultPrefs, function () {
    console.log("Actions Simulator Add-ons preference storage initialized:");
    console.log(defaultPrefs);
  });
});

chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { hostEquals: 'console.actions.google.com' },
    })
    ],
    actions: [new chrome.declarativeContent.ShowPageAction()]
  }]);
});

