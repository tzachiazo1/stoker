/**
 * Created by tzachia on 18/07/2017.
 */
let stockData = [
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

];

let uiStatus = {
    presentChangeInPercent: true,
    // presentChangeIn : 'regular',
}


function createStockList() {
    return `<ul class="stocks_list">${stockData.map(creteStockEntry).join('')}</ul>`;
}


function createMainHeader() {


    return `
    <header class="main_header">
        <h1 class="main_title">Stoker</h1>
        <ul class="main_header_action_list">
          <li><button class="action_button main_header_search"><img src="assets/svg/search.svg"></button></li>
          <li><button class="action_button main_header_refresh"><img src="assets/svg/refresh.svg"></button></li>
          <li><button class="action_button main_header_filter"><img src="assets/svg/filter.svg"></button></li>
          <li><button class="action_button main_header_settings"><img src="assets/svg/settings.svg"></button></li>
        </ul>
        
      </header>
    `;
}

function creteStockEntry(elm) {
    let lastTradePrice = Number(elm.LastTradePriceOnly).toFixed(2);

    let percentChange = parseFloat(elm.PercentChange).toFixed(2);


    let trend = (percentChange > 0) ? "positive_trend" : "negative_trend";

    let stockChange = (uiStatus.presentChangeInPercent) ? elm.PercentChange : parseFloat(elm.Change).toFixed(2);

    return `<li class="stock_line">
                <span class="stock_line_name"> ${elm.Symbol} (${elm.Name})</span>
                <div class="sock_line_right_panel">
                <span class ="stock_line_lastPrice"> ${lastTradePrice}</span>
                <button class="stock_line_change_btn ${trend}">${stockChange}</button>
                <div class="stock_line_move_panel">
                    <button class="sock_line_up_button icon-arrow"></button>
                    <button class="sock_line_down_button icon-arrow"></button>
                </div>
                </div>
            </li>`;
}

function createStockListPage(container) {
    container.innerHTML = createMainHeader() + createStockList();

    container.getElementsByClassName("stocks_list")[0].addEventListener('click', stockClickCB);
}

function stockClickCB(ev) {

    if (!ev.target.classList.contains('stock_line_change_btn')) {
        return
    }
    console.log('CLICKEs');
    uiStatus.presentChangeInPercent = !uiStatus.presentChangeInPercent;

    createStockListPage(document.getElementsByClassName('app_content')[0]);
}

createStockListPage(document.getElementsByClassName('app_content')[0]);