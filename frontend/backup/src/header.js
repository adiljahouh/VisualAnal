import React from "react";
import Sankey from "./Sankey/Sankey.tsx";
import { useState } from "react";
import { DateContext } from "./Treemap/Context/DateContext/DateContext.js";
import { useContext } from "react";
import TreemapContainer from "./Treemap/Components/TreemapContainer.js";
import NewDateRangePicker from "./Treemap/Components/NewDateRange";

const ComponentC = () => {
  return <h1>Component C</h1>;
};
const Header = () => {
  const [selectedComponent, setSelectedComponent] = useState("");
  const { startDate, endDate } = useContext(DateContext);
  const handleComponentChange = (event) => {
    setSelectedComponent(event.target.value);
  };
  console.log(
    startDate.format("YYYY-MM-DD"),
    endDate.format("YYYY-MM-DD"),
    " test"
  );
  return (
    <div>
      <nav>
        <select value={selectedComponent} onChange={handleComponentChange}>
          <option value="">Select a component</option>
          <option value="componentSankey">Sankey</option>
          <option value="TreeMapContainer">Tree Map</option>
          <option value="componentC">Component c</option>
        </select>
      </nav>      
      <NewDateRangePicker/>
      {selectedComponent === "componentSankey" && (
        <Sankey
          date={{
            start: startDate.format("YYYY-MM-DD"),
            end: endDate.format("YYYY-MM-DD"),
          }}
        />
      )}
      {selectedComponent === "TreeMapContainer" && <TreemapContainer />}
      {selectedComponent === "componentC" && <ComponentC />}
    </div>
  );
};

export default Header;
