((window) => {
    var fieldName_iTunes = 'ITUNESADVISORY';

    let baseSetTrackSummary = window.playerControlsHandlers.trackSummary.setValue;

    window.playerControlsHandlers.trackSummary.setValue = function (el, playerCtrl, sd) {
        baseSetTrackSummary(el, playerCtrl, sd);

        var parentalAdvisory = getExtendedTagValue(sd, fieldName_iTunes);
        if (parentalAdvisory == "1") {
            let summaryEl = el;
            summaryEl.innerHTML += ' &#127348;' // 🅴
        } else if (parentalAdvisory == "2") {
            let summaryEl = el;
            summaryEl.innerHTML += ' &#127346;' // 🅲
        }
    }

    function getExtendedTagValue(track, extendedTagName) {
        let extendedTags;
        if (track.asJSON)
            extendedTags = JSON.parse(track.asJSON).extendedTags;

        return ((extendedTags || []).find(x => x.title == extendedTagName) || { value: undefined }).value;
    };
})(window);