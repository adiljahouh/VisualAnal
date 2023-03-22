const getData = () => {
    return {
      name: 'Clusters',
      children: [
        {
          name: 'Cluster X',
          children: [
            {
              name: 'Important word cluster x',
              importance: 25000,
              cluster_id: 'x'
            },
            {
              name: 'Another inmportant word cluster x',
              importance: 8000,
              cluster_id: 'x'
            }
          ],
        },
        {
          name: 'Cluster Y',
          children: [
            {
              name: 'Important word cluster y',
              importance: 25000,
              cluster_id: 'y'
            },
            {
              name: 'Another inmportant word cluster y',
              importance: 16784,
              cluster_id: 'y'
            }
          ],
        },
      ],
    };
  };

const get_articles = () => {
  return {
    'x': ['34', '62', '3', '18', '26', '444'],
    'y': ['73', '33', '2', '1', '5', '6']
  }
};

export {getData, get_articles}