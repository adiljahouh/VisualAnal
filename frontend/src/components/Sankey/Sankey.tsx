import React, { Component } from "react";
import { Chart } from "react-google-charts";
import {
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  SelectChangeEvent,
  Input,
  Grid, Typography, CircularProgress,
} from "@mui/material";
import moment from 'moment';

interface SankeyProps {
  date: {
    start: string;
    end: string;
  };
}

interface SankeyState {
  sankeyData: any;
  names: string[];
  selectedName: string;
  selectedWidth: number;
  selectedWeight: number;
  fetchingAPI: boolean;
}

interface QueryParamsMail {
  [key: string]: string | number;
  sender: string;
  weight: number;
  width: number;
  start: string;
  end: string;
}

class SankeyChart extends Component<SankeyProps, SankeyState> {
  constructor(props: SankeyProps) {
    super(props);

    this.state = {
      sankeyData: [],
      names: [],
      selectedName: "Sven Flecha",
      selectedWidth: 3,
      selectedWeight: 2,
      fetchingAPI: true,
    };
  }

  fetchSankeyMailData() {
    this.setState({ fetchingAPI: true });

    const queryParams: QueryParamsMail = {
      sender: this.state.selectedName,
      weight: this.state.selectedWeight,
      width: this.state.selectedWidth,
      start: moment(this.props.date.start).toISOString(),
      end: moment(this.props.date.end).toISOString(),
    }

    const url = 'http://localhost:5000/mails?' + Object.keys(queryParams)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
      .join('&');

    fetch(url)
      .then((response) => response.json())
      .then((data) => this.setState({ sankeyData: data, fetchingAPI: false }));
  }

  fetchSankeyMailNames() {
    const queryParams: { [key: string]: string | number; start: string, end: string } = {
      start: moment(this.props.date.start).toISOString(),
      end: moment(this.props.date.end).toISOString(),
    }

    const url = 'http://localhost:5000/mails/names?' + Object.keys(queryParams)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
      .join('&');

      fetch(url)
        .then((response) => response.json())
        .then((data) => this.setState({ names: data }));
  }

  componentDidMount() {
    // Fetch data from API based on date range and set sankeyData state
    this.fetchSankeyMailNames();
    this.fetchSankeyMailData();
  }

  componentDidUpdate(prevProps: SankeyProps) {
    if (prevProps.date !== this.props.date) {
      this.fetchSankeyMailNames();
      this.fetchSankeyMailData();
    }
  }

  handleNameChange = (event: SelectChangeEvent<string>) => {
    this.setState({ selectedName: event.target.value });
    this.fetchSankeyMailData()
  };

  handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (isNaN(value)) {
      // Handle error case where value is not an integer
    } else {
      this.setState({ selectedWidth: value });
      this.fetchSankeyMailData()
    }
  };

  handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 2)
    if (isNaN(value)) {
      // Handle error case where value is not an integer
    } else {
      this.setState({ selectedWeight: value });
      this.fetchSankeyMailData()
    }
  };

  render() {
    const options = {
      sankey: {
        node: { colors: ["#a6cee3", "#b2df8a", "#fb9a99", "#fdbf6f"] },
        link: {
          colorMode: "gradient", colors: [
            "#a6cee3",
            "#b2df8a",
            "#fb9a99",
            "#fdbf6f",
            "#cab2d6",
            "#ffff99",
            "#1f78b4",
            "#33a02c",
          ],
        },
      },
    };

    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="name-select-label">Name</InputLabel>
            <Select
              labelId="name-select-label"
              id="name-select"
              value={this.state.selectedName}
              onChange={this.handleNameChange}
            >
              {this.state.names.map((name) => (
                <MenuItem value={name} key={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={4}>
          <FormControl fullWidth>
            <InputLabel htmlFor="width-input">Width</InputLabel>
            <Input
              id="width-input"
              type="number"
              value={this.state.selectedWidth.toString()}
              onChange={this.handleWidthChange}
              inputProps={{ min: 1, max: 20 }}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={4}>
          <FormControl fullWidth>
            <InputLabel htmlFor="weight-input">Weight</InputLabel>
            <Input
              id="weight-input"
              type="number"
              value={this.state.selectedWeight.toString()}
              onChange={this.handleWeightChange}
              inputProps={{ min: 1, max: 20 }}
            />
          </FormControl>
        </Grid>

        {this.state.fetchingAPI ? (
          <Grid item xs={12}>
            <Grid container justifyContent="center" alignContent="center">
              <CircularProgress size={100} />
            </Grid>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Grid container justifyContent="center" alignContent="center">
              {this.state.sankeyData && this.state.sankeyData.length > 1 ? (
                <Chart
                  chartType="Sankey"
                  data={this.state.sankeyData}
                  options={options}
                  width="100%"
                  height="500px" />
              ) : (
                <Grid item>
                  <Typography variant="h6" align="center">
                    No data to display.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
    )
  }
}

export default SankeyChart;
