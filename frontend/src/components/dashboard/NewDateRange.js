import React, { useState, useContext } from "react";
import DateRangeIcon from '@mui/icons-material/DateRange';
import Button from '@mui/material/Button';
import { DateContext } from "../Treemap/Context/DateContext/DateContext";
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
/* Component controlling what is shown. At first, only a button is shown. When
  the button is clicked, a date range picker is shown.
*/

  // Variable that controls whether or not the date range picker is shown
  const [showOtherComponent, setShowOtherComponent] = useState(false);

  const handleButtonClick = () => {
    // When the button is clicked, show the date range picker
    setShowOtherComponent(true);
  };

  const handleOtherComponentClose = () => {
    // When the date range picker is closed, hide it
    setShowOtherComponent(false);
  };

  //Depending on the state of the showOtherComponent variable, 
  //show the date range picker or the button
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
/* The actual DateRangePicker component. This component is shown when the button
  is clicked. The close function is called when the date range picker is closed.

  close: function. If called -> date range picker is closed.
*/
    const { startDate, endDate, set_new_date } = useContext(DateContext);
    
    //Transform the dates from context to Date() objects
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
