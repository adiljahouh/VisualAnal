import moment from "moment";
import React, { createContext, useReducer } from "react";
import Reducer from "./Reducer";

// Create initialState
const initial_state = {
  startDate: moment("1988-01-01"),
  endDate: moment("2016-12-31"),
};

///////////////////////////////////////// DEFINE GLOBAL CONTEXT /////////////////////////////////////////

export const DateContext = createContext(initial_state);

// Define GlobalProvider, link to AppReducer
export const DateContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initial_state);

  // Define all functions that can be passed down to children
  const set_new_date = (start, end) => {
    // console.log(start, end);
    console.log('Triggerd set_new_date');
    dispatch({
      type: "SET_NEW_DATES",
      startDate: start,
      endDate: end,
    });
  };

  ///////////////////////////////////////// RETURN GLOBAL PROVIDER /////////////////////////////////////////

  const contextValues = {
    startDate: state.startDate,
    endDate: state.endDate,
    set_new_date,
  };

  return (
    <DateContext.Provider value={contextValues}>
      {children}
    </DateContext.Provider>
  );
};
