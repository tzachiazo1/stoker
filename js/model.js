//Model


(function () {
    'use strict';
    window.Stokr = window.Stokr || {};

    let state = {
        uiStatus: {
            presentationState: 'realtime_chg_percent',
            isFilterOpen : false,
            searchTerm: "",
            filterParameters : {
                stockName : "",
                trend : "all",
                byRangeFrom : "",
                byRangeTo : "",
            }
        },

        myStocks : [],

        mockData : [
            "WIX",
            "MSFT",
            "NKE",
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