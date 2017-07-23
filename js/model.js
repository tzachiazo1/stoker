//Model


(function () {
    'use strict';

    window.Stokr = window.Stokr || {};

    let changePresentationOptions = ['percent', 'number'];
    let status = {
        uiStatus: {
            presentationIndex: 0,
            currentChangePresentation: changePresentationOptions[0]
        },

        stockData: [
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
    function getStocks() {
        return status.stockData;
    }

    function getChangeFormat() {
        return status.uiStatus.currentChangePresentation;
    }

    function toggleChangeFormat() {
        status.uiStatus.presentationIndex = (status.uiStatus.presentationIndex + 1) % changePresentationOptions.length;
        status.uiStatus.currentChangePresentation = status.uiStatus.currentChangePresentation = changePresentationOptions[status.uiStatus.presentationIndex];
    }

    function moveStockPosition(stockKey, direction){
        //debugger;
        let keyIndex = status.stockData.findIndex(function (elm) {
            return stockKey === elm.Symbol;
        });
        let newIndex = keyIndex + direction;
        let removedStock = status.stockData.splice(keyIndex, 1);
        status.stockData.splice(newIndex, 0, removedStock[0]);
    }

    //****************************************************************


    window.Stokr.Model = {
        getStocks,
        getChangeFormat,
        toggleChangeFormat,
        moveStockPosition,

        direction: {'up' : -1 , 'down' : 1},
    }

})();