import {whenReady}  from "../helper/event";
import {startsWith} from "../helper/string";

whenReady(() => {
    let queries: NodeListOf<Element> = document.querySelectorAll('a.query');
    for (let i: number = 0; i < queries.length; i++) {
        let query: HTMLAnchorElement = queries[i] as HTMLAnchorElement;
        let itemBased: string = query.classList.contains('item') ? 'item&' : '';
        let informationRetrieval: string[] = [];
        for (let j: number = 0; j < query.classList.length; j++) {
            let c = query.classList.item(j);
            if (c != null && startsWith('ret')(c)) {
                informationRetrieval[informationRetrieval.length] = encodeURIComponent(c.substr(3));
            }
        }
        let retrieval: string = informationRetrieval.length ? "&ret=" + informationRetrieval.join(',') : "";
        query.target = '_blank';
        query.href = 'card-and-item-query.php?' + itemBased + 'query=' + encodeURIComponent(query.innerText) + retrieval;
    }
});
