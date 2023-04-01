import React, { useState, useContext } from "react";
import { ApiDataContext } from "../Context/ApiDataContext/ApiDataContext";
import "../App.css";

const Counter = () => {
  const { treemapData, new_cluster_data } = useContext(ApiDataContext);

  const num_clusters = 4;

  try {
    const num_clusters = treemapData.children.length;
  } catch (err) {
    const num_clusters = 4;
  }

  const [count, setCount] = useState(num_clusters);

  const increment = () => {
    setCount(count + 1);
    new_cluster_data(count + 1);
  };

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1);
      new_cluster_data(count - 1);
    }
  };

  return (
    <div className="counter">
      <button onClick={decrement}>-</button>
      <span>Number of clusters: {count}</span>
      <button onClick={increment}>+</button>
    </div>
  );
};

export default Counter;
