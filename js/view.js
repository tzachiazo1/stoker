/**
 * Created by tzachia on 23/07/2017.
 */


(function(){
    window.Stoker = window.Stokr || {};


    function render() {
        createStockListPage(document.getElementsByClassName('app_content')[0]);
        container.innerHTML = createMainHeader() + createStockList();
        container.getElementsByClassName("stocks_list")[0].addEventListener('click', stockClickCB);
    }


    window.Stoker.View = {
        render,
    }
});
