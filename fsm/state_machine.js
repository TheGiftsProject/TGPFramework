ObjectRepository.Require('TGP.FSM.StateMachine', function() {

    TGP.Namespace('FSM');

    TGP.FSM.StateMachine = function(stateName, component) {
        this.stateName = stateName;
        this.component = component;
        this.stateMachines = [];
        this.currentState = null;
        this.status = TGP.FSM.StateMachine.STATUS.UNLOADED;

        this.OnLoad   = new TGP.Utils.Observer();
        this.OnUnload = new TGP.Utils.Observer();
        this.OnCancel = new TGP.Utils.Observer();

        this.component.OnCancel.AddListener(this.ResetStatus, this);
        this.component.OnCancel.AddListener(this.OnCancel.Trigger, this.OnCancel);
        this.component.OnInit.AddListener(this.ComponentInitialized, this);
        this.component.OnLoad.AddListener(this.ComponentLoaded, this);
        this.component.OnUnload.AddListener(this.ComponentUnloaded, this);
    };

    TGP.FSM.StateMachine.STATUS = {
        UNLOADED: 0,
        LOADING: 1,
        LOADED: 2,
        UNLOADING: 3
    };

    TGP.FSM.StateMachine.prototype.ResetStatus = function() {
        switch (this.status) {
            case TGP.FSM.StateMachine.STATUS.LOADING:
              this.status = TGP.FSM.StateMachine.STATUS.UNLOADED;
              break;
            case TGP.FSM.StateMachine.STATUS.UNLOADING:
              this.status = TGP.FSM.StateMachine.STATUS.LOADED;
              break;
        }
    };

    TGP.FSM.StateMachine.prototype.AddStateMachines = function(stateMachines) {
        if (TGP.Core.GetType(stateMachines) != 'array') {
            stateMachines = [statemachines];
        }

        this.stateMachines = this.stateMachines.concat(stateMachines);
    };

    TGP.FSM.StateMachine.prototype.FindChildStateMachine = function(name) {
        for (var i = 0, length = this.stateMachines.length; i < length; ++i) {
            if (this.stateMachines[i].stateName == name) {
                return this.stateMachines[i];
            }
        }
    };

    TGP.FSM.StateMachine.prototype.LoadState = function() {
        this.component.OnLoad.RemoveListener(this.LoadState);

        if (this.component.status !== TGP.FSM.State.STATUS.LOADED) {
            this.component.OnLoad.AddListener(this.LoadState, this);
            this.component.OnCancel.AddListener(this.CancelLoad, this);
            this.component.LoadState();
        } else {
            if (arguments.length > 0) {
                var childStateMachine = this.FindChildStateMachine(arguments[0]);
                if (childStateMachine) {
                    if (this.currentState !== null) {
                        if (childStateMachine != this.currentState) {
                            this.currentState.UnloadState();
                        } else {
                            this.currentState.LoadState.apply(this.CurrentState, Array.prototype.splice.call(arguments, 0, 1));
                        }
                    } else {
                        childStateMachine.LoadState.apply(childStateMachine, Array.prototype.splice.call(arguments, 0, 1));
                    }
                }
            } else {
                if (this.currentState !== null) {
                    this.currentState.UnloadState();
                }
            }
        }
    };

    TGP.FSM.StateMachine.prototype.UnloadState = function() {
        
    };

    TGP.FSM.StateMachine.prototype.CancelLoad = function(errorMessage) {
        this.component.OnLoad.RemoveListener(this.LoadState);
        this.component.OnCancel.RemoveListener(this.CancelLoad);
    };

    TGP.FSM.StateMachine.prototype.CurrentStateUnloaded = function() {
        this.currentState.OnUnload.DetachCaller(this);
        this.currentState.OnLoad.DetachCaller(this);
        this.currentState = null;
    };

    ///////////////////////////////////////////////////////////////////////////////////

    TGP.FSM.StateMachine = function(stateName, init, load, unload) {
        TGP.FSM.StateMachine.__super__.constructor.call(this, stateName, init, load, unload);
        this.stateMachines = [];
        this.currentState = null;
    };

    TGP.Core.Inherit(TGP.FSM.StateMachine, TGP.FSM.State);

    TGP.FSM.StateMachine.prototype.AddStateMachines = function(stateMachines) {
        if (TGP.Core.GetType(stateMachines) !== 'array') {
            stateMachines = [stateMachines];
        }

        this.stateMachines = this.stateMachines.concat(stateMachines);

        for (var i = 0, length = stateMachines.length; i < length; ++i) {
            stateMachines[i].OnCancel.AddListener(this.OnCancel.Trigger, this.OnCancel);
        }
    };

    TGP.FSM.StateMachine.prototype.unloadState = function(postUnloadCallback) {
        var thisState = this;

        function DoneUnloadChildCallback() {
            thisState.currentState = null;

            // Unload self
            TGP.FSM.StateMachine.__super__.unloadState.call(thisState, postUnloadCallback);
        }

        // Unload children
        if (this.currentState) {
            this.currentState.unloadState(DoneUnloadChildCallback);
        } else {
            DoneUnloadChildCallback();
        }
    };

}, true);
