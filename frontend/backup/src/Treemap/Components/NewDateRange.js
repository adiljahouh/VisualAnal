import React, { useState, useContext } from "react";
import DateRangeIcon from '@mui/icons-material/DateRange';
import Button from '@mui/material/Button';
import { DateContext } from "../Context/DateContext/DateContext";
import moment from "moment";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import { DateRange } from 'react-date-range';
import { Stack } from "@mui/system";

const centerThatStuff = {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '20px',
    paddingBottom: '25px'
};

const NewDateRangePicker = () => {
  
  const [showOtherComponent, setShowOtherComponent] = useState(false);

  const handleButtonClick = () => {
    setShowOtherComponent(true);
  };

  const handleOtherComponentClose = () => {
    setShowOtherComponent(false);
  };

  return (
    <>
    {!showOtherComponent ? (
       <div style={centerThatStuff}>
       <Button variant="outlined" startIcon={<DateRangeIcon />} onClick={handleButtonClick} >
             Set Date Range
       </Button>
       </div>
     ) : (
       <DateRangePickerComponent close={handleOtherComponentClose} />
     )}
    </>

  );
};


const DateRangePickerComponent = ({close}) => {
    const { startDate, endDate, set_new_date } = useContext(DateContext);
    
    const [state, setState] = useState([
        {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          key: 'selection'
        }
      ]);
      
    return(
        <Stack direction="column" spacing={0} alignItems="center" style={{paddingTop: '20px'}}>
            <DateRange
                editableDateInputs={true}
                onChange={item => setState([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={state}
            />
            <div>
            <Button
                disabled={false}
                size="medium"
                variant="outlined"
                onClick={ () => {
                    set_new_date(moment(state[0].startDate), moment(state[0].endDate));
                    close();}}
            >   
                Apply
            </Button>
            <Button
                disabled={false}
                size="medium"
                variant="outlined"
                onClick={ () => close()}
            >   
                Cancel
            </Button>
            </div>
        </Stack>            
    );
};

export default NewDateRangePicker;
