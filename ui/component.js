ObjectRepository.Require('TGP.UI.Component', function() {

    TGP.Namespace('UI');

    TGP.UI.Component = function() {
        this.status = TGP.UI.Component.STATUS.PRE_INIT;

        this.OnStatusChanged = new TGP.Utils.Observer();
    };

    TGP.UI.Component.STATUS = {
        PRE_INIT:     0,
        INITIALIZING: 1,
        UNLOADED:     2,
        LOADING:      3,
        LOADED:       4,
        UNLOADING:    5
    };

    TGP.UI.Component.prototype.ResetStatus = function() {
        switch (this.status) {
            case TGP.UI.Component.STATUS.UNLOADING:
                this.ChangeStatus(TGP.UI.Component.STATUS.LOADED);
                break;
            case TGP.UI.Component.STATUS.LOADING:
                this.ChangeStatus(TGP.UI.Component.STATUS.UNLOADED);
                break;
            case TGP.UI.Component.STATUS.INITIALIZING:
                this.ChangeStatus(TGP.UI.Component.STATUS.PRE_INIT);
                break;
        }
    };

    TGP.UI.Component.prototype.ChangeStatus = function(newStatus) {
        var prevStatus = this.status;

        if (this.status !== newStatus) {
            this.status = newStatus;
        }

        this.OnStatusChanged.Trigger(prevStatus, newStatus);
    };

    TGP.UI.Component.prototype.InitState = function(finishCallback) {
        if (this.status === TGP.UI.Component.STATUS.PRE_INIT) {
            var thisState = this;
            flow.exec(
                function() {
                    thisState.ChangeStatus(TGP.UI.Component.STATUS.INITIALIZING);

                    if (thisState.Init) {
                        thisState.Init(this);
                    } else {
                        this();
                    }
                },
                function(error) {
                    if (error) {
                        thisState.ResetStatus();
                    } else {
                        thisState.ChangeStatus(TGP.UI.Component.STATUS.UNLOADED);
                    }

                    if (finishCallback) { finishCallback(error); }
                }
            );
        } else {
            if (finishCallback) { finishCallback(); }
        }
    };

    TGP.UI.Component.prototype.LoadState = function(finishCallback) {
        if (this.status === TGP.UI.Component.STATUS.UNLOADED || this.status === TGP.UI.Component.STATUS.PRE_INIT) {
            var thisState = this;
            flow.exec(
                function() {
                    thisState.InitState(this);
                },
                function(error) {
                    if (!error) {
                        thisState.ChangeStatus(TGP.UI.Component.STATUS.LOADING);

                        if (thisState.Load) {
                            thisState.Load(this);
                        } else {
                            this();
                        }
                    } else {
                        this(error);
                    }
                },
                function(error) {
                    if (error) {
                        thisState.ResetStatus();
                    } else {
                        thisState.ChangeStatus(TGP.UI.Component.STATUS.LOADED);
                    }

                    if (finishCallback) { finishCallback(error); }
                }
            );
        } else {
            if (finishCallback) { finishCallback(); }
        }
    };

    TGP.UI.Component.prototype.UnloadState = function(finishCallback) {
        if (this.status === TGP.UI.Component.STATUS.LOADED) {
            var thisState = this;
            flow.exec(
                function() {
                    thisState.ChangeStatus(TGP.UI.Component.STATUS.UNLOADING);

                    if (thisState.Unload) {
                        thisState.Unload(this);
                    } else {
                        this();
                    }
                },
                function(error) {
                    if (error) {
                        thisState.ResetStatus();
                    } else {
                        thisState.ChangeStatus(TGP.UI.Component.STATUS.UNLOADED);
                    }

                    if (finishCallback) { finishCallback(error); }
                }
            );
        } else {
            if (finishCallback) { finishCallback(); }
        }
    };

}, true);
