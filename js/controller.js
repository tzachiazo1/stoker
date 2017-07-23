/**
 * Created by tzachia on 18/07/2017.
 */
window.Stokr = window.Stokr || {};

(function () {
    let model = window.Stokr.Model;
    let view = window.Stokr.View;


    function createStockList() {
        let data = model.getStocks();
        return `<ul class="stocks_list">${data.map(creteStockEntry).join('')}</ul>`;
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

    function creteStockEntry(elm, index, arr) {
        let lastTradePrice = Number(elm.LastTradePriceOnly).toFixed(2);
        let percentChange = parseFloat(elm.PercentChange).toFixed(2);

        let trend = (percentChange > 0) ? "positive_trend" : "negative_trend";

        let stockChange = (model.getChangeFormat() === 'percent') ? elm.PercentChange : parseFloat(elm.Change).toFixed(2);
        let disableUpButton = (index === 0);
        let disableDownButton = (index === arr.length - 1);

        return `<li class="stock_line">

                <span class="stock_line_name"> ${elm.Symbol} (${elm.Name})</span>
                <div class="sock_line_right_panel">
                <span class ="stock_line_lastPrice"> ${lastTradePrice}</span>
                <button class="stock_line_change_btn ${trend}">${stockChange}</button>
                <div class="stock_line_move_panel">
                    <button class="sock_line_up_button icon-arrow ${disableUpButton ? 'icon_arrow_disable' : ''}" ${disableUpButton ? 'disabled' : ''} data-symbol="${elm.Symbol}"></button>
                    <button class="sock_line_down_button icon-arrow ${disableDownButton ? 'icon_arrow_disable' : ''}" ${disableDownButton ? 'disabled' : ''} data-symbol="${elm.Symbol}"></button>
                </div>
                </div>
            </li>`;
    }

    function createStockListPage(container) {
        container.innerHTML = createMainHeader() + createStockList();
        container.getElementsByClassName("stocks_list")[0].addEventListener('click', stockClickCB);
    }

    function stockClickCB(ev) {
        if (ev.target.classList.contains('stock_line_change_btn')) {
            model.toggleChangeFormat()
        }
        else if (ev.target.classList.contains('sock_line_up_button')) {
            model.moveStockPosition(ev.target.dataset.symbol, model.direction.up);
        }
        else if (ev.target.classList.contains('sock_line_down_button')) {
            model.moveStockPosition(ev.target.dataset.symbol, model.direction.down);
        }

        createStockListPage(document.getElementsByClassName('app_content')[0]);
    }

    createStockListPage(document.getElementsByClassName('app_content')[0]);

})();
