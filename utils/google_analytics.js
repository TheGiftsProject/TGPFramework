ObjectRepository.Require('TGP.Utils.GoogleAnalytics', function() {

    TGP.Namespace('Utils').MakeObject('GoogleAnalytics');

    (function() {

        function RecordEvent(payload) {
            _gaq.push(payload);
        }

        function SetCustomVar(index, name, value, scope) {
            RecordEvent(['_setCustomVar', index, name, value, scope]);
        }

        this.TrackPageView = function(pageName) {
            RecordEvent(['_trackPageview', pageName]);
        };

        this.TrackEvent = function(category, action, label) {
            var payload = ['_trackEvent', category, action, label];

            if (typeof label == 'undefined') { payload.length = 3; }

            RecordEvent(payload);
        };

        this.TrackFormEvent = function(form, field) {
            this.TrackEvent('FORM', form, field);
        };

    }).call(TGP.Utils.GoogleAnalytics);

}, true);
