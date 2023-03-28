import React, { useState } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import "../react_news_cards.css";
import ReactNewsCard from "./ReactNewsCard";
import SentimentSlider from "./SentimentSlider";
import Stack from "@mui/material/Stack";
import IconButton from '@mui/material/IconButton';


const NewsModal = ({ setOpen, cluster }) => {
  /*
A modal containing news articles. The news articles "live" in ReactNewsCard 
components. Whether or not this modal is open depends op open.

setOpen: function. If called with (false) -> modal is closed.
cluster: cluster_id specifying which cluster to show articles from
*/
  const [sentimentSliderRange, setSentimentSliderRange] = useState([30, 67]);
  const [newsSentimentRange, setNewsSentimentRange] = useState(sentimentSliderRange);

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
      <ReactNewsCard cluster={cluster} sentimentRange={newsSentimentRange} />
    </Stack>
  );
};

export default NewsModal;
