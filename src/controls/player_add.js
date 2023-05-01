((window) => {
    var fieldName_iTunes = 'ITUNESADVISORY';

    let baseSetTrackSummary = window.playerControlsHandlers.trackSummary.setValue;

    window.playerControlsHandlers.trackSummary.setValue = function (el, playerCtrl, sd) {
        //uitools.toastMessage.show(JSON.stringify(sd), { disableUndo: true });

        //uitools.toastMessage.show(JSON.stringify({ parentalAdvisory, summary: sd.summary }), { disableUndo: true });

        baseSetTrackSummary(el, playerCtrl, sd);

        var parentalAdvisory = getExtendedTagValue(sd, fieldName_iTunes);
        if (parentalAdvisory == "1") {
            let summaryEl = el;
            summaryEl.innerHTML += ' &#127348;' // 🅴 //'<label class="textOther vSeparatorTiny" title="Explicit Content">[E]</label>';
        } else if (parentalAdvisory == "2") {
            let summaryEl = el;
            summaryEl.innerHTML += ' &#127346;' // 🅲
        }

        // summaryEl.innerHTML += '<label class="textOther vSeparatorTiny" title="Explicit Content">[E]</label>';
        // loadIcon("explicit_e_small", (svgData) => {
        //     summaryEl.innerHTML = summaryEl.innerHTML.replace('&#127348;', svgData).replace('[E]', svgData);
        // });
    }

    function getExtendedTagValue(track, extendedTagName) {
        let extendedTags;
        // if (track.getExtendedTagsAsync)
        //     extendedTags = JSON.parse(await track.getExtendedTagsAsync() || "null");
        if (track.asJSON)
            extendedTags = JSON.parse(track.asJSON).extendedTags;

        //uitools.toastMessage.show(JSON.stringify(extendedTags), { disableUndo: true });

        return ((extendedTags || []).find(x => x.title == extendedTagName) || { value: undefined }).value;
    };
})(window);