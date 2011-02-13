ObjectRepository.Require('TGP.FSM.State', function() {

    TGP.Namespace('FSM');

    TGP.FSM.State = function() {
        this.status      = TGP.FSM.State.STATUS.PRE_INIT;

        this.init = this.load = this.unload = null;
        this.loadAfterInit = false;

        this.OnCancel    = new TGP.Utils.Observer();
        this.OnInit      = new TGP.Utils.Observer();
        this.OnLoad      = new TGP.Utils.Observer();
        this.OnUnload    = new TGP.Utils.Observer();

        this.OnCancel.AddListener(this.ResetStatus, this);
        this.OnCancel.AddListener(this.LogCancel, this);
        this.OnInit.AddListener(this.InitDone, this);
        this.OnLoad.AddListener(this.LoadDone, this);
        this.OnUnload.AddListener(this.UnloadDone, this);
    };

    TGP.FSM.State.STATUS = {
        PRE_INIT:     0,
        INITIALIZING: 1,
        UNLOADED:     2,
        LOADING:      3,
        LOADED:       4,
        UNLOADING:    5
    };

    TGP.FSM.State.prototype.ResetStatus = function() {
        switch (this.status) {
            case TGP.FSM.State.STATUS.UNLOADING:
                this.ChangeStatus(TGP.FSM.State.STATUS.LOADED);
                break;
            case TGP.FSM.State.STATUS.LOADING:
                this.ChangeStatus(TGP.FSM.State.STATUS.UNLOADED);
                break;
            case TGP.FSM.State.STATUS.INITIALIZING:
                this.ChangeStatus(TGP.FSM.State.STATUS.PRE_INIT);
                break;
        }
    };

    TGP.FSM.State.prototype.LogCancel = function(errorMessage) {
        if (errorMessage) {
            TGP.Utils.Logger.Warn(errorMessage);
        }
    };

    TGP.FSM.State.prototype.ChangeStatus = function(newStatus) {
        if (this.status !== newStatus) {
            this.status = newStatus;
        }
    };

    TGP.FSM.State.prototype.InitState = function() {
        if (this.status === TGP.FSM.State.STATUS.PRE_INIT) {
            this.ChangeStatus(TGP.FSM.State.STATUS.INITIALIZING);

            if (this.init) {
                this.init({ finish: this.OnInit.GetBoundTrigger(), cancel: this.OnCancel.GetBoundTrigger() });
            } else {
                this.InitDone();
            }
        }
    };

    TGP.FSM.State.prototype.LoadState = function() {
        if (this.status === TGP.FSM.State.STATUS.PRE_INIT) {
            this.loadAfterInit = true;
            this.InitState();
        } else if (this.status === TGP.FSM.State.STATUS.UNLOADED) {
            this.ChangeStatus(TGP.FSM.State.STATUS.LOADING);

            if (this.load) {
                this.load({ finish: this.OnLoad.GetBoundTrigger(), cancel: this.OnCancel.GetBoundTrigger() });
            } else {
                this.OnLoad.Trigger();
            }
        }
    };

    TGP.FSM.State.prototype.UnloadState = function() {
        if (this.status === TGP.FSM.State.STATUS.LOADED) {
            this.ChangeStatus(TGP.FSM.State.STATUS.UNLOADING);

            if (this.unload) {
                this.unload({ finish: this.OnUnload.GetBoundTrigger(), cancel: this.OnCancel.GetBoundTrigger() });
            } else {
                this.OnUnload.Trigger();
            }
        }
    };

    TGP.FSM.State.prototype.InitDone = function() {
        this.ChangeStatus(TGP.FSM.State.STATUS.UNLOADED);
        TGP.Utils.Logger.Info('Initialized: ' + this.stateName);

        if (this.loadAfterInit === true) {
            this.loadAfterInit = false;
            this.LoadState();
        }
    };

    TGP.FSM.State.prototype.LoadDone = function() {
        this.ChangeStatus(TGP.FSM.State.STATUS.LOADED);
        TGP.Utils.Logger.Info('Loaded: ' + this.stateName);
    };

    TGP.FSM.State.prototype.UnloadDone = function() {
        this.ChangeStatus(TGP.FSM.State.STATUS.UNLOADED);
        TGP.Utils.Logger.Info('Unloaded: ' + this.stateName);
    };

}, true);
