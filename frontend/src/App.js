import React from "react";
import Header from "./header.js";
import { DateContextProvider } from "./Treemap/Context/DateContext/DateContext.js";
// EXAMPLE DATA, in real app it should pass it as a prop?
function App() {
  return (
    <div className="App">
      <div>
        <DateContextProvider>
          <Header />
        </DateContextProvider>
      </div>
    </div>
  );
}

export default App;
