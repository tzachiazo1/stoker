/**
 * Created by tzachia on 18/07/2017.
 */
window.Stokr = window.Stokr || {};

(function initController() {
    'use strict';

    let model = window.Stokr.Model;
    let view = window.Stokr.View;
    let domain = 'http://localhost:7000/';

    let changePresentationOptions = ['percent', 'number'];


    function callRender() {
        let state = model.getState();
        if (state.uiStatus.isFilterOpen) {
            let filterd = filterStocks(state.stocksData, state.uiStatus.filterParameters);
            view.render(filterd, state.uiStatus);
        } else {
            view.render(state.stocksData, state.uiStatus);
        }
    }

    function filterStocks(stocks, parameters) {
        if (!parameters.stockName && parameters.trend === 'All' && !parameters.byRangeFrom && !parameters.byRangeTo) {
            return stocks;
        }

        let filtered = stocks.filter((stocks) => filter(stocks, parameters));

        return filtered;
    }

    function filter(stock, parameters) {
        if(!stock.Symbol.toUpperCase().startsWith(parameters.stockName.toUpperCase()) && !stock.Name.toUpperCase().startsWith(parameters.stockName.toUpperCase())){
            return false;
        }
        let trend = (stock.realtime_change > 0) ? 'gaining' : 'losing';
        if(parameters.trend.toUpperCase() !== 'All'.toUpperCase() && trend.toUpperCase() !== parameters.trend.toUpperCase()){
            return false;
        }

        let dailyPercent = parseFloat(stock.realtime_chg_percent);
        if(parameters.byRangeFrom === '' || parameters.byRangeTo === ''){
            return true;
        }
        if((parseFloat(dailyPercent) < parameters.byRangeFrom || parseFloat(dailyPercent) > parameters.byRangeTo )){
            return false;
        }
        return true;
    }

    //**** public methods ********

    function toggleChangeFormat() {
        let state = model.getState();
        state.uiStatus.presentationIndex = (state.uiStatus.presentationIndex + 1) % changePresentationOptions.length;
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
            .then(callRender)
            .catch(console.error)
    }

    function setStocksFromResult(result){
        model.setStocks(result.query.results.quote);
    }

    function toggleFilter() {
        model.getState().uiStatus.isFilterOpen = !model.getState().uiStatus.isFilterOpen;
        callRender();
    }

    function applyFilter(filterParams) {
        let state = model.getState();

        state.uiStatus.filterParameters = filterParams;
        callRender();
    }

    function onHashChanged() {
        callRender();
    }


    //***************************
    window.Stokr.Controller = {
        toggleChangeFormat,
        moveStockPosition,
        direction: {'up': -1, 'down': 1},
        toggleFilter,
        applyFilter,
        onHashChanged,
    }

    fatchStocks();
})();



