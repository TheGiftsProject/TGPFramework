ObjectRepository.Require('TGP.FSM.State', function() {

    TGP.Namespace('FSM');

    TGP.FSM.State = function(stateName, init, load, unload) {
        this.stateName   = stateName;
        this.init        = init;
        this.load        = load;
        this.unload      = unload;
        this.status      = TGP.FSM.State.STATUS.PRE_INIT;
        this.OnCancel    = new TGP.Utils.Observer();
        this.OnInit      = new TGP.Utils.Observer();
        this.OnLoad      = new TGP.Utils.Observer();
        this.OnUnload    = new TGP.Utils.Observer();

        this.OnCancel.AddListener(this.ResetStatus, this);
        this.OnInit.AddListener(this.OnInitDone, this);
        this.OnLoad.AddListener(this.OnLoadDone, this);
        this.OnUnload.AddListener(this.OnUnloadDone, this);
    };

    TGP.FSM.State.STATUS = {
        PRE_INIT:     0,
        INITIALIZING: 1,
        INITIALIZED:  2,
        LOADING:      3,
        ACTIVE:       4,
        UNLOADING:    5
    };

    TGP.FSM.State.prototype.ResetStatus = function() {
        switch (this.status) {
            case TGP.FSM.State.STATUS.UNLOADING:
                this.ChangeStatus(TGP.FSM.State.STATUS.ACTIVE);
                break;
            case TGP.FSM.State.STATUS.LOADING:
                this.ChangeStatus(TGP.FSM.State.STATUS.INITIALIZED);
                break;
            case TGP.FSM.State.STATUS.INITIALIZING:
                this.ChangeStatus(TGP.FSM.State.STATUS.PRE_INIT);
                break;
        }
    };

    TGP.FSM.State.prototype.ChangeStatus = function(newStatus) {
        if (this.status !== newStatus) {
            this.status = newStatus;
        }
    };

    TGP.FSM.State.prototype.loadState = function() {
        if (this.init && this.status === TGP.FSM.State.STATUS.PRE_INIT) {
            this.ChangeStatus(TGP.FSM.State.STATUS.INITIALIZING);
            this.init(this.OnInit.GetBoundTrigger());
        } else {
            this.OnInit.Trigger();
        }
    };

    TGP.FSM.State.prototype.OnInitDone = function(errorMessage) {
        if (errorMessage) {
            this.OnCancel.Trigger(errorMessage);
            return;
        }

        this.ChangeStatus(TGP.FSM.State.STATUS.INITIALIZED);
        TGP.Utils.Logger.Info('Initialized: ' + this.stateName);

        if (this.load && this.status === TGP.FSM.State.STATUS.INITIALIZED) {
            this.ChangeStatus(TGP.FSM.State.STATUS.LOADING);
            this.load(this.OnLoad.GetBoundTrigger());
        } else {
            this.OnLoad.Trigger();
        }
    };

    TGP.FSM.State.prototype.OnLoadDone = function(errorMessage) {
        if (errorMessage) {
            this.OnCancel.Trigger(errorMessage);
            return;
        }

        this.ChangeStatus(TGP.FSM.State.STATUS.ACTIVE);
        TGP.Utils.Logger.Info('Loaded: ' + this.stateName);
    };

    TGP.FSM.State.prototype.unloadState = function() {
        if (this.unload && this.status === TGP.FSM.State.STATUS.ACTIVE) {
            this.ChangeStatus(TGP.FSM.State.STATUS.UNLOADING);
            this.unload(this.OnUnload.GetBoundTrigger());
        } else {
            this.OnUnload.Trigger();
        }
    };

    TGP.FSM.State.prototype.OnUnloadDone = function(errorMessage) {
        if (errorMessage) {
            this.OnCancel.Trigger(errorMessage);
            return;
        }

        this.ChangeStatus(TGP.FSM.State.STATUS.INITIALIZED);
        TGP.Utils.Logger.Info('Unloaded: ' + this.stateName);
    };

}, true);
