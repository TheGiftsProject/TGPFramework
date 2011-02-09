ObjectRepository.Require('TGP.Utils.Observer', function() {

    TGP.Namespace('Utils');

    TGP.Utils.Observer = function(delayed) {
        this.delayed = delayed;
        this.handlers = [];
    };

    TGP.Utils.Observer.prototype.AddListener = function(listener, caller) {
        for (var i = 0; i < this.handlers.length; ++i)
        {
            if (this.handlers[i].listener === listener) { return this; }
        }

        this.handlers.push({listener: listener, caller: caller});
        return this;
    };

    TGP.Utils.Observer.prototype.RemoveListener = function(listener) {
        for (var i = 0; i < this.handlers.length; ++i)
        {
            if (this.handlers[i].listener === listener)
            {
                delete this.handlers[i];
                return this;
            }
        }

        return this;
    };

    TGP.Utils.Observer.prototype.Trigger = function() {
        if (this.delayed) {
            this._TriggerDelayed.apply(this, arguments);
        } else {
            for (var i = 0; i < this.handlers.length; ++i) {
                if (this.handlers[i]) {
                    this.handlers[i].listener.apply(this.handlers[i].caller, arguments);
                }
            }
        }
    };

    TGP.Utils.Observer.prototype.GetBoundTrigger = function() {
        return TGP.Core.BindThis(this, Trigger);
    };

    // This mess allows us to run the UI thread between each handler. This works well if you have many handlers that do small tasks. If you have several large handlers, they should be broken up with setTimeout themselves.
    TGP.Utils.Observer.prototype._TriggerDelayed = function() {
        var i = 0;
        var handlers = this.handlers;
        var args = arguments;
        var worker;
        worker = function() {
            setTimeout(function() {
                if (handlers[i]) {
                    handlers[i].listener.apply(handlers[i].caller, args);
                }
                i += 1;

                if (i < handlers.length) { worker(); }
            }, 0);
        };

        worker();
    };

}, true);
