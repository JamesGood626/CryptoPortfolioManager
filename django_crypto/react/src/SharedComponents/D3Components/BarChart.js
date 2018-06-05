import React, { Component } from 'react'
import * as d3 from 'd3'

class BarChart extends Component {
  componentDidMount = () => {
    const { barChartData } = this.props
    if(barChartData && barChartData.length !== 0) {
      this.doD3Stuff(barChartData)
    }
  }

  extractExtent = data => {
    let filteredNumbers = data.reduce((acc, curr) => {
      acc.push(curr.number)
      return acc
    }, [])
    let len = filteredNumbers.length
    filteredNumbers.sort()
    if(filteredNumbers[0] < 0) {
      for(let i in filteredNumbers) {
        if(filteredNumbers[i] > 0) return [filteredNumbers[0], filteredNumbers[len - 1]]
      }
      return [filteredNumbers[len - 1], 0]
    }
    else {
      return [0, filteredNumbers[len - 1]]
    }
  }
  
  doD3Stuff = (data) => {
    // const data = [{name: 'ETH', number: 150}, {name: 'LTC', number: 350}, {name: 'XRP', number: -220}]
    const margin = {top: 20, right: 30, bottom: 40, left: 30},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom

    const x = d3.scaleLinear()
          .range([0, width]),
        y = d3.scaleBand()
          .rangeRound([0, height])
          .paddingInner(0.1)

    const div = d3.select(".tooltip")

    const svg = d3.select(this.barChartSvg)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", "0 0 960 500")

    const g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    x.domain(this.extractExtent(data)).nice()
    y.domain(data.map(function(d) { return d.name }))


    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y)
      
    // All of this .attr code positioned the bars correctly on the graph
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
        .attr("class", function(d) { return "bar bar--" + (d.number < 0 ? "negative" : "positive") })
        .attr("x", function(d) { return x(Math.min(0, d.number)) })
        .attr("y", function(d) { return y(d.name) })
        .attr("width", function(d) { return Math.abs(x(d.number) - x(0)) })
        .attr("height", y.bandwidth())
        .attr("transform", "translate(" + -margin.left + "," + -margin.top + ")")
      // tooltip
      .on("mouseover", function(d) {
        div.transition()
          .duration(200)
          .style("opacity", 1.0)
        div.html(`Percentage P/L: ${d.number}%`)
        .style("left", (d3.event.pageX - 120) + "px")
        .style("top", (d3.event.pageY) + "px")
      })
      .on("mouseout", function(d) {
        div.transition()
          .duration(500)
          .style("opacity", 0)
      })

    svg.append("g")
			.attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .classed("chart-text", true)
			.call(xAxis)
      
		const tickNeg = svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + x(0) + ",0)")
        .classed("chart-text", true)
				.call(yAxis)
			.selectAll(".tick")
      .filter(function(d, i) { return data[i].number < 0 })
      

		tickNeg.select("line")
      .attr("x2", 6)
			
		tickNeg.select("text")
			.attr("x", 9)
      .style("text-anchor", "start")
  }

  render() {
    return [
      <div className="tooltip"/>,
      <svg className="barChartDimensions" ref={ x => this.barChartSvg = x }></svg>
    ]
  }
}

export default BarChart