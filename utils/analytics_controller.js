$.Controller('TGP.Utils.AnalyticsController', {
    onDocument: true
},{
    init: function() {
        this.logFacebookLogin();
        this.logFacebookLogout();
        this.logEbayLogin();
    },

    logFacebookLogin: function(){
        $.on_fb_login( function(){
            TGP.Utils.AnalyticsClass.trackEvent('Facebook Login', 'Success');
            TGP.AnalyticsClass.setProperty('Facebook Login', 'Yes');
            $.fb_query_self(function(response){
              if(!response.error_code) {
                var fbUser = response[0];
                if( fbUser ){
                    TGP.Utils.AnalyticsClass.identifyByNameAndUid( fbUser.uid, fbUser.name );
                }
              }
            });
        });
    },

    logFacebookLogout: function(){
        $.on_fb_logout( function(){
            TGP.Utils.AnalyticsClass.trackEvent('Facebook Logout', 'Success');
            TGP.Utils.AnalyticsClass.setProperty('Facebook Login', 'No');
        });
    },

    logEbayLogin: function(){
        ebayLogin.EbayReady(function(ebayUserId) {
          TGP.Utils.AnalyticsClass.identify(ebayUserId);
        });
    }
});
