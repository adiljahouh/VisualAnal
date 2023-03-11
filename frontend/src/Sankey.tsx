// data: Array<Array<String | number>> = [
//   ["From", "To", "Weight"],
//   ["Brazil", "Portugal", 5],
//   ["Brazil", "France", 1],
// ];
import React, { Component } from "react";
import { Chart } from "react-google-charts";
export class Sankey extends Component {
  sankeyData: any[];
  componentDidMount() {
    fetch("http://localhost:5000/api/Sankey")
      .then((response) => response.json())
      // .then((data) => {
      //   console.log(data);
      // })
      .then((data) => {
        this.setState((this.sankeyData = data));
      });
  }

  componentWillUnmount() {
    console.log("unmounting");
  }
  colors: string[] = [
    "#a6cee3",
    "#b2df8a",
    "#fb9a99",
    "#fdbf6f",
    "#cab2d6",
    "#ffff99",
    "#1f78b4",
    "#33a02c",
  ];
  // https://developers.google.com/chart/interactive/docs/gallery/sankey#data-format
  options = {
    sankey: {
      tooltip: { isHtml: true },
      link: {
        colorMode: "gradient",
        colors: this.colors,
      },
      node: {
        colormode: "Gradient",
        colors: this.colors,
      },
    },
  };

  render() {
    console.log("yoo", this.sankeyData);
    return (
      <div>
        <Chart
          chartType="Sankey"
          width="100%"
          height="500px"
          data={this.sankeyData}
          options={this.options}
        />
      </div>
    );
  }
}
export default Sankey;
