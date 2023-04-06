import React, { useState, useContext } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import "../../react_news_cards.css";
import SentimentSlider from "./SentimentSlider";
import Stack from "@mui/material/Stack";
import IconButton from '@mui/material/IconButton';
import { ApiDataContext } from '../../Context/ApiDataContext/ApiDataContext';
import ArticleViewer from "./ArticleViewer";

const NewsModal = ({ setOpen, cluster }) => {
/*
Component containing news articles and sentiment slider. The news articles 
"live" in the ArticleViewer component. The sentiment slider is a custom component
the sentiment slider itself is controlled by the SentimentSlider component.

setOpen: function. If called with (false) -> modal is closed.
cluster: cluster_id specifying which cluster to show articles from
*/
  // Set the range of sentiment values to show on slider
  const [sentimentSliderRange, setSentimentSliderRange] = useState([-100, -13]);

  // Set the range of sentiment values to show on slider
  const [newsSentimentRange, setNewsSentimentRange] = useState(sentimentSliderRange);
  
  // Get articles for specific cluster
  const { newsModalData } = useContext(ApiDataContext);
  const articles = newsModalData[cluster];

  //If apply button is clicked, update the shown articles
  //to the chosen range
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
