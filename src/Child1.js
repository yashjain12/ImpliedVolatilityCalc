import React, { Component } from "react";
import "./Child1.css";
import * as d3 from "d3";

class Child1 extends Component {
  
  state = { 
    company: "Apple", // Default Company
    selectedMonth: 'November' //Default Month
  };

  componentDidMount() {
    this.chart()
  }

  componentDidUpdate() {
    this.chart()
  }
  chart() {
    var csv_data = this.props.csv_data
    const {company, selectedMonth} = this.state
    if (typeof(csv_data[0].Date) == "string") {
      csv_data = csv_data.map(function (d) { d.Date = new Date(d.Date) } )
    }
    var dataToPlot = csv_data.filter(
      (d) => d.Company === company && d.Date.toString().substring(4,7) === selectedMonth.substring(0,3) 
    )

    /*const parseDate = d3.timeParse('%Y-%m-%d');*/
    const margin = { top: 40, right: 120, bottom: 40, left: 40 },
      width = 800,
      height = 500,
      innerWidth = width - margin.left - margin.right,
      innerHeight = height - margin.top - margin.bottom;

    var dateList = dataToPlot.map(d => d.Date)

    d3.select(".lineplot").selectAll(".mygroup").data([0]).join("g").attr("class", 'mygroup')
    d3.select('.mygroup').selectAll("*").remove()
    const svg = d3.select('.lineplot').attr("width", width).attr("height", height).attr("transform", `translate(0, 50)`)
    const group = svg.select(".mygroup").attr("transform", `translate(${margin.left}, ${margin.top})`)
    
    const x_scale = d3.scaleTime().domain([d3.min(dateList), d3.max(dateList)]).range([0, innerWidth])
    
    const minOfMins = d3.min([d3.min(dataToPlot.map(d => d.Close)), d3.min(dataToPlot.map(d => d.Open))])
    const maxOfMaxes = d3.max([d3.max(dataToPlot.map(d => d.Open)), d3.max(dataToPlot.map(d => d.Open))])

    const extent = maxOfMaxes - minOfMins 

    const y_scale = d3.scaleLinear().domain([minOfMins - 1/10 * extent, maxOfMaxes + 1/10 * extent]).range([innerHeight, 0])
    
    var lineGenerator = d3.line().x(d => x_scale(d.Date)).y(d => y_scale(d.Open)).curve(d3.curveCatmullRom)
    var lineGenerator2 = d3.line().x(d => x_scale(d.Date)).y(d => y_scale(d.Close)).curve(d3.curveCatmullRom)

    var pathData = lineGenerator(dataToPlot)
    var pathData2 = lineGenerator2(dataToPlot)
    group.selectAll('.path1').data([pathData]).join('path').attr('class', 'path1').attr('d', d => d).attr('fill', 'none').attr('stroke', '#e41a1c').attr('stroke-width', 4)
    group.selectAll('.path2').data([pathData2]).join('path').attr('class', 'path2').attr('d', d => d).attr('fill', 'none').attr('stroke', '#b2df8a').attr('stroke-width', 4)

    group.selectAll(".x axis").data([0]).join('g').attr('class', 'x axis').attr('transform', `translate(0, ${innerHeight})`).call(d3.axisBottom(x_scale))
    .selectAll("text").attr("transform", "rotate(45),translate(35,-2)").style("text-anchor", "end");
    group.selectAll(".y axis").data([0]).join('g').attr('class', 'y axis').attr('transform', `translate(0, 0)`).call(d3.axisLeft(y_scale))

    
    const tooltipinfo = group.append("g").attr("class", "tooltip-group").style("visibility", "hidden")

    tooltipinfo.append("rect").attr("class", "tooltip").attr("fill", "black").attr("opacity", 0.8).attr("width", 120).attr("height", 75).attr("rx", 5).attr("ry", 5);

    tooltipinfo
      .selectAll("text")
      .data(["Date:", "Open:", "Close:", "Difference:"])
      .join("text")
      .attr("class", (d, i) => `tooltipinfo${i}`)
      .attr("fill", "white")
      .attr("font-size", 12)
      .attr("dy", (d, i) => 20 + i * 15)
      .attr("x", 10);

    /* Random correction to mouse positions*/
    const a = 5;
    const b = 5;
    
    
    group.selectAll('.circle1').data(dataToPlot).join('circle').attr('class', 'circle1').attr('cx', (d) => x_scale(d.Date)).attr('cy', (d) => y_scale(d.Open)).attr("opacity", "0.79").attr("r", 5).style("fill", "#e41a1c")
    .on("mouseover", (event, d) => {
      tooltipinfo.style("visibility", "visible").attr("transform", `translate(${x_scale(d.Date) + a}, ${y_scale(d.Open) + b})`);
      tooltipinfo.select(".tooltipinfo0").text(`Date: ${d.Date.toLocaleDateString()}`);
      tooltipinfo.select(".tooltipinfo1").text(`Open: ${d.Open.toFixed(2)}`);
      tooltipinfo.select(".tooltipinfo2").text(`Close: ${d.Close.toFixed(2)}`);
      tooltipinfo.select(".tooltipinfo3").text(`Difference: ${(d.Close - d.Open).toFixed(2)}`);
      console.log("x client",event.clientX)
      console.log("scale", x_scale(d.Date))
    })
    /*.on("mousemove", (event) => tooltipinfo.style("transform", `translate(${event.clientX + a}px, ${event.clientY + b}px)`))*/
    .on("mouseout", () => tooltipinfo.style("visibility", "hidden"));/*
    .on("mousemove", (event, d) => {
      tooltipinfo.attr(
        "transform",
        `translate(${x_scale(d.Date) + 10},${y_scale(d.Open) - 70})`
      );
    }).on("mouseout", () => {
      tooltipinfo.attr("opacity", 0);
      tooltipinfo.selectAll("text").text("");
    });*/
    group.selectAll('.circle2').data(dataToPlot).join('circle').attr('class', 'circle2').attr('cx', (d) => x_scale(d.Date)).attr('cy', (d) => y_scale(d.Close)).attr("opacity", "0.79").attr("r", 5).style("fill", "#b2df8a")
    .on("mouseover", (event, d) => {
      tooltipinfo.style("visibility", "visible").attr("transform", `translate(${x_scale(d.Date) + a}, ${y_scale(d.Close) + b})`);
      tooltipinfo.select(".tooltipinfo0").text(`Date: ${d.Date.toLocaleDateString()}`);
      tooltipinfo.select(".tooltipinfo1").text(`Open: ${d.Open.toFixed(2)}`);
      tooltipinfo.select(".tooltipinfo2").text(`Close: ${d.Close.toFixed(2)}`);
      tooltipinfo.select(".tooltipinfo3").text(`Difference: ${(d.Close - d.Open).toFixed(2)}`);
    })
    /*.on("mousemove", (event) => tooltipinfo.style("transform", `translate(${event.pageX + a}px, ${event.pageY + b}px)`))*/
    .on("mouseout", () => tooltipinfo.style("visibility", "hidden"));

    group.selectAll('.legend').data([0]).join('rect').attr('class', 'legend').attr('width', 40).attr('height', 40).style('fill', '#b2df8a').attr("transform", `translate(${10 + innerWidth}, 0)`)
    group.selectAll('.legendtext').data([0]).join('text').attr('class', 'legend').text('Open').attr("transform", `translate(${innerWidth + 55}, 25)`).attr('font-size', '22')

    group.selectAll('.legend2').data([0]).join('rect').attr('class', 'legend').attr('width', 40).attr('height', 40).style('fill', '#e41a1c').attr("transform", `translate(${10 + innerWidth}, 60)`)
    group.selectAll('.legendtext2').data([0]).join('text').attr('class', 'legend').text('Close').attr("transform", `translate(${innerWidth + 55}, 85)`).attr('font-size', '22')

  }

  changecompany = (e) => {
    const selectedValue = e.target.value;
    this.setState({company: selectedValue})
  }
  changemonth = (e) => {
    const selectedValue = e.target.value;
    this.setState({selectedMonth: selectedValue})
  }

  render() {
    const options = ['Apple', 'Microsoft', 'Amazon', 'Google', 'Meta']; // Use this data to create radio button
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; // Use this data to create dropdown

    return (
      <div className="child1">
          <h4>Company:</h4>
          {
          options.map((option) => (
            [
            <input type = "radio" checked = {this.state.company === option} id = {option} name = "Options" value = {option} onChange={this.changecompany}></input>,
            <label for = {option}>{option}</label>
            ]
          ))
          }
          <br></br>
          <h4 id = "askmonth">Month:</h4>
          <select name = "months" id = "months" value = {this.state.selectedMonth} onChange={this.changemonth}>
            
          <br></br>
          {
          months.map((month) => (
            <option value = {month}>{month}</option>
          ))
          }
          </select>
          <svg className="lineplot">
            <g className="mygroup">
              
            </g>
          </svg>
      </div>
    );
  }
}

export default Child1;
