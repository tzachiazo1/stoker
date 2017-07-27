/**
 * Created by tzachia on 18/07/2017.
 */
window.Stokr = window.Stokr || {};

(function initController() {
    'use strict';

    let model = window.Stokr.Model;
    let view = window.Stokr.View;
    let domain = 'http://localhost:7000/';
    let fetch_api = domain + "quotes?q=";
    let search_api = domain + 'search?q=';

    let changePresentationOptions = ['realtime_chg_percent', 'realtime_change', 'MarketCapitalization'];

    function initApp(){
        //init user's stock symbols
        let myStocks = loadMyStockListFromLocalStorage();
        if(!myStocks){
            myStocks = model.getState().mockData;
        }
        model.getState().myStocks = myStocks;
        saveMyStockListToLocalStorage();

        fetchStocks();
    }


    function callRender() {
        let state = model.getState();
        let stocksData = state.stocksData;
        if (state.uiStatus.isFilterOpen) {
            stocksData = filterStocks(stocksData, state.uiStatus.filterParameters);
        }
        view.render(stocksData, state.uiStatus);
    }

    function callRenderWithSearch(searchResult){
        view.render(null, model.getState().uiStatus, searchResult);
    }


    function filterStocks(stocks, parameters) {
        if (!parameters.stockName && parameters.trend === 'All' && !parameters.byRangeFrom && !parameters.byRangeTo) {
            return stocks;
        }

        return stocks.filter((stocks) => filter(stocks, parameters));
    }

    function filter(stock, parameters) {
        if (!stock.Symbol.toUpperCase().startsWith(parameters.stockName.toUpperCase()) && !stock.Name.toUpperCase().startsWith(parameters.stockName.toUpperCase())) {
            return false;
        }
        let trend = (stock.realtime_change > 0) ? 'gaining' : 'losing';
        if (parameters.trend.toUpperCase() !== 'All'.toUpperCase() && trend.toUpperCase() !== parameters.trend.toUpperCase()) {
            return false;
        }

        let dailyPercent = parseFloat(stock.realtime_chg_percent);
        if (parameters.byRangeFrom === '' || parameters.byRangeTo === '') {
            return true;
        }
        if ((parseFloat(dailyPercent) < parameters.byRangeFrom || parseFloat(dailyPercent) > parameters.byRangeTo )) {
            return false;
        }
        return true;
    }

    function saveUIstateToLocalStorage() {
        let uiStatus = model.getState().uiStatus;
        localStorage.setItem('stokr_state', JSON.stringify(uiStatus));
    }


    //**** public methods ********

    function toggleChangeFormat() {
        let state = model.getState();
        let currentStateIndex = changePresentationOptions.indexOf(state.uiStatus.presentationState);
        state.uiStatus.presentationState = changePresentationOptions[(currentStateIndex + 1) % changePresentationOptions.length];
        saveUIstateToLocalStorage();
        callRender();
    }

    function moveStockPosition(stockKey, direction) {
        let stockData = model.getState().stocksData;
        let myStocks =  model.getState().myStocks;

        let keyIndex = stockData.findIndex(function (curStock) {
            return stockKey === curStock.Symbol;
        });

        let newIndex = keyIndex + direction;

        let removedStock = stockData.splice(keyIndex, 1);
        stockData.splice(newIndex, 0, removedStock[0]);

        removedStock = myStocks.splice(keyIndex, 1);
        myStocks.splice(newIndex, 0, removedStock[0]);

        saveMyStockListToLocalStorage();
        callRender();
    }

    function fetchStocks() {
        let query = fetch_api + model.getState().myStocks.join(',');
        fetch(query)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject('Request Failed');
            })
            .then(setStocksFromResult)
            .then(loadUiStateFromLocalStorage)
            .then(callRender)
            .catch(console.error)
    }

    function loadUiStateFromLocalStorage() {
        if (localStorage.stokr_state) {
            model.getState().uiStatus = JSON.parse(localStorage.getItem('stokr_state'));
        }
    }

    function loadMyStockListFromLocalStorage(){
        if (localStorage.stokr_my_stocks) {
            model.getState().myStocks = JSON.parse(localStorage.getItem('stokr_my_stocks'));
            return model.getState().myStocks;
        }
    }

    function saveMyStockListToLocalStorage(){
        let myStocks = model.getState().myStocks;
        localStorage.setItem('stokr_my_stocks', JSON.stringify(myStocks));
    }

    function setStocksFromResult(result) {
        model.setStocks(result.query.results.quote);
    }

    function toggleFilter() {
        model.getState().uiStatus.isFilterOpen = !model.getState().uiStatus.isFilterOpen;
        saveUIstateToLocalStorage();
        callRender();
    }

    function applyFilter(filterParams) {
        let state = model.getState();
        state.uiStatus.filterParameters = filterParams;
        saveUIstateToLocalStorage();
        callRender();
    }

    function onHashChanged() {
        callRender();
    }

    function refresh() {
        fetchStocks();
    }

    function onSearch(searchTerm) {
        model.getState().uiStatus.searchTerm = searchTerm;
        let query = search_api + searchTerm;
        fetch(query).then(response => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject('Bad Request');
        }).then(response => response.ResultSet.Result)
            .then(callRenderWithSearch);
    }

    function addStock(symbol) {
        model.getState().myStocks.push(symbol);
        saveMyStockListToLocalStorage();
        fetchStocks();
    }

    //***************************
    window.Stokr.Controller = {
        toggleChangeFormat,
        moveStockPosition,
        direction: {'up': -1, 'down': 1},
        toggleFilter,
        applyFilter,
        onHashChanged,
        refresh,
        onSearch,
        addStock,
    }

    initApp();

})();



