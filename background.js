chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ enableContinuousListen: true }, function () {
    console.log("Actions Simulator Continuous Listen enabled");
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

