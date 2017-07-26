/**
 * Created by tzachia on 23/07/2017.
 */


(function () {
    'use strict';

    window.Stokr = window.Stokr || {};

    // let changeOptions = {
    //     'percent': 0,
    //     'number': 1,
    //     'MarketCapitalization': 2,
    // };

    window.addEventListener('hashchange', hashchangeHandler);

    function hashchangeHandler() {
        let ctrl = window.Stokr.Controller;
        ctrl.toggleChangeFormat()
    }

    function createMainHeader(uiStatus) {
        let filterSelected = uiStatus.isFilterOpen ? 'action_active' : '';
        return `
    <header class="main_header">
        <h1 class="main_title">Stoker</h1>
        <ul class="main_header_action_list">
          <li><a class="icon-search action_button main_header_search" data-actionname ="search" href="#search"></a></li>
          <li><button class="icon-refresh action_button main_header_refresh" data-actionname ="refresh"></button></li>
          <li><button class="icon-filter action_button main_header_filter ${filterSelected}" data-actionname ="filter" ></button></li>
          <li><button class="icon-settings action_button main_header_settings" data-actionname ="settings"></button></li>
        </ul>
        
      </header>
    `;
    }

    function createStockList(data, state) {
        let createStockEntryWithStatus = (stock, index, arr) => creteStockEntry(stock, index, arr, state);
        return `<ul class="stocks_list">${data.map(createStockEntryWithStatus).join('')}</ul>`;
    }

    function trimNumber(num, showSign) {
        let number = parseFloat(num).toFixed(2);
        let sign = ((number > 0) ? '+' : '');
        return ( showSign ? sign : '') + number;
    }

    function trimNumberPercent(num) {
        let number = parseFloat(num).toFixed(2);

        return ((number > 0) ? '+' : '') + number + '%';
    }

    function creteStockEntry(stock, index, arr, uiStatus) {


        let stockChange;
        switch (uiStatus.presentationIndex) {
            case 0:
                stockChange = trimNumberPercent(stock.realtime_chg_percent);
                break;
            case 1:
                stockChange = trimNumber(stock.realtime_change);
                break;
            case 2:
                stockChange = (stock.MarketCapitalization);
                break;
        }
        let trend = (stock.realtime_change > 0) ? "positive_trend" : "negative_trend";
        let disableUpButton = (index === 0);
        let disableDownButton = (index === arr.length - 1);
        let arrowVisibility = uiStatus.isFilterOpen ? "hidden_element" : "";

        const createUpButton = () =>
            `<button class="sock_line_up_button icon-arrow ${(index === 0) ? 'icon_arrow_disable' : ''}" ${disableUpButton ? 'disabled' : ''} data-symbol="${stock.Symbol}"></button>`;
        const createDownButton = () =>
            `<button class="sock_line_down_button icon-arrow ${(index === arr.length - 1) ? 'icon_arrow_disable' : ''}" ${disableDownButton ? 'disabled' : ''} data-symbol="${stock.Symbol}" ></button>`;

        return `<li class="stock_line">
                <span class="stock_line_name"> ${stock.Symbol} (${stock.Name})</span>
                <div class="sock_line_right_panel">
                <span class ="stock_line_lastPrice"> ${trimNumber(stock.LastTradePriceOnly)}</span>
                <button class="stock_line_change_btn ${trend}">${stockChange}</button>
                <div class="stock_line_move_panel ${arrowVisibility}">
                    ${createUpButton()}
                    ${createDownButton()}
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

    function actionClickCB(ev) {
        let ctrl = window.Stokr.Controller;
        if (ev.target.dataset.actionname === 'filter') {
            ctrl.toggleFilter();
        } else if (ev.target.dataset.actionname === 'refresh') {
            ctrl.refresh();
        }
    }

    function createFilter(uiState) {
        if (!uiState.isFilterOpen) {
            return ``;
        }

        const selectedTrend = uiState.filterParameters.trend;
        const allSelected = (selectedTrend === 'all') ? 'selected' : '';
        const losingSelected = (selectedTrend === 'losing') ? 'selected' : '';
        const gainingSelected = (selectedTrend === 'gaining') ? 'selected' : '';

        return (`<section class="filter_section">
                      <form class="filter_form" id="filter_form">
                          
                          <div class="form_first_col">
                              <label for="stockname">By Name</label> 
                              <input type="text" id="stockname" name="stockname" value="${uiState.filterParameters.stockName}">
                              <label for="trend">By Trend</label> 
                              <select id="trend" name="trend">
                                  <option value="all" ${allSelected}>All</option>
                                  <option value="losing" ${losingSelected}>Losing</option>
                                  <option value="gaining" ${gainingSelected}>Gaining</option>
                              </select>
                          </div>
                          <div class="form_second_col">
                              <label for="byRangeFrom">By Range: From</label>
                              <input type="number"  id="byRangeFrom" name="byRangeFrom" value="${uiState.filterParameters.byRangeFrom}" step="0.10" min="0" max="100">
                              <label for="byRangeTo">By Range: To</label>
                              <input type="number" id="byRangeTo" name="byRangeTo" value="${uiState.filterParameters.byRangeTo}" step="0.10" min="0" max="100">
                          </div>
                          
                          <input class="apply_button" id="apply_button" type="submit" value="Apply">
                      </form>
                  </section>`);
    }

    function addEventListeners(container) {
        //Stock Entries:
        container.querySelector(".stocks_list").addEventListener('click', stockClickCB);
        //Header Actions:
        container.querySelector(".main_header_action_list").addEventListener('click', actionClickCB);
        //Apply:
        let filterForm = container.querySelector("#filter_form");
        if (filterForm) {
            filterForm.addEventListener('submit', submitFormCB);
        }
    }

    function submitFormCB(ev) {
        ev.preventDefault();
        let ctrl = window.Stokr.Controller;
        let formElements = ev.target.elements;

        const stockName = formElements.stockname.value;
        const trend = formElements.trend.value;
        const byRangeFrom = formElements.byRangeFrom.value;
        const byRangeTo = formElements.byRangeTo.value;

        ctrl.applyFilter({stockName, trend, byRangeFrom, byRangeTo});
    }

    //******************** Public methods ************************

    function render(stockData, uiState) {
        let hash = window.location.hash.slice(1);

        let container = document.getElementsByClassName('app_content')[0];

        if (!hash || hash === 'home') {
            container.innerHTML = createMainHeader(uiState) + createFilter(uiState) + createStockList(stockData, uiState);
            addEventListeners(container);
        } else if (hash === 'search') {
            container.innerHTML = 'searching';
        } else {
            container.innerHTML = "404";
        }

    }


    //****************************************************************

    window.Stokr.View = {
        render,
    }

})();




