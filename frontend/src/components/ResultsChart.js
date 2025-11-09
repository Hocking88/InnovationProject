//ResultsChart.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

/**
 * A D3 donut chart component to display a confidence score.
  * @param {object} props - Component props.
  * @param {number} props.value - The confidence score (0-100).
  * @param {string} props.status - The scan status ('SAFE' or 'MALICIOUS').
 */
// 1. Accept 'status' as a prop
export default function ResultsChart({ value, status }) {
  const chartRef = useRef();

  useEffect(() => {
    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    const score = value;
    const data = [
      { name: 'Confidence', value: score },
      { name: 'Remaining', value: 100 - score },
    ];

    const width = 250;
    const height = 250;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.7; // This creates the donut hole

    // 2. CHOOSE THE COLOR
    // Use green (#2e7d32) for SAFE, and red (#d32f2f) for MALICIOUS
    const activeColor = status === 'SAFE' ? '#2e7d32' : '#d32f2f';

    // 3. USE THE 'activeColor' IN THE RANGE
    const color = d3.scaleOrdinal()
      .domain(['Confidence', 'Remaining'])
      .range([activeColor, '#e0e0e0']); // Using activeColor and grey

    const pie = d3.pie()
      .value(d => d.value)
      .sort(null); // Do not sort, keep data order

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Draw the arcs
    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.name));

    // Add the "%" text in the middle
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .style('font-size', '2.5rem')
      .style('font-weight', 'bold')
      .attr('fill', 'currentColor') // Use theme text color
      .text(`${score}%`);
    
    // Add the "Confidence" sub-text
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '2.5em')
      .style('font-size', '1rem')
      .attr('fill', 'currentColor') // Use theme text color
      .text('Confidence');

  // 4. Add 'status' to the dependency array
  }, [value, status]); // Rerun effect if value or status changes

  return <div ref={chartRef} style={{ display: 'inline-block' }}></div>;
}