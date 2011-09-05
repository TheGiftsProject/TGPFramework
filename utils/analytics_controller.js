$.Controller('TGP.Utils.AnalyticsController', {
    onDocument: true
},{
    init: function() {
        this.logFacebookLogin();
        this.logFacebookLogout();
//        this.logEbayLogin();
    },

    logFacebookLogin: function(){
        $.on_fb_login( function(){
            TGP.Utils.AnalyticsClass.trackEvent('Facebook Login', {"action":'Success'});
            TGP.Utils.AnalyticsClass.setProperty('Facebook', 'Yes');
            $.fb_query_self(function(response){
              if(!response.error_code) {
                var fbUser = response[0];
                if( fbUser ){
                    TGP.Utils.AnalyticsClass.identifyByUidAndName( fbUser.uid, fbUser.name );
                }
              }
            });
        });
    },

    logFacebookLogout: function(){
        $.on_fb_logout( function(){
            TGP.Utils.AnalyticsClass.trackEvent('Facebook Logout', {"action":'Success'});
            TGP.Utils.AnalyticsClass.setProperty('Facebook', 'No');
        });
    },

     /*
        NOT TESTED
    logEbayLogin: function(){

        ebayLogin.OnEbayLogin(function() {
            var ebayUserId = EbayLogin.userId;
          TGP.Utils.AnalyticsClass.identify(ebayUserId);
        });
    },
    */

    'Ebay.Campaign.PaymentDetails.ItemDetailsChanged subscribe': function(ev, details) {
        var payment_data = {
            "action" : "Payment",
            "Item Price" : details.Price(),
            "Shipping Price" : details.ShippingPrice(),
            "Item ID" : details.ItemId()
        };
        TGP.Utils.AnalyticsClass.trackEvent("Payment Details", payment_data);
    },

    "Ebay.Campaign.STC.TotalPriceChanged subscribe":function(ev, new_price) {
        TGP.Utils.AnalyticsClass.trackEvent("Total Price", {"action":"change", "Total Price":new_price});
    },

    "Autocomplete.GotContacts subscribe":function(ev, data) {
        TGP.Utils.AnalyticsClass.trackEvent("Autocomplete Got Contacts", {"action":"Got Contacts", "provider":data.provider});
    },

    "Ebay.Campaign.Row.IdentifierChanged subscribe":function(ev, data) {
        var properties = {};
        if( data['email'] ){
            properties['Invitee Email'] = data['email'];
        }
        if( data['facebook_id'] ){
            properties['Invitee Facebook ID'] = data['facebook_id'];
        }
        TGP.Utils.AnalyticsClass.setProperties(data);
    },

    "Ebay.Campaign.STC.RedrawShippingDatesNote subscribe" : function(ev, shippingDetails){
        var properties = {
            'Shipping Days Min': shippingDetails.deliveryMin,
            'Shipping Days Max': shippingDetails.deliveryMax
        };
        TGP.Utils.AnalyticsClass.setProperties(properties);
    },

    "Ebay.Campaign.STC.analytics subscribe":function(ev, data) {
        TGP.Utils.AnalyticsClass.setProperties(data);
    }
});
