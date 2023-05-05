(() => {
    var fieldName_iTunes = 'ITUNESADVISORY';
    var char_E_html = "&#127348;";
    var char_C_html = "&#127282;";

    let baseSetTrackSummary = window.playerControlsHandlers.trackSummary.setValue;

    window.playerControlsHandlers.trackSummary.setValue = function (el, playerCtrl, sd) {
        baseSetTrackSummary(el, playerCtrl, sd);

        let config = app.getValue('parentalrating_config', { advisoryInTitle: false });
        if (!config.advisoryInTitle) {
            var parentalAdvisory = getExtendedTagValue(sd, fieldName_iTunes);
            let summaryEl = el;
            if (parentalAdvisory == "1") {
                summaryEl.innerHTML += ' ' + char_E_html;
            } else if (parentalAdvisory == "2") {
                summaryEl.innerHTML += ' ' + char_C_html;
            }
        }
    }

    function getExtendedTagValue(track, extendedTagName) {
        let extendedTags;
        if (track.asJSON)
            extendedTags = JSON.parse(track.asJSON).extendedTags;

        return ((extendedTags || []).find(x => x.title == extendedTagName) || { value: undefined }).value;
    };
})();
