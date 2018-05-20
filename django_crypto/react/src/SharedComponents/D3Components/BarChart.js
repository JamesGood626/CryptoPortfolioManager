import React, { Component } from 'react'
import * as d3 from 'd3'

class BarChart extends Component {
  componentDidMount = () => {
    const { barChartData } = this.props
    if(barChartData && barChartData.length !== 0) {
      // const svgDimensions = this.returnSvgDimensions()
      this.doD3Stuff(barChartData)
      // window.addEventListener('resize', this.handleResize)
    }
  }
  // svgDimensions, svgDimensions/2.2,
  // componentWillUnmount = () => {
  //   window.removeEventListener('resize', this.handleResize)
  // }

  // handleResize = e => {
  //   let newDimensions = this.returnSvgDimensions()
  //   this.doD3Stuff(newDimensions, newDimensions/2.2, this.props.barChartData)
  // }

  // returnSvgDimensions = () => {
  //   if (window.innerWidth <= 480) {
  //     return window.innerWidth*1.1
  //   }
  //   else if (window.innerWidth > 480 && window.innerWidth <= 660) {
  //     return window.innerWidth/1.2
  //   }
  //   else if (window.innerWidth > 660 && window.innerWidth <= 880) {
  //     return window.innerWidth/1.4
  //   }
  //   else if (window.innerWidth > 880 && window.innerWidth <= 1024) {
  //     return window.innerWidth/1.6
  //   }
  //   else if (window.innerWidth > 1024 && window.innerWidth <= 1280) {
  //     return window.innerWidth/1.8
  //   }
  //   else {
  //     return window.innerWidth/2.6
  //   }
  // }

  extractExtent = data => {
    let filteredNumbers = data.reduce((acc, curr) => {
        acc.push(curr.number)
        return acc
      }, [])
      let len = filteredNumbers.length
      filteredNumbers.sort()
      if(filteredNumbers[0] < 0) {
        return [filteredNumbers[0], filteredNumbers[len - 1]]
      }
      else {
        return [0, filteredNumbers[len - 1]]
      }
  }
  // widthNum, heightNum,
  doD3Stuff = (data1) => {
    d3.selectAll("svg > *").remove()
    const data = [{name: 'ETH', number: 150}, {name: 'LTC', number: 350}, {name: 'XRP', number: -220}]
    // 
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

      // d3.select("div#d3Container")
      // .append("div")
      //   .classed("svg-container", true)
      // .append("svg")
      //   .attr("preserveAspectRatio", "xMidYMid meet")
      //   .attr("viewBox", "0 0 960 500")
      //   .classed("svg-content-responsive", true)

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
			
    // add tickNegative /** The x(25) as opposed to x(0) made the bars align with yAxis */
    // However, I just added a transform to all of the bars
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
      <div class="tooltip"/>,
      <svg className="barChartDimensions" ref={ x => this.barChartSvg = x }></svg>
    ]
  }
}

export default BarChart