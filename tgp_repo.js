ObjectRepository.AddRepositoryData({
    'TGP': {
        file: '/tgp/tgp.js',
        dependencies: []
    },

    'TGP.Core': {
        file: '/tgp/core.js',
        dependencies: ['TGP']
    },

    'TGP.Utils.GoogleAnalytics': {
        file: '/tgp/utils/google_analytics.js',
        dependencies: ['TGP']
    },

    'TGP.Utils.Logger': {
        file: '/tgp/utils/logger.js',
        dependencies: ['TGP']
    },

    'TGP.Utils.Observer': {
        file: '/tgp/utils/observer.js',
        dependencies: ['TGP', 'TGP.Core']
    },

    'TGP.Utils.ResettableCollection': {
        file: '/tgp/utils/resettable_collection.js',
        dependencies: ['TGP', 'TGP.Core']
    },

    'TGP.FSM.State': {
        file: '/tgp/fsm/state.js',
        dependencies: ['TGP', 'TGP.Utils.Logger']
    },

    'TGP.FSM.StateMachine': {
        file: '/tgp/fsm/state_machine.js',
        dependencies: ['TGP', 'TGP.Core', 'TGP.FSM.State']
    },

    'TGP.FSM.NavStateMachine': {
        file: '/tgp/fsm/nav_state_machine.js',
        dependencies: ['TGP', 'TGP.Core', 'TGP.Utils.Logger', 'TGP.FSM.StateMachine']
    },

    'TGP.Data.CountryCodes': {
        file: '/tgp/data/country_codes.js',
        dependencies: ['TGP']
    }
});
