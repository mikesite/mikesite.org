define(["require", "exports", "../helper/event", "../helper/string"], function (require, exports, event_1, string_1) {
    "use strict";
    exports.__esModule = true;
    event_1.whenReady(function () {
        var queries = document.querySelectorAll('a.query');
        for (var i = 0; i < queries.length; i++) {
            var query = queries[i];
            var itemBased = query.classList.contains('item') ? 'item&' : '';
            var informationRetrieval = [];
            for (var j = 0; j < query.classList.length; j++) {
                var c = query.classList.item(j);
                if (c != null && string_1.startsWith('ret')(c)) {
                    informationRetrieval[informationRetrieval.length] = encodeURIComponent(c.substr(3));
                }
            }
            var retrieval = informationRetrieval.length ? "&ret=" + informationRetrieval.join(',') : "";
            query.target = '_blank';
            query.href = 'card-and-item-query.php?' + itemBased + 'query=' + encodeURIComponent(query.innerText) + retrieval;
        }
    });
});
