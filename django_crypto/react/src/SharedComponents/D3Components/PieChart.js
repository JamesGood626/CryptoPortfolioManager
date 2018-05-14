import React, { Component } from 'react'
import * as d3 from 'd3'

class PieChart extends Component {
  componentDidMount = () => {
    if(this.pieChartSvg) {
      if(this.props.pieChartData) {
        const svgDimensions = this.returnSvgDimensions()
        this.doD3Stuff(svgDimensions, svgDimensions, this.props.pieChartData)
        window.addEventListener('resize', this.handleResize)
      }
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = e => {
    let newWidth = this.returnSvgDimensions()
    this.doD3Stuff(newWidth, newWidth, this.props.pieChartData)
  }

  returnSvgDimensions = () => {
    if (window.innerWidth <= 480) {
      return window.innerWidth/1.8
    }
    else if (window.innerWidth > 480 && window.innerWidth <= 768) {
      return window.innerWidth/2.8
    }
    else if (window.innerWidth > 768 && window.innerWidth <= 1280) {
      return window.innerWidth/4.5
    }
    else {
      return window.innerWidth/5.4
    }
  }

  doD3Stuff = (height, width, data) => {
    d3.selectAll("svg > *").remove()

    const pie = d3.pie()
      .value(d => d.number)

    const svg = d3.select(this.pieChartSvg),
    radius = Math.min(width, height) / 2,
    g = svg.append("g").style('transform', 'translate(50%, 50%)')

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

    arc.append("path")
        .attr("d", path)
        .attr("fill", function(d) { return color(d.data.name) })

    arc.append("text")
        .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")" })
        // .attr("transform", function(d) { return "translate(" +  -100 + ")"; })
        .attr("dy", "0.35em")
        .attr("dx", "-1em")
        .text(function(d) { return d.data.name })
  }

  render() {
    return (
      <svg className="pieChartDimensions" ref={x => this.pieChartSvg = x}></svg>
    )
  }
}

export default PieChart