((window) => {

    var fieldName_iTunes = 'ITUNESADVISORY';

    let audioFieldsIndex = window.uitools.tracklistFieldGroups.findIndex(x => x.group === _('Audio'));
    if (audioFieldsIndex < 0) return;
    if (window.uitools.tracklistFieldGroups[audioFieldsIndex].fields.indexOf("parentalAdvisory") >= 0) return;

    window.uitools.tracklistFieldGroups[audioFieldsIndex].fields.push("parentalAdvisory");

    window.uitools.tracklistFieldDefs.parentalAdvisory = {
        title: function () {
            return _('Advisory');
        },
        disabled: false,
        checked: false,
        bindData: function (div, item) {
            let advisoryValue = getExtendedTagValue(item, fieldName_iTunes)
            div.innerHTML = advisoryValue == "1" ? "🅴" : advisoryValue == "2" ? "🅲" : "";
            var tipTxt = advisoryValue == "1" ? "Explicit Content" : advisoryValue == "2" ? "Cleaned" : "No Rating";
            if (tipTxt)
                div.setAttribute('data-tip', tipTxt);
            else
                div.removeAttribute('data-tip');
        },
        getValue: function (item) {
            return getExtendedTagValue(item, fieldName_iTunes);
        },
        width: defaultColWidth,
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