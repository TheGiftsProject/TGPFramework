$.Class('TGP.Utils.GoogleAnalyticsClass', {

    init:function(){
        this.isLoaded = (typeof _gaq !== "undefined");
    },

    /**
     * Push a call asynchronously to Google Analytics API
     * @param callData - array to push
     */
    push:function(callData){
        if( $.isArray(callData) && this.isLoaded ){
            _gaq.push(callData);
        }
    },

    trackPageview:function(pageName){
        this.push(['_trackPageview',pageName]);
    },

     /**
     * Set a single property - wraps setCustomVar
     * @param data - JSON with custom data
     */
    setProperty:function(property, value){
        if( property ){
            var index = 1; // The slot used for the custom variable. Possible values are 1-5, inclusive.
            var scope = 2; // Possible values are 1 for visitor-level, 2 for session-level, and 3 for page-level.
            this.setCustomVar(index, property, value, scope);
        }
    },

    /**
     * Sets a custom variable with the supplied name, value, and scope for the variable.
     *
     * @link http://code.google.com/apis/analytics/docs/tracking/gaTrackingCustomVariables.html
     * @param index - The slot used for the custom variable. Possible values are 1-5, inclusive.
     * @param name - The name for the custom variable.
     * @param value - The value for the custom variable.
     * @param opt_scope - Optional. The scope used for the custom variable.
     *                    Possible values are 1 for visitor-level, 2 for session-level, and 3 for page-level.
     */
    setCustomVar:function setCustomVar(index, name, value, opt_scope){
        if( (1 <= index <= 5) && name && value ){
            this.push(['_setCustomVar', index, name, value, opt_scope]);
        }
    },

    /**
     * Constructs and sends the event tracking call to the Google Analytics Tracking Code.
     *
     * @link http://code.google.com/apis/analytics/docs/tracking/eventTrackerGuide.html
     * @param category - The name you supply for the group of objects you want to track.
     * @param properties - Object with the following attributes:
     *      action - A string that is uniquely paired with each category,
     *               and commonly used to define the type of user interaction for the web object.
     *      opt_label - An optional string to provide additional dimensions to the event data.
     *      opt_value - An optional integer that you can use to provide numerical data about the user event.
     */
    trackEvent:function trackEvent(category, properties){
        var opt_label, opt_value, action;
        action = this.extractFromProperties( properties, 'action' );
        if( category && action ){
            opt_label = this.extractFromProperties( properties, 'label' );
            opt_value = this.extractFromProperties( properties, 'label_value' );
            this.push(['_trackEvent',category, action, opt_label, opt_value]);
        }
    },

    /**
     * Extract From Properties
     * @param properties
     * @param key
     */
    extractFromProperties:function extractFromProperties(properties, key){
        if( properties[key] && jQuery.type(properties[key]) === "string" ) {
            return $.String.niceName( properties[key] )
        }
    }
},{

});