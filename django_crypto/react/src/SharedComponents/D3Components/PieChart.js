import React, { Component } from 'react'
import * as d3 from 'd3'

class PieChart extends Component {
  componentDidMount = () => {
    if(this.pieChartSvg) {
      if(this.props.pieChartData) {
        this.doD3Stuff(960, 500, this.props.pieChartData)
      }
    }
  }

  doD3Stuff = (height, width, data) => {
    // d3.selectAll("svg > *").remove()

    const div = d3.select(".tooltip")
    const pie = d3.pie()
      .value(d => d.number)

    const svg = d3.select(this.pieChartSvg)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", "0 0 960 500")
    const radius = Math.min(width, height) / 2,
    g = svg.append("g")
      .style('transform', 'translate(50%, 50%)')

    // How to create a dynamic color pallete that doesn't look like crap?
    const color = d3.scaleOrdinal(["#4D5057", "#837A75", "#C57B57", "#F1AB86", "#CFCFCF", "#C8AD55", "#E2D4B7", "#d40000"])


    const path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0)

    const label = d3.arc()
      .outerRadius(radius - 60)
      .innerRadius(radius - 60);

    const arc = g.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
        .attr("class", "arc")
 
    const totalQuantity = data.reduce((acc, curr) =>  acc += curr.number, 0)
    arc.append("path")
      .attr("d", path)
      .attr("fill", function(d) { return color(d.data.name) })
      .on("mouseover", function(d) {
        div.transition()
          .duration(200)
          .style("opacity", 1.0)
        div.html(`${d.data.number} ${d.data.name} <br/> ${ ((d.data.number/totalQuantity) * 100).toFixed(2) }% of portfolio`)
        .style("left", (d3.event.pageX - 120) + "px")
        .style("top", (d3.event.pageY) + "px")
      })
      .on("mouseout", function(d) {
        div.transition()
          .duration(500)
          .style("opacity", 0)
      })
    
    arc.append("text")
        .classed("chart-text", true)
        .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")" })
        // .attr("transform", function(d) { return "translate(" +  -100 + ")"; })
        .attr("dy", "0.35em")
        .attr("dx", "-1em")
        .text(function(d) { return d.data.name })
  }

  render() {
    return [
      <div className="tooltip"/>,
      <svg className="pieChartDimensions" ref={x => this.pieChartSvg = x}></svg>
    ]
  }
}

export default PieChart