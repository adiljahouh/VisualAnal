import React from 'react';
import { DateContextProvider } from './Context/DateContext/DateContext';
import './App.css';
import DateRange from './Components/DateRange';
import TreemapContainer from './Components/TreemapContainer';



function App() {
  return (
    <React.Fragment>
      <DateContextProvider>
        <DateRange />
        <TreemapContainer/>
      </DateContextProvider>
    </React.Fragment>
  );
}

export default App;
