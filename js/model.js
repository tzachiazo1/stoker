//Model


(function () {
    'use strict';
    window.Stokr = window.Stokr || {};

    let state = {
        uiStatus: {
            presentationIndex: 0,
        },

        stocksData: [
            {
                "Symbol": "YHOO",
                "Name": "Yahoo! Inc.",
                "Change": "0.279999",
                "PercentChange": "+1.11%",
                "LastTradePriceOnly": "50.599998"

            },
            {
                "Symbol": "WIX",
                "Name": "Wix.com Ltd.",
                "Change": "0.750000",
                "PercentChange": "+1.51%",
                "LastTradePriceOnly": "76.099998"
            },
            {
                "Symbol": "MSFT",
                "Name": "Microsoft Corporation",
                "PercentChange": "-2.09%",
                "Change": "-0.850006",
                "LastTradePriceOnly": "69.620003"
            }

        ]
    };


    //******************** Public methods ************************
    function getState() {
        return state;
    }
    //****************************************************************

    window.Stokr.Model = {
        getState,
    }

})();