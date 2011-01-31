TGP.Namespace("Utils").MakeObject("Log");

(function() {
    function StopLogging() {
        this.Log = this.Info = this.Warn = this.Error = function() {};
    }

    function StartLogging() {
        this.Log = function(msg) {
            console.log(msg);
        };

        this.Info = function(msg) {
            console.info(msg);
        };

        this.Warn = function(msg) {
            console.warn(msg);
        };

        this.Error = function(msg) {
            console.error(msg);
        };
    }

    this.StopLogging = StopLogging;

    this.StartLogging = StartLogging;

    if (typeof console != 'undefined' && typeof __preventLogging == 'undefined') {
        this.StartLogging();
    }

}).call(TGP.Utils.Log);
