$.Class('TGP.Utils.KissmetricsClass', {

    init:function(){
        this.isLoaded = (typeof _kmq !== "undefined");
    },

    /**
     * Push a call asynchronously to Kissmetrics API
     * @param callData - array to push
     */
    push:function(callData){
        if( $.isArray(callData) && this.isLoaded ){
            _kmq.push(callData);
        }
    },

    /**
     * Track Event
     * @param eventName - event name string
     * @param action
     * @param label
     * @param properties - JSON with custom data
     */
    trackEvent:function(eventName, action, label, properties){
        properties = properties || {};
        if( jQuery.type(label) === "string" ) { properties["label"]  = $.String.niceName( label ) }
        if( jQuery.type(action) === "string" ){ properties["action"] = $.String.niceName( action ) }
        this.push(['record', eventName, properties]);
    },

    /**
     * Set properties
     * @param properties - JSON with custom data
     */
    setProperties:function(properties){
        this.push(['set', properties]);
    },

    /**
     * Set a single property
     * @param data - JSON with custom data
     */
    setProperty:function(property, value){
        this.push(['set', {property:value} ]);
    },

    /**
     * Identify a user by its uid and alias his name
     * @param uid - identifier
     * @param name  - name to alias to
     */
    identifyByNameAndUid:function(uid, name){
        this.identify( uid, {'name':name} );
        this.setAlias( name, uid );
    },

    /**
     * Identify a user with a unique id
     * @param identifier - could be either username or email (currently uid)
     * @param properties - JSON with custom data
     */
    identify:function(identifier, properties){
        properties = properties || {};
        this.push(['identify', identifier, properties]);
    },


    /**
     * alias simply takes two arguments which are the two identities that you need
     * to tie together. So if you call alias with the identities bob and bob@bob.com
     * KISSmetrics will tie together the two records and will treat the identities bob
     * and bob@bob.com as the same person.
     * @param name
     */
    setAlias:function(name, identifier){
        this.push(['alias', name, identifier]);
    }
},{

});

