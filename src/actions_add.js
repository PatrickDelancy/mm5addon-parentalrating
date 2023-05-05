(() => {

    actions.setParentalRating = {
        title: _('Advisory Rating') + '...',
        hotkeyAble: false,
        disabled: uitools.notMediaListSelected,
        visible: window.uitools.getCanEdit,
        submenu: [
            {
                title: _("No Rating"),
                execute: async () => { await setAdvisoryRating(0); }
            },
            {
                title: _("Explicit"),
                icon: "explicit_e",
                execute: async () => { await setAdvisoryRating(1); }
            },
            {
                title: _("Cleaned"),
                icon: "cleaned_c",
                execute: async () => { await setAdvisoryRating(2); }
            },
        ]
    }

    actions.syncTitleFromAdvisoryTag = {
        title: _("Sync title from advisory tag") + "...",
        hotkeyAble: false,
        disabled: uitools.notMediaListSelected,
        visible: () => {
            if (!window.uitools.getCanEdit())
                return false;

            let config = app.getValue('parentalrating_config', { advisoryInTitle: false });
            return config.advisoryInTitle;
        },
        execute: async () => { await syncTitleFromAdvisoryTag(); }
    }

    window._menuItems.editTags.action.submenu.push({
        action: actions.setParentalRating,
        order: 1,
        grouporder: 11
    }, {
        action: actions.syncTitleFromAdvisoryTag,
        order: 2,
        grouporder: 11
    });

    actions.setPlayingTrackExplicit = {
        title: _('Set now playing track explicit'),
        category: "Edit",
        icon: "explicit_e",
        hotkeyAble: true,
        execute: async () => { setNowPlayingAdvisoryRating(1); }
    }

    actions.setPlayingTrackNotExplicit = {
        title: _('Set now playing track NOT explicit'),
        category: "Edit",
        icon: "explicit_e",
        hotkeyAble: true,
        execute: async () => { setNowPlayingAdvisoryRating(0); }
    }

    async function setAdvisoryRating(newRating) {
        let trackList = await uitools.getSelectedTracklist().whenLoaded();
        if (trackList.count === 0) {
            return;
        }
        let config = app.getValue('parentalrating_config', { advisoryInTitle: false });

        await listAsyncForEach(trackList, async (track, next) => {

            track.beginUpdate && track.beginUpdate();
            await window.uitools.tracklistFieldDefs.itunesAdvisory.setValueAsync(track, newRating, config.advisoryInTitle);
            track.endUpdate && track.endUpdate();

            next();
        }, async () => {
            uitools.toastMessage.show("Updated advisory rating for " + trackList.count + " tracks", { disableUndo: true });
            await trackList.commitAsync();
        });
    }

    async function setNowPlayingAdvisoryRating(newRating) {
        let config = app.getValue('parentalrating_config', { advisoryInTitle: false });
        let track = app.player.getCurrentTrack();

        track.beginUpdate && track.beginUpdate();
        await window.uitools.tracklistFieldDefs.itunesAdvisory.setValueAsync(track, newRating, config.advisoryInTitle);
        track.endUpdate && track.endUpdate();
    }

    async function syncTitleFromAdvisoryTag() {
        let trackList = await uitools.getSelectedTracklist().whenLoaded();
        if (trackList.count === 0)
            return;
        let config = app.getValue('parentalrating_config', { advisoryInTitle: false });

        await listAsyncForEach(trackList, async (track, next) => {
            let rating = await window.uitools.tracklistFieldDefs.itunesAdvisory.getValueAsync(track);

            track.beginUpdate && track.beginUpdate();
            await window.uitools.tracklistFieldDefs.itunesAdvisory.setValueAsync(track, rating, config.advisoryInTitle);
            track.endUpdate && track.endUpdate();

            next();
        }, async () => {
            uitools.toastMessage.show("Updated title for " + trackList.count + " tracks", { disableUndo: true });
            await trackList.commitAsync();
        });
    }

})();
