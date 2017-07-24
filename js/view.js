/**
 * Created by tzachia on 23/07/2017.
 */


(function () {
    'use strict';

    window.Stokr = window.Stokr || {};

    let changeOptions = {
        'percent': 0,
        'number': 1,
    }

    function createMainHeader() {
        return `
    <header class="main_header">
        <h1 class="main_title">Stoker</h1>
        <ul class="main_header_action_list">
          <li><button class="icon-search action_button main_header_search"></button></li>
          <li><button class="icon-refresh action_button main_header_refresh"></button></li>
          <li><button class="icon-filter action_button main_header_filter"></button></li>
          <li><button class="icon-settings action_button main_header_settings"></button></li>
        </ul>
        
      </header>
    `;
    }

    function createStockList(data, state) {
        let createStockEntryWithStatus = (stock, index, arr) => creteStockEntry(stock, index, arr, state);
        return `<ul class="stocks_list">${data.map(createStockEntryWithStatus).join('')}</ul>`;
    }

    function trimNumber(num) {
        return parseFloat(num).toFixed(2);
    }

    function creteStockEntry(stock, index, arr, uiStatus) {
        let stockChange = (uiStatus.presentationIndex === changeOptions['percent']) ? stock.PercentChange : trimNumber(stock.Change);
        let trend = (stock.Change > 0) ? "positive_trend" : "negative_trend";
        let disableUpButton = (index === 0);
        let disableDownButton = (index === arr.length - 1);

        return `<li class="stock_line">

                <span class="stock_line_name"> ${stock.Symbol} (${stock.Name})</span>
                <div class="sock_line_right_panel">
                <span class ="stock_line_lastPrice"> ${trimNumber(stock.LastTradePriceOnly)}</span>
                <button class="stock_line_change_btn ${trend}">${stockChange}</button>
                <div class="stock_line_move_panel">
                    <button class="sock_line_up_button icon-arrow ${(index === 0) ? 'icon_arrow_disable' : ''}" ${disableUpButton ? 'disabled' : ''} data-symbol="${stock.Symbol}"></button>
                    <button class="sock_line_down_button icon-arrow ${(index === arr.length - 1) ? 'icon_arrow_disable' : ''}" ${disableDownButton ? 'disabled' : ''} data-symbol="${stock.Symbol}"></button>
                </div>
                </div>
            </li>`;
    }

    function stockClickCB(ev) {
        let ctrl = window.Stokr.Controller;
        if (ev.target.classList.contains('stock_line_change_btn')) {
            ctrl.toggleChangeFormat()
        }
        else if (ev.target.classList.contains('sock_line_up_button')) {
            ctrl.moveStockPosition(ev.target.dataset.symbol, ctrl.direction.up);
        }
        else if (ev.target.classList.contains('sock_line_down_button')) {
            ctrl.moveStockPosition(ev.target.dataset.symbol, ctrl.direction.down);
        }

    }

    //******************** Public methods ************************

    function render(stockData, state) {
        let container = document.getElementsByClassName('app_content')[0];
        container.innerHTML = createMainHeader() + createStockList(stockData, state);
        container.getElementsByClassName("stocks_list")[0].addEventListener('click', stockClickCB);
    }

    //****************************************************************

    window.Stokr.View = {
        render,
    }

})();




