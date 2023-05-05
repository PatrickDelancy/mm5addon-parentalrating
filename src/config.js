window.configInfo = {
    load: function (pnlDiv, addon) {
        this.config = app.getValue('parentalrating_config', { advisoryInTitle: false });
        var UI = getAllUIElements(pnlDiv);
        UI.chbAdvisoryInTitle.controlClass.checked = this.config.advisoryInTitle;
        // UI.chbAdvisoryInTitleEncoding.controlClass.checked = this.config.advisoryInTitleEncoding == "html";
    },
    save: function (pnlDiv, addon) {
        var UI = getAllUIElements(pnlDiv);
        this.config.advisoryInTitle = UI.chbAdvisoryInTitle.controlClass.checked;
        // this.config.advisoryInTitleEncoding = UI.chbAdvisoryInTitleEncoding.controlClass.checked ? "html" : "none";
        app.setValue('parentalrating_config', this.config);
    }
}