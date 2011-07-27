$.Controller('TGP.Utils.AnalyticsController', {
    onDocument: true
},{
    init: function() {
        $.on_fb_login( function(){
            TGP.Utils.AnalyticsClass.trackEvent('Facebook Login', 'Success');
            $.fb_query_self(function(response){
              if(!response.error_code) {
                var fbUser = response[0];
                if( fbUser ){
                    TGP.Utils.AnalyticsClass.identifyByNameAndEmail( fbUser.email, fbUser.name );
                }
              }
            });
        });

        $.on_fb_logout( function(){
            TGP.Utils.AnalyticsClass.trackEvent('Facebook Logout', 'Success');
        });
    },

    //Facebook events
    "Facebook.Login subscribe": function() {
        TGP.AnalyticsClass.trackEvent('Facebook Login', 'Login');
        TGP.AnalyticsClass.setProperty('Facebook Login', 'Yes');
    },

    "Facebook.Logout subscribe": function() {
        TGP.AnalyticsClass.trackEvent('Facebook Logout', 'Logout');
        TGP.AnalyticsClass.setProperty('Facebook Login', 'No');
    },

    "Facebook.Connected subscribe": function() {
        TGP.AnalyticsClass.trackEvent('Facebook Connected', 'Connected');
    },

    "Facebook.Ready subscribe": function() {
        TGP.AnalyticsClass.trackEvent('Facebook Ready', 'Ready');
    },

    "TGP.Campaign.New.CampaignInfo.InviteMessage.Save subscribe":function(){
        TGP.AnalyticsClass.trackEvent('STC Set Invite Message', 'Set');
    },
    "TGP.Campaign.New.CampaignInfo.InviteMessage.Cancel subscribe":function(){
        TGP.AnalyticsClass.trackEvent('STC Cancel Invite Message', 'Cancel');
    }
});
