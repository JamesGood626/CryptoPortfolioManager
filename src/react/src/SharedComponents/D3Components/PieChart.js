import React, { Component } from 'react'
import * as d3 from 'd3'

class PieChart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      count: 0
    }
  }

  componentDidMount() {
    if(this.pieChartSvg) {
      console.log("Doing stuff")


      // comment out in actual use
      this.doD3Stuff()
    }
  }

  // componentDidUpdate() {
  //   console.log("ITLL BE HERE ON UPDATE")
  //   console.log(this.props.pieChartData)
  //   if(this.props.pieChartData && this.state.count === 0) {
  //     console.log("THIS IS STATE COUNT")
  //     console.log(this.state.count)
  //     this.doD3Stuff(this.props.pieChartData)
  //     this.setState((prevState, state) => ({
  //       count: ++prevState.count
  //     }))
  //   }
  // }

  doD3Stuff = () => {
    console.log('FINALLY RUNNING D3DOSTUFF')
    const data = [
      {number: 200, name: "ICX"},
      {number: 150, name: "BTC"},
      {number: 100, name: "ENG"},
      {number: 300, name: "DENT"},
      {number: 220, name: "ADA"},
      {number: 80, name: "LUX"},
      {number: 200, name: "ETH"},
      {number: 200, name: "MKR"}
    ]

    // Pass in the height via props?
    let width = 250
    let height = 250

    const pie = d3.pie()
      .value(d => d.number)

    const svg = d3.select(this.pieChartSvg),
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    console.log('width: ', width)
    console.log('height: ', height )

    // How to create a dynamic color pallete that doesn't look like crap?
    const color = d3.scaleOrdinal(["#C1C1C1", "#E63946", "#011627", "#62BBC1", "#a05d56", "#d0743c", "#ff8c00", "#0ee"])


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
        .attr("fill", function(d) { return color(d.data.name); })

    arc.append("text")
        .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
        // .attr("transform", function(d) { return "translate(" +  -100 + ")"; })
        .attr("dy", "0.35em")
        .attr("dx", "-1em")
        .text(function(d) { return d.data.name; })



    // THE BELOW CODE WORKS SWELL.. DON'T WRAP THE SVG IN A DIV
    // const rectWidth = 25
    // const height = 300
    // const data = [100,250,175,200,120]

    // const svg = d3.select(this.pieChartSvg)
    // svg.selectAll('rect')
    //   .data(data)
    //   .enter().append('rect')
    //   .attr('x', (d, i) => height - d)
    //   .attr('y', d => height - d)
    //   .attr('width', rectWidth)
    //   .attr('height', d => d)
    //   .attr('fill', 'blue')
    //   .attr('stroke', '#fff')

    // console.log(svg)
  }

  render() {
    const styles = {
      'height': '40vh',
      'width': '40vh',
      'background': 'limegreen'
    }
    return (
      <svg style={styles} ref={x => this.pieChartSvg = x}></svg>
    )
  }
}

export default PieChart

// Works but the labels are screwed
// const pie = d3.pie()
//       .value(d => d.number)

//     const svg = d3.select("svg"),
//     width = +svg.attr("width"),
//     height = +svg.attr("height"),
//     radius = Math.min(width, height) / 2,
//     g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

//     const color = d3.scaleOrdinal(["#C1C1C1", "#E63946", "#011627", "#62BBC1", "#a05d56", "#d0743c", "#ff8c00"])


//     const path = d3.arc()
//       .outerRadius(radius - 10)
//       .innerRadius(0)

//     const label = d3.arc()
//       .outerRadius(radius - 60)
//       .innerRadius(radius - 60);

//     const arc = g.selectAll(".arc")
//       .data(pie(data))
//       .enter().append("g")
//         .attr("class", "arc")

//     arc.append("path")
//         .attr("d", path)
//         .attr("fill", function(d) { return color(d.data.name); })

//     arc.append("text")
//         //.attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
//         .attr("dy", "0.35em")
//         .attr("dx", "-1em")
//         .text(function(d) { return d.data.name; })


// const svg = d3.select("svg"),
    // width = +svg.attr("width"),
    // height = +svg.attr("height"),
    // radius = Math.min(width, height) / 2,
    // g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

    // const pieGenerator = d3.pie()
    //   .value(d => { d.number })
    //   .sort((a, b) => {
    //     return a.name.localeCompare(b.name);
    //   })
    // const arcData = pieGenerator(data)

    // var arcGenerator = d3.arc()
    //   .innerRadius(20)
    //   .outerRadius(100);

    // d3.select('g')
    //   .selectAll('path')
    //   .data(arcData)
    //   .enter()
    //   .append('path')
    //   .attr('d', arcGenerator);

    // console.log(arcData)