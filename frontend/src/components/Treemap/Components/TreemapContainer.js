import React, { useState } from 'react';
import NewsModal from './NewsModal';
import Treemap from './Treemap';
import ClusterCounter from './ClusterCounter';
import { ApiDataContextProvider } from '../Context/ApiDataContext/ApiDataContext';

const TreemapContainer = () => {
    // Variable to control whether or not news articles are shown on screen
    const [openNews, setOpenNews] = useState(false);
    // Variable controlling which cluster to display articles from
    const [newsClusterToShow, setNewsCluster] = useState(null);

    const openNewsModal = (cluster) => {
    /*
    Function that makes sure the news articles show up on screen.
    Done by setting the relevant useState variables.

    Cluster: the id of the cluster whose articles to show
    */
        setNewsCluster(cluster);
        setOpenNews(true);
    };

    return (        
        // Depending on the state of the useState variables, open the news articles or 
        // the treemap. Plan is to at some point have both and have a vague transparancy
        // over the Treemap when the news is showing        
        <React.Fragment>
            <ApiDataContextProvider>
                {openNews ? <NewsModal setOpen={setOpenNews} cluster={newsClusterToShow}/> : null}
                {openNews? null : <ClusterCounter open={openNews}/>}
                <Treemap openNewsModal={openNewsModal} vague={openNews}/>
            </ApiDataContextProvider> 
        </React.Fragment>
    );
};

export default TreemapContainer;