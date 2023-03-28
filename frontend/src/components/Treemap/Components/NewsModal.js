import React, { useState, useContext } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import "../react_news_cards.css";
import SentimentSlider from "./SentimentSlider";
import Stack from "@mui/material/Stack";
import IconButton from '@mui/material/IconButton';
import { ApiDataContext } from '../Context/ApiDataContext/ApiDataContext';
import ArticleViewer from "./ArticleViewer";
import moment, { Moment } from "moment";

const NewsModal = ({ setOpen, cluster }) => {
  /*
A modal containing news articles. The news articles "live" in ReactNewsCard 
components. Whether or not this modal is open depends op open.

setOpen: function. If called with (false) -> modal is closed.
cluster: cluster_id specifying which cluster to show articles from
*/
  const [sentimentSliderRange, setSentimentSliderRange] = useState([30, 67]);
  const [newsSentimentRange, setNewsSentimentRange] = useState(sentimentSliderRange);
  
  // Get articles for specific cluster
  const { newsModalData } = useContext(ApiDataContext);
  const articles = newsModalData[cluster];

  const handleApply = () => {
    setNewsSentimentRange(sentimentSliderRange);
  };

  return (
    <Stack direction="column" spacing={1} alignItems="center" >
      <Stack direction="row" spacing={1} alignItems="center">
        <SentimentSlider
          sentimentRange={sentimentSliderRange}
          setSentimentRange={setSentimentSliderRange}
          handleApply={handleApply}
        />
        <div />
        <div />
        <div />
        <IconButton aria-label="close" onClick={() => setOpen(false)}>
          <CancelIcon/>
        </IconButton>
      </Stack>
      <ArticleViewer articles={articles} sentimentRange={newsSentimentRange} />
    </Stack>
  );
};

export default NewsModal;
