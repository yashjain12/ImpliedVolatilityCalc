import React, { Component } from "react";
import "./App.css";
import FileUpload from "./FileUpload";
import Child1 from "./Child1";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data : [
        {"Adj Close": 176.80, "Close": 179.70, "High": 182.94, "Low": 179.12, "Open": 182.63, "Volume": 99310400, "Company": "Apple", "Date": new Date("2024-11-02")},
        {"Adj Close": 172.10, "Close": 174.92, "High": 180.17, "Low": 174.64, "Open": 179.61, "Volume": 94537600, "Company": "Apple", "Date": new Date("2024-11-03")},
        {"Adj Close": 169.23, "Close": 172.00, "High": 175.30, "Low": 171.64, "Open": 172.70, "Volume": 96904000, "Company": "Apple", "Date": new Date("2024-11-04")},
        {"Adj Close": 169.40, "Close": 172.17, "High": 174.14, "Low": 171.03, "Open": 172.89, "Volume": 86709100, "Company": "Apple", "Date": new Date("2024-11-05")},
        {"Adj Close": 169.41, "Close": 172.19, "High": 172.50, "Low": 168.17, "Open": 169.08, "Volume": 89117000, "Company": "Apple", "Date": new Date("2024-11-06")},
        {"Adj Close": 172.26, "Close": 175.08, "High": 175.18, "Low": 170.82, "Open": 172.32, "Volume": 90725000, "Company": "Apple", "Date": new Date("2024-11-07")},
        {"Adj Close": 172.70, "Close": 175.53, "High": 177.18, "Low": 174.82, "Open": 176.12, "Volume": 87762000, "Company": "Apple", "Date": new Date("2024-11-08")},
        {"Adj Close": 169.41, "Close": 172.19, "High": 176.62, "Low": 171.79, "Open": 175.78, "Volume": 90047000, "Company": "Apple", "Date": new Date("2024-11-09")},
        {"Adj Close": 170.28, "Close": 173.07, "High": 173.78, "Low": 171.09, "Open": 171.34, "Volume": 91525000, "Company": "Apple", "Date": new Date("2024-11-10")},
        {"Adj Close": 167.06, "Close": 169.80, "High": 172.54, "Low": 169.41, "Open": 171.51, "Volume": 87030000, "Company": "Apple", "Date": new Date("2024-11-11")},
        {"Adj Close": 163.55, "Close": 166.23, "High": 171.08, "Low": 165.94, "Open": 170.00, "Volume": 88567000, "Company": "Apple", "Date": new Date("2024-11-12")},
        {"Adj Close": 161.86, "Close": 164.51, "High": 169.68, "Low": 164.18, "Open": 166.98, "Volume": 88085000, "Company": "Apple", "Date": new Date("2024-11-13")},
        {"Adj Close": 159.79, "Close": 162.41, "High": 166.33, "Low": 162.30, "Open": 164.42, "Volume": 89617000, "Company": "Apple", "Date": new Date("2024-11-14")},
        {"Adj Close": 159.02, "Close": 161.62, "High": 162.30, "Low": 154.70, "Open": 160.02, "Volume": 90823000, "Company": "Apple", "Date": new Date("2024-11-15")},
        {"Adj Close": 157.20, "Close": 159.78, "High": 162.76, "Low": 157.02, "Open": 158.98, "Volume": 87645000, "Company": "Apple", "Date": new Date("2024-11-16")},
        {"Adj Close": 157.12, "Close": 159.69, "High": 164.39, "Low": 157.82, "Open": 163.50, "Volume": 88735000, "Company": "Apple", "Date": new Date("2024-11-17")},
      ]
      
    };
  }

  set_data = (csv_data) => {
    this.setState({ data: csv_data });
  }

  render() {
    return (
      <div>
        <FileUpload set_data={this.set_data}></FileUpload>
        <div className="parent">
          <Child1 csv_data={this.state.data}></Child1>
        </div>
      </div>
    );
  }
}

export default App;
