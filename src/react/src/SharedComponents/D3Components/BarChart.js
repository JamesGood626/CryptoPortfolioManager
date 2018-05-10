import React, { Component } from 'react'
import * as d3 from 'd3'

class BarChart extends Component {
  componentDidMount = () => {
    const { barChartData } = this.props
    if(barChartData) {
      const svgDimensions = this.returnSvgDimensions()
      this.doD3Stuff(svgDimensions, svgDimensions/2.2, barChartData)
      window.addEventListener('resize', this.handleResize)
    }
  }

  componentDidUnmount = () => {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = e => {
    let newWidth = this.returnSvgDimensions()
    this.doD3Stuff(newWidth, newWidth/2.2, this.props.barChartData)
  }

  returnSvgDimensions = () => {
    if (window.innerWidth <= 480) {
      return window.innerWidth*1.1
    }
    else if (window.innerWidth > 480 && window.innerWidth <= 660) {
      return window.innerWidth/1.2
    }
    else if (window.innerWidth > 660 && window.innerWidth <= 880) {
      return window.innerWidth/1.4
    }
    else if (window.innerWidth > 880 && window.innerWidth <= 1024) {
      return window.innerWidth/1.6
    }
    else if (window.innerWidth > 1024 && window.innerWidth <= 1280) {
      return window.innerWidth/1.8
    }
    else {
      return window.innerWidth/2.6
    }
  }

  doD3Stuff = (widthNum, heightNum, data) => {
    d3.selectAll("svg > *").remove()
    
    var margin = {top: 20, right: 30, bottom: 40, left: 30},
      width = widthNum - margin.left - margin.right,
      height = heightNum - margin.top - margin.bottom;

    var x = d3.scaleLinear()
          .range([0, width]),
        y = d3.scaleBand()
          .rangeRound([0, height])
          .paddingInner(0.1)

    var div = d3.select(".tooltip")

    var svg = d3.select(this.barChartSvg)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    x.domain(d3.extent(data, function(d) { return d.number })).nice()
    y.domain(data.map(function(d) { return d.name }))

    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y)
      

    // g.append("g")
    //     .attr("class", "axis axis--x")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis)

    // g.append("g")
    //     .attr("class", "axis axis--y")
    //     .call(yAxis)
    //   .append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 6)
    //     .attr("dy", "0.71em")
    //     .attr("text-anchor", "end")
    //     .text("Frequency")

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
          .style("opacity", 1.0);
        div.html("Yo Brah") //*************** Put in the relevant stuffs ************/
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px")
      })
      .on("mouseout", function(d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

    svg.append("g")
			.attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			
    // add tickNegative /** The x(25) as opposed to x(0) made the bars align with yAxis */
    // However, I just added a transform to all of the bars
		var tickNeg = svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + x(0) + ",0)")
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
      <svg className="barChartDimensions"ref={ x => this.barChartSvg = x }></svg>
    ]
  }
}

export default BarChart