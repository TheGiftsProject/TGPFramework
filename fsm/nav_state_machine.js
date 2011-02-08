ObjectRepository.Require('TGP.FSM.NavStateMachine', function() {

    TGP.Namespace('FSM');

    TGP.FSM.NavStateMachine = function(stateName) {
        TGP.FSM.NavStateMachine.__super__.constructor.call(this, stateName);
    };

    TGP.Core.Inherit(TGP.FSM.NavStateMachine, TGP.FSM.StateMachine);

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
        var thisState = this;

        if (this.status < TGP.FSM.State.STATUS.LOADING) { this.loadState(); }

        if (!eventString) {
            if (this.currentState) {
                this.currentState.unloadState(function() {
                    thisState.currentState = null;
                });
            }
            return;
        }

        var seperatedString = this.parseEventString(eventString);
        var stateName = seperatedString[1];
        eventString = seperatedString[2];

        var newState = this.findStateByName(stateName);
        if (newState !== null) {
            if (newState != this.currentState) {
                if (this.currentState) {
                    this.currentState.unloadState(function() {
                        thisState.currentState = newState;
                        thisState.currentState.loadState(function() {
                            thisState.currentState.processEvent(eventString);
                        });
                    });
                } else {
                    thisState.currentState = newState;
                    thisState.currentState.loadState(function() {
                        thisState.currentState.processEvent(eventString);
                    });
                }
            } else {
                this.currentState.processEvent(eventString);
            }
        }
    };

    TGP.FSM.NavStateMachine.prototype.getCurrentStateString = function() {
        return this.stateName + (this.currentState ? ", " + this.currentState.getCurrentStateString() : ".");
    };

}, true);
