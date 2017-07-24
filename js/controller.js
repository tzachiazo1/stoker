/**
 * Created by tzachia on 18/07/2017.
 */
window.Stokr = window.Stokr || {};

(function initController() {
    'use strict';

    let model = window.Stokr.Model;
    let view = window.Stokr.View;

    let changePresentationOptions = ['percent', 'number'];


    function callRender(){
        let state = model.getState();
        view.render(state.stocksData , state.uiStatus);
    }

    //**** public methods ********

    function toggleChangeFormat(){
        let state = model.getState();
        state.uiStatus.presentationIndex = (state.uiStatus.presentationIndex + 1) % changePresentationOptions.length;
        callRender();
    }

    function moveStockPosition(stockKey, direction){
        let stockData = model.getState().stocksData;
        let keyIndex = stockData.findIndex(function (elm) {
            return stockKey === elm.Symbol;
        });

        let newIndex = keyIndex + direction;
        let removedStock = stockData.splice(keyIndex, 1);
        stockData.splice(newIndex, 0, removedStock[0]);
        callRender();
    }


    //***************************
    window.Stokr.Controller = {
        toggleChangeFormat,
        moveStockPosition,
        direction: {'up' : -1 , 'down' : 1},
    }

    callRender();

})();



