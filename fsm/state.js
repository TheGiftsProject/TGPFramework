ObjectRepository.Require('TGP.FSM.State', function() {

    TGP.Namespace('FSM');

    TGP.FSM.State = function(stateName, init, load, unload) {
        this.stateName   = stateName;
        this.init        = init;
        this.load        = load;
        this.unload      = unload;
        this.status      = TGP.FSM.State.STATUS.PRE_INIT;
        this.OnCancel    = new TGP.Utils.Observer();
        this.OnCancel.AddListener(this.ResetStatus, this);
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
                this.status = TGP.FSM.State.STATUS.ACTIVE;
                break;
            case TGP.FSM.State.STATUS.LOADING:
                this.status = TGP.FSM.State.STATUS.INITIALIZED;
                break;
            case TGP.FSM.State.STATUS.INITIALIZING:
                this.status = TGP.FSM.State.STATUS.PRE_INIT;
                break;
        }
    };

    TGP.FSM.State.prototype.loadState = function(postLoadCallback) {
        var thisState = this;

        function DoneInitCallback(errorMessage) {
            if (errorMessage) {
                thisState.OnCancel.Trigger(errorMessage);
                return;
            }

            thisState.status = TGP.FSM.State.STATUS.INITIALIZED;
            TGP.Utils.Logger.Info('Initialized: ' + thisState.stateName);

            if (thisState.load && thisState.status === TGP.FSM.State.STATUS.INITIALIZED) {
                thisState.status = TGP.FSM.State.STATUS.LOADING;
                thisState.load(DoneLoadCallback);
            } else {
                DoneLoadCallback();
            }
        }

        function DoneLoadCallback(errorMessage) {
            if (errorMessage) {
                thisState.OnCancel.Trigger(errorMessage);
                return;
            }

            thisState.status = TGP.FSM.State.STATUS.ACTIVE;
            TGP.Utils.Logger.Info('Loaded: ' + thisState.stateName);
            if (postLoadCallback) { postLoadCallback(); }
        }

        if (this.init && this.status === TGP.FSM.State.STATUS.PRE_INIT) {
            this.status = TGP.FSM.State.STATUS.INITIALIZING;
            this.init(DoneInitCallback);
        } else {
            DoneInitCallback();
        }
    };

    TGP.FSM.State.prototype.unloadState = function(postUnloadCallback) {
        var thisState = this;

        function DoneUnloadCallback(errorMessage) {
            if (errorMessage) {
                thisState.OnCancel.Trigger(errorMessage);
                return;
            }

            thisState.status = TGP.FSM.State.STATUS.INITIALIZED;
            TGP.Utils.Logger.Info('Unloaded: ' + thisState.stateName);
            if (postUnloadCallback) { postUnloadCallback(); }
        }

        if (this.unload && this.status === TGP.FSM.State.STATUS.ACTIVE) {
            this.status = TGP.FSM.State.STATUS.UNLOADING;
            this.unload(DoneUnloadCallback);
        } else {
            DoneUnloadCallback();
        }
    };

}, true);
