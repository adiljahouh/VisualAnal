import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { Button } from '@mui/material';

function valuetext(value) {
  return `${value}`;
}

export default function SentimentSlider( {sentimentRange, setSentimentRange, handleApply} ) {
/*
Sentiment slider component. The selected range is used 
by the ArticleViewer componet to filter articles by sentiment.
*/

    const handleChange = (event, newValue) => {
      setSentimentRange(newValue);
    };
  
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '20px',
            paddingBottom: '25px',
            borderColor: 'black',
            borderStyle: 'solid',
            borderRadius: '10px',
            borderWidth: '1px',
        }}>
            <Stack spacing={0.5} direction="column" sx={{ mb: 1 }} alignItems="center">
                <p>Sentiment values (*100)</p>
                <Stack direction="row" spacing={1} alignItems="center">
                    <SentimentVeryDissatisfiedIcon/>
                    <Box sx={{ width: 350 }}>
                        <Slider
                            getAriaLabel={() => 'Temperature range'}
                            value={sentimentRange}
                            max={100}
                            min={-100}
                            onChange={handleChange}
                            valueLabelDisplay="auto"
                            getAriaValueText={valuetext}
                        />
                    </Box>
                    <SentimentSatisfiedAltIcon/>
                </Stack>
                <Button  variant='contained' onClick={() => handleApply()}>Apply</Button>
            </Stack>
        </div>
    );
}