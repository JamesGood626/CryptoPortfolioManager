import React, { Component } from 'react'
import * as d3 from 'd3'

class BarChart extends Component {
  // constructor(props) {
  //   super(props)

  //   this.state = {
  //     count: 0
  //   }
  // }

  // componentDidMount() {
  //   if(this.barChartSvg) {
  //     console.log("Doing stuff in bar Chart")


  //     // comment out in actual use
  //     this.doD3Stuff()
  //   }
  // }

  componentDidUpdate() {
    console.log("ITLL BE HERE ON UPDATE")
    console.log(this.props.barChartData)
    if(this.props.barChartData) {
      this.doD3Stuff(this.props.barChartData)
    }
    // if(this.props.pieChartData && this.state.count === 0) {
    //   console.log("THIS IS STATE COUNT")
    //   console.log(this.state.count)
      
    //   this.setState((prevState, state) => ({
    //     count: ++prevState.count
    //   }))
    // }
  }

  doD3Stuff = (data) => {
    console.log('FINALLY RUNNING D3DOSTUFF BARCHART')
    // const data = [
    //   {number: 200, name: "ICX"},
    //   {number: 150, name: "BTC"},
    //   {number: 40, name: "ENG"},
    //   {number: 300, name: "DENT"},
    //   {number: 220, name: "ADA"},
    //   {number: 80, name: "LUX"},
    //   {number: 200, name: "ETH"},
    //   {number: -200, name: "MKR"}
    // ]
    
    var margin = {top: 20, right: 30, bottom: 40, left: 30},
      width = 660 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

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
    const styles = {
      // 'background': '#0ee',
      'padding': '1rem 2rem'
    }
    return [
      <div class="tooltip"/>,
      <svg style={styles} ref={x => this.barChartSvg = x}></svg>
    ]
  }
}

export default BarChart