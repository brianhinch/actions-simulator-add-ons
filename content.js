const POLLING_INTERVAL = 1000;

let enableAutoInvokeChipClicked = false;
let forceSmartSpeakerOptionClicked = false;

const handlers = {
    enableContinuousListen: function () {
        // console.debug('enableContinuousListen: Checking simulator state...');
        const closeMicButton = $('div[ng-show="$ctrl.micOpen"]');
        if (closeMicButton?.length <= 0 || closeMicButton?.[0]?.ariaHidden == 'true') {
            console.debug('simulator mic is in standby mode, switching to listen mode...');
            $('button[aria-label="Speak your query"]').click();
        }
    },
    enableAutoInvoke: function () {
        // console.debug('enableAutoInvoke: Checking simulator state...');
        const zeroStateContainerItems = $('div[ng-if="$ctrl.isZeroState"] li');
        if (zeroStateContainerItems?.length > 0 && !enableAutoInvokeChipClicked) {
            // console.debug('simulator is not running an agent');
            for (let item of zeroStateContainerItems) {
                if (item?.textContent.startsWith('Type or say')) {
                    const pattern = /".*?"/g;
                    const found = pattern.exec(item.textContent);
                    console.debug(found[0]);
                    const chipButton = $('div:contains(' + found + ') ~ button.fb-chip-action');
                    if (chipButton) {
                        console.debug('simulator is not running an agent, invoking...')
                        chipButton.click();
                    }
                }
            }
        } else {
            enableAutoInvokeChipClicked = false;
            forceSmartSpeakerOptionClicked = false;
        }
    },
    forceSmartSpeaker: function () {
        const surfaceSmartSpeakerOption = $('div.fb-option-single-select-item:contains("Speaker (e.g. Google Home)")');
        if (surfaceSmartSpeakerOption?.length > 0 && !forceSmartSpeakerOptionClicked) {
            console.debug('simulator is not in smart speaker mode, switching...')
            surfaceSmartSpeakerOption.click();
            forceSmartSpeakerOptionClicked = true;
        } else {
            const surfaceDropdown = $('fb-select[name="surface"] button.fb-select-value');
            if (surfaceDropdown?.length > 0) {
                if (surfaceDropdown.text().indexOf('Speaker') < 0) {
                    surfaceDropdown.click();
                    forceSmartSpeakerOptionClicked = false;
                }
            }
        }
    }

}

let hIntervals = {};

const start = function (key) {
    console.debug(`Actions Simulator Add-ons: start: ${key}`);
    stop(key);
    hIntervals[key] = setInterval(function () {
        // make sure we're not waiting for deployment
        if ($('span:contains(" Your preview is being updated... ")')?.length > 0) {
            console.debug('Actions Simulator Add-ons: skipping poll because deployment is in progress')
            return;
        }
        if (handlers[key]) handlers[key]();
    }, POLLING_INTERVAL);
};

const stop = function (key) {
    if (hIntervals[key] !== undefined) {
        console.debug(`Actions Simulator Add-ons: stop: ${key}`);
        clearInterval(hIntervals[key]);
        hIntervals[key] = undefined;
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.debug('Actions Simulator Add-ons: received message from popup: ', request);
    if (request.command === 'settingChange') {
        if (request.value) {
            start(request.settingsKey);
        } else {
            stop(request.settingsKey);
        }
    }
    sendResponse({ result: "success" });
});

const init = function () {
    console.debug('Actions Simulator Add-ons running');
    console.debug('Checking storage...');
    Object.keys(handlers).forEach(function (settingsKey) {
        console.debug('key == ' + settingsKey + '...');
        chrome.storage.sync.get(settingsKey, function (data) {
            console.debug('key == ' + settingsKey, 'data ==', data);
            if (data[settingsKey]) {
                start(settingsKey);
            } else {
                stop(settingsKey);
            }
        })
    });
}

window.onload = init;
init();