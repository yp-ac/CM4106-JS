// use d3-scale to figure out x & y coordinates
const xScale = d3.scaleBand()
const yScale = d3.scaleLinear()

export default function initChart(svgc, props) {
    // initialize the horizontal scale
    let { data, width, height, min, max, colors } = props
    xScale.domain(data.map(d => d.rank))  // used to map the bars
          .rangeRound([0, width])
          .padding(0.1)

    // initialize the vertical scale 
    yScale.domain([min, max])
          .range([height, 0])

    // initialize the chart
    svgc.selectAll('rect')
        .data(data)
        .enter() // add the new data
        .append('rect') // append rectangle for new data
        .attr('height', d => height - yScale(d.value))
        .attr('width', xScale.bandwidth())
        .attr('fill', (d) => colors[d.color])
        .attr('x', d => xScale(d.id))
        .attr('y', d => yScale(d.value))

    return async (props) => {
        let { data, duration, colors } = props
        xScale.domain(data.map(d => d.rank))
       
        let transition = svgc.transition()
                             .duration(duration)
                             .ease(d3.easeLinear)

        svgc.selectAll('rect')
            .data(data, d => d.id)
            .attr('fill', (d) => colors[d.color])
            .transition(transition)
            .attr('x', (d) => xScale(d.id))

        await transition.end()
        svgc.selectAll('rect')
            .attr('fill', colors[0])
    }
}
