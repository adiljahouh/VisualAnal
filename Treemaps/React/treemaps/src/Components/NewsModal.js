import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import '../react_news_cards.css';
import ReactNewsCard from './ReactNewsCard';
import SentimentSlider from './SentimentSlider';
import Stack from '@mui/material/Stack';

const NewsModal = ( {open, setOpen, cluster} ) => {
/*
A modal containing news articles. The news articles "live" in ReactNewsCard 
components. Whether or not this modal is open depends op open.

open: boolean. If true -> modal is being shown. If false it's not.
setOpen: function. If called with (false) -> modal is closed.
cluster: cluster_id specifying which cluster to show articles from
*/
  const [sentimentRange, setSentimentRange] = useState([30, 67]);

  return (
    <Popup open={open} closeOnDocumentClick={false} onClose={() => setOpen(false)}>
        <Stack direction="row" spacing={1} alignItems="center">
          <SentimentSlider sentimentRange={sentimentRange} setSentimentRange={setSentimentRange}/>
          <div/><div/><div/><div/>
          <button className='close-button' onClick={() => setOpen(false)}/> 
        </Stack> 
        <ReactNewsCard cluster={cluster} sentimentRange={sentimentRange}/>           
    </Popup>
  );
};

export default NewsModal;