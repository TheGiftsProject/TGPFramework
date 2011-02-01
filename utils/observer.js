ObjectRepository.Require('TGP.Utils.Observer', function() {

    TGP.Namespace('Utils');

    TGP.Utils.Observer = function(owner, delayed) {
        this.owner = owner;
        this.delayed = delayed;
        this.handlers = [];
    };

    TGP.Utils.Observer.prototype.AddListener = function(listener) {
        for (var i = 0; i < this.handlers.length; ++i)
        {
            if (this.handlers[i] === listener) { return this; }
        }

        this.handlers.push(listener);
        return this;
    };

    TGP.Utils.Observer.prototype.RemoveListener = function(listener) {
        for (var i = 0; i < this.handlers.length; ++i)
        {
            if (this.handlers[i] === listener)
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
                    this.handlers[i].apply(this.owner, arguments);
                }
            }
        }
    };

    // This mess allows us to run the UI thread between each handler. This works well if you have many handlers that do small tasks. If you have several large handlers, they should be broken up with setTimeout themselves.
    TGP.Utils.Observer.prototype._TriggerDelayed = function() {
        var i = 0;
        var handlers = this.handlers;
        var owner = this.owner;
        var args = arguments;
        var worker;
        worker = function() {
            setTimeout(function() {
                if (handlers[i]) {
                    handlers[i].apply(owner, args);
                }
                i += 1;

                if (i < handlers.length) { worker(); }
            }, 0);
        };

        worker();
    };

}, true);
