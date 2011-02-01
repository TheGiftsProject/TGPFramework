ObjectRepository.Require('TGP.FSM.NavStateMachine', function() {

    TGP.Namespace('FSM');

    TGP.FSM.NavStateMachine = function(stateName) {
        this.initialized = false;
        this.init = null;
        TGP.FSM.StateMachine.call(this, stateName);
    };

    TGP.Core.Inherit(TGP.FSM.NavStateMachine, TGP.FSM.StateMachine);

    TGP.FSM.NavStateMachine.prototype.loadState = function() {
        if (!this.initialized && this.init) {
            this.init();
            this.initialized = true;
            TGP.Utils.Log.Info('Initialized: ' + this.stateName);
        }

        TGP.FSM.StateMachine.prototype.loadState.call(this);
    };

    TGP.FSM.NavStateMachine.prototype.findStateByName = function(stateName) {
        for (var i = 0; i < this.stateMachines.length; i++) {
            if (this.stateMachines[i].stateName == stateName) {
                return this.stateMachines[i];
            }
        }

        return null;
    };

    TGP.FSM.NavStateMachine.prototype.parseEventString = function(eventString) {
        return eventString.match(/^\/?([^\/]+)\/?(.*?)\/?$/); /* in case of "s1/s2/s3/s4" will return ["s1/s2/s3/s4", "s1", "s2/s3/s4"] */
    };

    TGP.FSM.NavStateMachine.prototype.processEvent = function(eventString) {
        if (!this.active) { this.loadState(); }

        if (!eventString) {
            if (this.currentState) { this.currentState.unloadState(); }
            this.currentState = null;
            return;
        }

        var seperatedString = this.parseEventString(eventString);
        var stateName = seperatedString[1];
        eventString = seperatedString[2];

        var newState = this.findStateByName(stateName);
        if (newState !== null) {
            if (newState != this.currentState) {
                if (this.currentState) { this.currentState.unloadState(); }
                this.currentState = newState;
                this.currentState.loadState();
            }

            this.currentState.processEvent(eventString);
        }
    };

    TGP.FSM.NavStateMachine.prototype.getCurrentStateString = function() {
        return this.stateName + (this.currentState ? ", " + this.currentState.getCurrentStateString() : ".");
    };

}, true);
