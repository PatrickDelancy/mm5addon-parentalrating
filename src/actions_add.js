(() => {

    var fieldName_iTunes = 'ITUNESADVISORY';

    actions.setParentalRating = {
        title: _('Parental Advisory Rating') + '...',
        hotkeyAble: false,
        disabled: uitools.notMediaListSelected,
        visible: window.uitools.getCanEdit,
        submenu: [
            // {
            //     title: "Inspect",
            //     execute: () => {
            //         let trackList = uitools.getSelectedTracklist();
            //         uitools.toastMessage.show((typeof trackList), { disableUndo: true });
            //     }
            // },
            {
                title: "No Rating",
                execute: async () => { await setParentalAdvisoryRating(0); }
            },
            {
                title: "Explicit",
                icon: "explicit_e",
                execute: async () => { await setParentalAdvisoryRating(1); }
            },
            {
                title: "Cleaned",
                execute: async () => { await setParentalAdvisoryRating(2); }
            },
        ]
    }

    window._menuItems.editTags.action.submenu.push({
        action: actions.setParentalRating,
        order: 60,
        grouporder: 10
    });

    async function setParentalAdvisoryRating(newRating) {
        let trackList = uitools.getSelectedTracklist();

        // uitools.toastMessage.show(JSON.stringify({ newRating }), { disableUndo: true });

        await listAsyncForEach(trackList, async (track, next) => {
            let extendedTags = JSON.parse(await track.getExtendedTagsAsync() || "[]");

            var updatedExtendedTags = JSON.stringify([
                ...extendedTags.filter(x => x.title != fieldName_iTunes),
                { "title": fieldName_iTunes, "value": newRating.toString() }]
            );
            //uitools.toastMessage.show(JSON.stringify({ newRating, updatedExtendedTags }), { disableUndo: true });

            await track.setExtendedTagsAsync(updatedExtendedTags);
            next();
        }, async () => {
            uitools.toastMessage.show(JSON.stringify("Updated tags for " + trackList.count + " tracks"), { disableUndo: true });
            await trackList.commitAsync();
        });
    }

})();