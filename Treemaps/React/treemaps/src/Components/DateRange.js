import React from 'react';
import { useContext } from 'react';
import { DateContext } from '../Context/DateContext/DateContext';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import DateRangeIcon from '@mui/icons-material/DateRange';
import Button from '@mui/material/Button';

const DateRange = () => {
    const { startDate, endDate, set_new_date } = useContext(DateContext);

    const handleCallback = (start, end) => {
      set_new_date(start, end);
    }

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '20px',
        paddingBottom: '25px'
      }}>
          <DateRangePicker
            initialSettings={{ startDate: startDate, endDate: endDate  }}
            onCallback={handleCallback}
          >
          <Button variant="outlined" startIcon={<DateRangeIcon />}>
              Set Date Range
          </Button>
        </DateRangePicker>
      </div>       
    );
};

export default DateRange;