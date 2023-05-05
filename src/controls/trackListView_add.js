(() => {

    var fieldName_iTunes = 'ITUNESADVISORY';
    var char_E = "🅴";
    var char_E_html = "&#127348;";
    var char_C = "🄲";
    var char_C_html = "&#127282;";

    let audioFieldsIndex = window.uitools.tracklistFieldGroups.findIndex(x => x.group === _('Audio'));
    if (audioFieldsIndex < 0) return;
    if (window.uitools.tracklistFieldGroups[audioFieldsIndex].fields.indexOf("itunesAdvisory") >= 0) return;

    window.uitools.tracklistFieldGroups[audioFieldsIndex].fields.push("itunesAdvisory");

    window.uitools.tracklistFieldDefs.itunesAdvisory = {
        title: function () {
            return _('Advisory');
        },
        disabled: false,
        checked: false,
        width: 40,
        adaptableSize: false,
        noSorting: true,
        bindData: async function (div, item) {
            let advisoryValue = await getExtendedTagValueAsync(item, fieldName_iTunes)
            div.innerHTML = advisoryValue == "1" ? char_E : advisoryValue == "2" ? char_C : "";
            var tipTxt = advisoryValue == "1" ? "Explicit Content" : advisoryValue == "2" ? "Cleaned" : undefined;
            if (tipTxt)
                div.setAttribute('data-tip', tipTxt);
            else
                div.removeAttribute('data-tip');
        },
        getValueAsync: async function (item) {
            return await getExtendedTagValueAsync(item, fieldName_iTunes);
        },
        setValueAsync: async function (item, newValue, saveToTitle = false) {
            var updated = await setExtendedTagValueAsync(item, fieldName_iTunes, newValue);
            let title = item.title || "";
            title = title
                .replace(char_E, "").replace(char_E_html, "")
                .replace(char_C, "").replace(char_C_html, "")
                .trim();

            if (saveToTitle) {
                switch (newValue.toString().trim()) {
                    case "1": title += " " + char_E; break;
                    case "2": title += " " + char_C; break;
                }
            }
            return checkAndUpdateValue(item, 'title', title) || updated;
        },
    }

    async function getAllExtendedTags(track) {
        let extendedTags;
        if (typeof track.getExtendedTagsAsync == "function") {
            var tagsString = await track.getExtendedTagsAsync();
            extendedTags = JSON.parse(tagsString || "false")
        }
        if (!extendedTags && track.extendedTagsShort)
            extendedTags = JSON.parse(track.extendedTagsShort || "false")
        if (!extendedTags && track.asJSON)
            extendedTags = JSON.parse(track.asJSON || "{}").extendedTags || [];

        return extendedTags || [];
    }

    async function getExtendedTagValueAsync(track, extendedTagName) {
        let extendedTags = await getAllExtendedTags(track);
        return (extendedTags.find(x => x.title == extendedTagName) || { value: undefined }).value;
    };

    async function setExtendedTagValueAsync(track, extendedTagName, newValue) {
        let extendedTags = await getAllExtendedTags(track);
        let existingValue = extendedTags.find(x => x.title == extendedTagName)?.value;
        if (existingValue == newValue.toString())
            return false;

        var updatedExtendedTags = JSON.stringify([
            ...extendedTags.filter(x => x.title != extendedTagName),
            { "title": extendedTagName, "value": newValue.toString() }
        ]);

        if (typeof track.setExtendedTagsAsync == "function")
            await track.setExtendedTagsAsync(updatedExtendedTags)
        else
            throw "Failed to set extended tags!"

        return true;
    };

})();
