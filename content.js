const CONTINUOUS_LISTEN_PERIOD = 1000;

let hContinuousListenInterval;

const addListeners = () => {
    console.debug('Actions Simulator Add-ons: addListeners');
    if (hContinuousListenInterval) clearInterval(hContinuousListenInterval);
    hContinuousListenInterval = setInterval(() => {
        console.debug('Checking simulator state...');
        let closeMicButton = $('div[ng-show="$ctrl.micOpen"]');
        if (closeMicButton?.length <= 0 || closeMicButton?.[0]?.ariaHidden == 'true') {
            console.debug('simulator is in standby mode');
            $('button[aria-label="Speak your query"]').click();
        } else {
            console.debug('simulator is in listen mode');
        }
    }, CONTINUOUS_LISTEN_PERIOD);
}

const removeListeners = () => {
    console.debug('Actions Simulator Add-ons: removeListeners');
    if (hContinuousListenInterval) clearInterval(hContinuousListenInterval);
    hContinuousListenInterval = null;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.command === 'init') {
        addListeners();
    } else {
        removeListeners();
    }
    sendResponse({ result: "success" });
});

const init = () => {
    console.debug('Actions Simulator Add-ons running');
    console.debug('Checking storage...');
    chrome.storage.sync.get('enableContinuousListen', function (data) {
        if (data.enableContinuousListen) {
            addListeners();
        } else {
            removeListeners();
        }
    });
}

window.onload = init;
init();