import React, { createContext, useReducer, useEffect, useState } from 'react';
import ApiDataReducer from './ApiDataReducer';

// Create initialState
const initial_state = {
    loaded: false,
    treemapData: {},
    newsModalData: {}
};

///////////////////////////////////////// DEFINE GLOBAL CONTEXT /////////////////////////////////////////

export const ApiDataContext = createContext(initial_state);

// Define GlobalProvider, link to AppReducer
export const ApiDataContextProvider = ({ children }) => {
    
    const [state, dispatch] = useReducer(ApiDataReducer, initial_state);

    // Define all functions that can be passed down to children
    const new_cluster_data = async (n_clusters = 4, n_top = 10, start = null, end = null) => {

        // Prepare the url
        let url = `http://127.0.0.1:5000/clusters?n_clusters=${n_clusters}&n_top=${n_top}`;
        if (start !== null && end !== null) {
            url += `&start=${start.toISOString()}&end=${end.toISOString()}`;
        }

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
          
        // Here do two awaits to get json
        // Send json to reducer
        const api_data = await fetch(url, requestOptions);
        const json = await api_data.json();

        dispatch({
            type: 'NEW_CLUSTER_DATA',
            json: json
        });
    };

    useEffect(()=> {
        // This useEffect is run only once (at initialization) and triggers a
        // call to the api to get the initial data
        new_cluster_data();
    },[])

   
///////////////////////////////////////// RETURN GLOBAL PROVIDER /////////////////////////////////////////

    const contextValues = {
        loaded: state.loaded,
        treemapData: state.treemapData,
        newsModalData: state.newsModalData,
        new_cluster_data
    };

    return(
        <ApiDataContext.Provider value={contextValues}>
            {children} 
        </ApiDataContext.Provider>
    )
}