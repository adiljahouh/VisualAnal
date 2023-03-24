import React, { Component } from "react";
import { Chart } from "react-google-charts";
import FormControl from "@mui/material/FormControl";
import { MenuItem, Select, InputLabel, SelectChangeEvent } from "@mui/material";
// import Dropdown from "react-bootstrap/Dropdown";
export class Sankey extends Component {
  constructor(props) {
    super(props);
  }
  sankeyData: any;
  names: any[] = []; // both these will be fetched from API, just initialized the arrays
  chart: any;
  // DEFAULT VALUES FOR FIRST RENDER
  selectedWeight: string = "3";
  selectedWidth: string = "2";
  selectedName: string = "Sven-Flecha";
  selectedNameClean: string = "Sven Flecha";
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
  componentDidMount() {
    // this.props.date.start = this.props.date.start.format("YYYY-MM-DD");
    // this.props.date.end = this.props.date.end.format("YYYY-MM-DD");
    // console.log(this.props.date.start);
    // console.log(this.props.date.end);
    // this allows me to use this variables (like self in python), I use this instead of useState and setState to update variables
    this.onNameChange = this.onNameChange.bind(this);
    this.onWeightChange = this.onWeightChange.bind(this);
    this.onWidthChange = this.onWidthChange.bind(this);
    fetch("http://localhost:5000/api/Sankey/names")
      .then((response) => response.json())
      .then((doetoe) => {
        this.setState((this.names = doetoe));
      });
    fetch(
      `http://localhost:5000/api/Sankey/${this.selectedName}/${this.selectedWeight}/${this.selectedWidth}/${this.props.date.start}/${this.props.date.end}`
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState((this.sankeyData = data));
      });
  }

  onNameChange(event: SelectChangeEvent) {
    // console.log(event);
    this.selectedNameClean = event.explicitOriginalTarget.textContent; // e.g Sven Fletcha
    this.selectedName = this.selectedNameClean.replace(" ", "-"); // Sven-Fletcha
    fetch(
      `http://localhost:5000/api/Sankey/${this.selectedName}/${this.selectedWeight}/${this.selectedWidth}/${this.props.date.start}/${this.props.date.end}`
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState((this.sankeyData = data));
      });
  }
  //TODO: bind variable width and
  onWeightChange(event: SelectChangeEvent) {
    let weightUnclean = event.explicitOriginalTarget.textContent;
    let cleanWeight = weightUnclean.replace(" ", "");
    this.selectedWeight = cleanWeight;
    fetch(
      `http://localhost:5000/api/Sankey/${this.selectedName}/${this.selectedWeight}/${this.selectedWidth}/${this.props.date.start}/${this.props.date.end}`
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState((this.sankeyData = data));
      });
  }

  onWidthChange(event: SelectChangeEvent) {
    // console.log(event);
    let widthUnclean = event.explicitOriginalTarget.textContent;
    let cleanWidth = widthUnclean.replace(" ", "");
    this.selectedWidth = cleanWidth;

    fetch(
      `http://localhost:5000/api/Sankey/${this.selectedName}/${this.selectedWeight}/${this.selectedWidth}/${this.props.date.start}/${this.props.date.end}`
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState((this.sankeyData = data));
      });
  }

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
    console.log("rendering sankey component");
    console.log(this.props.date.start);
    console.log(this.props.date.end);
    // console.log(this.sankeyData);
    if (this.sankeyData === undefined || this.sankeyData.length <= 1) {
      this.chart = (
        <div className="flex flex-col w-full h-full mt-32 ml-96 pl-96 pt-48">
          <h4 className="flex font-serif">No data matching this criteria</h4>
          <h1 className="flex font-serif">
            Please increase the depth or decrease the weight
          </h1>
        </div>
      );
    } else {
      this.chart = (
        <div className="flex w-full h-full mt-32 pl-28 pr-28">
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
    return (
      <div className="flex flex-col w-full h-full justify-between p-10">
        <div className="flex flex-row justify-evenly w-full h-full">
          <div className="flex w-full h-full pl-28">
            <FormControl className="w-full">
              <InputLabel id="input-names">Names</InputLabel>
              <Select
                labelId="simple-select-label"
                id="simple-select"
                value={this.selectedNameClean}
                className="w-full"
                onChange={this.onNameChange}
              >
                {this.names.map((user) => (
                  <MenuItem value={user} key={user}>
                    {user}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="flex w-full h-full pl-28 pr-28">
            <FormControl className="w-full">
              <InputLabel id="input-width">Depth</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                className="w-full"
                value={this.selectedWidth}
                onChange={this.onWidthChange}
              >
                {[1, 2, 3, 4, 5].map((width) => (
                  <MenuItem value={width} key={width}>
                    {width}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="flex w-full h-full pl-28 pr-28">
            <FormControl className="w-full">
              <InputLabel id="input-weight">Weight</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                className="w-full"
                onChange={this.onWeightChange}
                value={this.selectedWeight}
              >
                {[1, 2, 3, 4, 5].map((weight) => (
                  <MenuItem value={weight} key={weight}>
                    {weight}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        {this.chart}
      </div>
    );
  }
}
export default Sankey;
