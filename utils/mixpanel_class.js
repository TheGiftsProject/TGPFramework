$.Class('TGP.Utils.MixpanelClass', {

    init:function init(){
        this.isLoaded = (typeof mpq !== "undefined");
    },

    /**
     * Push a call asynchronously to Mixpanel API
     * @param callData - array to push
     */
    push:function push(callData){
        if( $.isArray(callData) && this.isLoaded ){
            mpq.push(callData);
        }
    },

    /**
     * Track Event
     * @param eventName - event name string
     * @param properties - JSON with custom data
     */
    trackEvent:function trackEvent(eventName, properties){
        properties = properties || {};
        this.push(['record', eventName, properties]);
    },

    /**
     * Set properties
     * @param properties - JSON with custom data
     */
    setProperties:function setProperties(properties){
        this.push(["register", properties]);
    },

    /**
     * Set a single property
     * @param data - JSON with custom data
     */
    setProperty:function setProperty(property, value){
        var properties = {};
        properties[property] = value;
        this.setProperties(properties);
    },


    /**
     * Identify a user by its uid and tag his name (similar to Kissmetrics' Alias)
     * @param uid - identifier
     * @param name  - name to alias to
     */
    identifyByUidAndName:function identifyByUidAndName(uid, name){
        this.identify( uid, {'name':name} );
        this.setNameTag( name );
    },

    /**
     * Identify a user with a unique id
     * @param identifier - could be either username or email (currently uid)
     */
    identify:function identify(identifier){
        this.push(["identify",  identifier]);
    },

    /**
     * Provide a string to recognize the user by. The string passed to this method
     * will appear in the streams interface rather than an automatically generated
     * name. Name tags do not have to be unique.
     * @param name
     */
    setNameTag:function setNameTag(name){
        this.push(["name_tag", name]);
    }

},{

});