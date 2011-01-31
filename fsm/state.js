steal('../tgp.js',
      '../utils/logger.js')
.then(function() {

    TGP.Namespace('FSM');

    TGP.FSM.State = function(stateName) {
        this.stateName = stateName;
        this.load = null;
        this.unload = null;
        this.active = false;
    };

    TGP.FSM.State.prototype.loadState = function() {
        if (this.load && !this.active) { this.load(); }
        TGP.Utils.Log.Info('Loaded: ' + this.stateName);
        this.active = true;
    };

    TGP.FSM.State.prototype.unloadState = function() {
        if (this.unload && this.active) { this.unload(); }
        TGP.Utils.Log.Info('Unloaded: ' + this.stateName);
        this.active = false;
    };

});
