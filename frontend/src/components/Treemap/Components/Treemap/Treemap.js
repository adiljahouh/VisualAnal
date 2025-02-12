import React, { useState, useContext, useEffect } from 'react';
import { AgChartsReact } from 'ag-charts-react';
import { ApiDataContext } from '../../Context/ApiDataContext/ApiDataContext';

const Treemap = ( { openNewsModal, vague } ) => {
    const [ready, setReady] = useState(false);
    const [options, setOptions] = useState(null);
/*
Component responsible for the Treemap.

openNewsModal: function. responsible for opening the newsmodal for a specific 
               cluster

vague: boolean. controls whether to set opacity to 0.0 or at 1.0
*/
  //Function to generate random colors for each cluster
  const getRandomColors = (n) => {
    const colors = [];
    for (let i = 0; i < n; i++) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      colors.push(`rgb(${r}, ${g}, ${b})`);
    }
    return colors;
  }

  //Get Api data from context
  const { treemapData, loaded } = useContext(ApiDataContext);

  //Colors for the tiles of each cluster
  const [clusterColors, setClusterColors] = useState([]);

  //Generate random colors for each cluster
  useEffect(() => {
    if (treemapData.children) {
      setClusterColors(getRandomColors(treemapData.children.length));
    }
    setOptions({
      data: treemapData,    
      series: [
        {
          type: 'treemap',
          labelKey: 'word',
  
          listeners: {
                nodeClick: (event) => {
                  openNewsModal(event.datum.cluster_id);
                },
              },          
  
          gradient: false,
          nodePadding: 2,
          sizeKey: 'importance',
          tileStroke: 'white',
          tileStrokeWidth: 1,
          labelShadow: {
            enabled: false,
          },
          groupFill: 'transparent',
          title: {
            color: 'black'
          },
          subtitle: {
            color: 'black',
          },
          labels: {
            value: {
              name: 'Importance',
              formatter: (params) => `${params.datum.importance}`,
            },
          },
          groupStrokeWidth: 0,
          highlightGroups: false,
          highlightStyle: {
            text: {
              color: undefined,
            },
          },
          formatter: ({ depth, parent, highlighted }) => {
            if (depth < 2) {
              return {};
            }
            const color_this_cluster = loaded ? clusterColors[parent.name.split(' ')[1]] : null;
            const fill = color_this_cluster;
            const stroke = highlighted ? 'black' : 'white';
            return { fill, stroke };
          },
        },
      ],
      title: {
        text: 'Clusters and their defining words',
      }
    });
    setReady(true);
  }, [treemapData]);

  return(
    <div style={{opacity: vague ? '0.0': '1.0', height: '500px', width: '100%'}}>
      {loaded && ready ? <AgChartsReact options={options} /> : <div>Waiting for API...</div>}
    </div>
  );    
};

export default Treemap;