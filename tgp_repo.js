ObjectRepository.AddRepositoryData('/tgp', {
    'flow': {
        file: '/lib/flow.js',
        dependencies: []
    },

    'TGP': {
        file: '/tgp.js',
        dependencies: []
    },

    'TGP.Core': {
        file: '/core.js',
        dependencies: ['TGP']
    },

    'TGP.Utils.GoogleAnalytics': {
        file: '/utils/google_analytics.js',
        dependencies: ['TGP']
    },

    'TGP.Utils.Kissmetrics': {
        file: '/utils/kissmetrics.js',
        dependencies: ['TGP']
    },

    'TGP.Utils.Mixpanel': {
        file: '/utils/mixpanel.js',
        dependencies: ['TGP']
    },

    'TGP.Utils.Logger': {
        file: '/utils/logger.js',
        dependencies: ['TGP']
    },

    'TGP.Utils.Observer': {
        file: '/utils/observer.js',
        dependencies: ['TGP', 'TGP.Core']
    },

    'TGP.Utils.ResettableCollection': {
        file: '/utils/resettable_collection.js',
        dependencies: ['TGP', 'TGP.Core']
    },

    'TGP.UI.Component': {
        file: '/ui/component.js',
        dependencies: ['TGP', 'flow']
    },

    'TGP.UI.StateMachine': {
        file: '/ui/state_machine.js',
        dependencies: ['TGP', 'TGP.Core', 'TGP.UI.Component', 'flow']
    },

    'TGP.Data.CountryCodes': {
        file: '/data/country_codes.js',
        dependencies: ['TGP']
    }
});
