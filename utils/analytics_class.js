$.Class('TGP.Utils.AnalyticsClass', {

    setup:function setup(){
        this.APIs = [
            TGP.Utils.MixpanelClass,
            TGP.Utils.KissmetricsClass,
            TGP.Utils.GoogleAnalyticsClass
        ];
    },

    /**
     * Push the method call to all API's
     * @param method
     */
    pushToAll:function pushToAll(method){
        // remove the 'method' parameter from the arguments
        var args = $.makeArray(arguments).slice(1);

        $.each(this.APIs, function(index, api){
            if( api && api.hasOwnProperty(method) ){
                api[method].apply(api, args);
            }
        });
    },

    /**
     * Track Event
     *
     * @param eventName - event name string
     * @param properties - JSON with custom data
     */
    trackEvent:function trackEvent(eventName, properties){
        if( eventName && jQuery.type(eventName) === "string" ){
            this.pushToAll('trackEvent', eventName, properties);
        }
    },

    /**
     * Set properties
     * Note - doesn't include Google Analytics since variable number is limited to 5
     * @param properties - JSON with custom data
     */
    setProperties:function setProperties(properties){
        if( !$.isEmptyObject(properties) ){
            this.pushToAll('setProperties', properties);
        }
    },

    /**
     * Set a single property
     * @param property - property name
     * @param value - property value
     */
    setProperty:function setProperty(property, value){
        if( property && jQuery.type(property) === "string" ){
            this.pushToAll('setProperty', property, value);
        }
    },

    /**
     * Identify a user with a an uid and alias his name
     * @param uid - identifier
     * @param name  - name to alias to
     */
    identifyByUidAndName:function identifyByUidAndName(uid, name){
        if( uid && name && jQuery.type(uid) === "string" && jQuery.type(name) === "string" ){
            var formattedNamed = $.String.niceName(name);
            this.pushToAll('identifyByUidAndName', uid, formattedNamed);
        }
    },

    /**
     * Identify a user with a unique id
     * @param identifier - could be either username or email (currently email)
     * @param properties - JSON with custom data (only used by Kissmetrics)
     */
    identify:function identify(identifier, properties){
        if( identifier && jQuery.type(identifier) === "string"){
            properties = properties || {};
            this.pushToAll('identify', identifier, properties);
        }
    },

    /**
     * Clear the user's identity
     */
    clearIdentity:function clearIdentity(){
        this.pushToAll('clearIdentity');
    },

    /**
     * Provide a string to recognize the user by. The string passed to this method
     * will appear in the streams interface rather than an automatically generated
     * name. Name tags do not have to be unique.
     * Note: currently only used by Mixpanel
     * @param name
     */
    setNameTag:function setNameTag(name){
        if(name && jQuery.type(name) === "string"){
            this.pushToAll('name_tag', name);
        }
    },

    /**
     * alias simply takes two arguments which are the two identities that you need
     * to tie together. So if you call alias with the identities bob and bob@bob.com
     * KISSmetrics will tie together the two records and will treat the identities bob
     * and bob@bob.com as the same person.
     * Note: currently only used by Kissmetrics
     * @param name
     */
    setAlias:function setAlias(name, identifier){
        if( identifier && name && jQuery.type(identifier) === "string" && jQuery.type(name) === "string" ){
            this.pushToAll('alias', name, identifier);
        }
    }
},{

});

