ObjectRepository.Require('TGP.Utils.Logger', function() {

    TGP.Namespace("Utils").MakeObject("Logger");

    (function() {
        function StopLogging() {
            this.Log = this.Info = this.Warn = this.Error = this.Dir = function() {};
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

            this.Dir = function(obj) {
                console.dir(obj);
            };
        }

        this.StopLogging = StopLogging;

        this.StartLogging = StartLogging;

        if (typeof console != 'undefined' && typeof __debugging__ !== 'undefined') {
            this.StartLogging();
        } else {
            this.StopLogging();
        }

    }).call(TGP.Utils.Logger);

}, true);
