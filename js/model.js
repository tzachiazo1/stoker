//Model


(function () {
    'use strict';
    window.Stokr = window.Stokr || {};

    let state = {
        uiStatus: {
            presentationIndex: 0,
            isFilterOpen : false,
            filterParameters : {
                stockName : "",
                trend : "all",
                byRangeFrom : "",
                byRangeTo : "",
            }
        },

        myStocks : [
            "WIX",
            "MSFT"
        ],

        stocksData: []
    };


    //******************** Public methods ************************
    function getState() {
        return state;
    }

    function setStocks(newStocksData) {
        state.stocksData = newStocksData;
    }

    //****************************************************************

    window.Stokr.Model = {
        getState,
        setStocks,
    }

})();