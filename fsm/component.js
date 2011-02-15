ObjectRepository.Require('TGP.FSM.Component', function() {

    TGP.Namespace('FSM');

    TGP.FSM.Component = function() {
        this.status = TGP.FSM.Component.STATUS.PRE_INIT;
    };

    TGP.FSM.Component.STATUS = {
        PRE_INIT:     0,
        INITIALIZING: 1,
        UNLOADED:     2,
        LOADING:      3,
        LOADED:       4,
        UNLOADING:    5
    };

    TGP.FSM.Component.prototype.ResetStatus = function() {
        switch (this.status) {
            case TGP.FSM.Component.STATUS.UNLOADING:
                this.ChangeStatus(TGP.FSM.Component.STATUS.LOADED);
                break;
            case TGP.FSM.Component.STATUS.LOADING:
                this.ChangeStatus(TGP.FSM.Component.STATUS.UNLOADED);
                break;
            case TGP.FSM.Component.STATUS.INITIALIZING:
                this.ChangeStatus(TGP.FSM.Component.STATUS.PRE_INIT);
                break;
        }
    };

    TGP.FSM.Component.prototype.ChangeStatus = function(newStatus) {
        if (this.status !== newStatus) {
            this.status = newStatus;
        }
    };

    TGP.FSM.Component.prototype.InitState = function(finishCallback) {
        if (this.status === TGP.FSM.Component.STATUS.PRE_INIT) {
            var thisState = this;
            flow.exec(
                function() {
                    thisState.ChangeStatus(TGP.FSM.Component.STATUS.INITIALIZING);

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
                        thisState.ChangeStatus(TGP.FSM.Component.STATUS.UNLOADED);
                    }

                    if (finishCallback) { finishCallback(error); }
                }
            );
        } else {
            if (finishCallback) { finishCallback(); }
        }
    };

    TGP.FSM.Component.prototype.LoadState = function(finishCallback) {
        if (this.status === TGP.FSM.Component.STATUS.UNLOADED || this.status === TGP.FSM.Component.STATUS.PRE_INIT) {
            var thisState = this;
            flow.exec(
                function() {
                    thisState.InitState(this);
                },
                function(error) {
                    if (!error) {
                        thisState.ChangeStatus(TGP.FSM.Component.STATUS.LOADING);

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
                        thisState.ChangeStatus(TGP.FSM.Component.STATUS.LOADED);
                    }

                    if (finishCallback) { finishCallback(error); }
                }
            );
        } else {
            if (finishCallback) { finishCallback(); }
        }
    };

    TGP.FSM.Component.prototype.UnloadState = function(finishCallback) {
        if (this.status === TGP.FSM.Component.STATUS.LOADED) {
            var thisState = this;
            flow.exec(
                function() {
                    thisState.ChangeStatus(TGP.FSM.Component.STATUS.UNLOADING);

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
                        thisState.ChangeStatus(TGP.FSM.Component.STATUS.UNLOADED);
                    }

                    if (finishCallback) { finishCallback(error); }
                }
            );
        } else {
            if (finishCallback) { finishCallback(); }
        }
    };

}, true);
