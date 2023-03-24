const format_data_for_treemap = (api_data) => {
    // Format the data into the format required by the treemap
    const treemap_data = {
        name: 'Clusters',
        children: [],
    };

    // Add the clusters to the treemap data
    api_data.clusters.forEach((cluster) => {

        //Add cluster id to words
        const words_with_cluster_id = cluster.words.map((word) => {
            return { ...word, cluster_id: cluster.cluster };
        });          

        treemap_data.children.push({
            name: `Cluster ${cluster.cluster}`,
            children: words_with_cluster_id,
        });
    });

    return treemap_data;
}

const format_data_for_news_modal = (api_data) => {
    // Create a list of objects of the form {cluster_id: {id: article.id, sentiment_score: article.sentiment_score, date: article.date }}
    let obj = {};
    
    api_data.clusters.forEach((cluster) => {
        const cluster_id = cluster.cluster;
        const article_ids = cluster.articles.map((article) => {
            return {id: article.id, sentiment_score: article.sentiment_score, date: new Date(Date.parse(article.date))};
        });

        obj[cluster_id] = article_ids;
    });

    return obj;
}

///////////////////////////////////////// THE REDUCER /////////////////////////////////////////

export default (state, action) => {
    switch(action.type) {
        case 'NEW_CLUSTER_DATA':
            return {
                loaded: true,
                treemapData: format_data_for_treemap(action.json),
                newsModalData: format_data_for_news_modal(action.json)
            }
        default:
            return state;
    }
};