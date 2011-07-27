$.Class('TGP.Utils.MixpanelClass', {

    init:function(){
        this.isLoaded = (typeof mpq !== "undefined");
    },

    /**
     * Push a call asynchronously to Mixpanel API
     * @param callData - array to push
     */
    push:function(callData){
        if( $.isArray(callData) && this.isLoaded ){
            mpq.push(callData);
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
        this.push(["track",   eventName, properties]);
    },

    /**
     * Set properties
     * @param properties - JSON with custom data
     */
    setProperties:function(properties){
        this.push(["register", properties]);
    },

    /**
     * Set a single property
     * @param data - JSON with custom data
     */
    setProperty:function(property, value){
        this.push(["register", {property:value} ]);
    },


    /**
     * Identify a user by its uid and tag his name (similar to Kissmetrics' Alias)
     * @param uid - identifier
     * @param name  - name to alias to
     */
    identifyByNameAndUid:function(uid, name){
        this.identify( uid, {'name':name} );
        this.setNameTag( name );
    },

    /**
     * Identify a user with a unique id
     * @param identifier - could be either username or email (currently uid)
     */
    identify:function(identifier){
        this.push(["identify",  identifier]);
    },

    /**
     * Provide a string to recognize the user by. The string passed to this method
     * will appear in the streams interface rather than an automatically generated
     * name. Name tags do not have to be unique.
     * @param name
     */
    setNameTag:function(name){
        this.push(["name_tag", name]);
    }

},{

});