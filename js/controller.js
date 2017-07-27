/**
 * Created by tzachia on 18/07/2017.
 */
window.Stokr = window.Stokr || {};

(function initController() {
    'use strict';

    let model = window.Stokr.Model;
    let view = window.Stokr.View;
    let domain = 'http://localhost:7000/';

    let changePresentationOptions = ['percent', 'number', 'b'];


    function initApp(){
        if(model.getState().searchTerm){
            performSearch(model.uiStatus.searchTerm);
        }else{
            fatchStocks();
        }
    }


    function callRender() {
        let state = model.getState();
        if (state.uiStatus.isFilterOpen) {
            let filterd = filterStocks(state.stocksData, state.uiStatus.filterParameters);
            view.render(filterd, state.uiStatus);
        } else {
            view.render(state.stocksData, state.uiStatus);
        }
    }

    function callRenderWithSearch(searchResult){
        view.render(null, model.getState().uiStatus, searchResult);
    }


    function filterStocks(stocks, parameters) {
        if (!parameters.stockName && parameters.trend === 'All' && !parameters.byRangeFrom && !parameters.byRangeTo) {
            return stocks;
        }

        let filtered = stocks.filter((stocks) => filter(stocks, parameters));

        return filtered;
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

    function performSearch(searchTerm) {
        let query = 'search?q=' + searchTerm;
        fetch(domain + query).then(response => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject('Bad Request');
        }).then(showSearchResult)
            .then(callRenderWithSearch);
    }

    function showSearchResult(response) {
        return response.ResultSet.Result;
    }



    //**** public methods ********

    function toggleChangeFormat() {
        let state = model.getState();
        state.uiStatus.presentationIndex = (state.uiStatus.presentationIndex + 1) % changePresentationOptions.length;
        saveUIstateToLocalStorage();
        callRender();
    }

    function moveStockPosition(stockKey, direction) {
        let stockData = model.getState().stocksData;
        let keyIndex = stockData.findIndex(function (elm) {
            return stockKey === elm.Symbol;
        });

        let newIndex = keyIndex + direction;
        let removedStock = stockData.splice(keyIndex, 1);
        stockData.splice(newIndex, 0, removedStock[0]);
        callRender();
    }

    function fatchStocks() {
        let query = "quotes?q=" + model.getState().myStocks.join(',');
        fetch(domain + query)
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
        fatchStocks();
    }

    function onSearch(searchTerm) {
        console.log(searchTerm);
        model.getState().uiStatus.searchTerm = searchTerm;
        //saveUIstateToLocalStorage();
        performSearch(searchTerm);
    }

    function addStock(symbol) {
        console.log(symbol);
        model.getState().myStocks.push(symbol);

        fatchStocks();
        debugger;
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



