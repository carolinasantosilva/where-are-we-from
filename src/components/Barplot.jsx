
import * as d3 from "d3";
import { useState } from "react";
import "./Barplot.css";

function Barplot({ data }) {
  const width = 900;
  const height = 520;

  const margin = {
    top: 40,
    right: 40,
    bottom: 40,
    left: 180,
  };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const [tooltip, setTooltip] = useState(null);

  const totalStudents = d3.sum(data, (d) => d.students);

  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.country))
    .range([0, innerHeight])
    .padding(0.25);

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.students) || 1])
    .range([0, innerWidth]);

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        {/* World map background */}
        <div className="world-map-background" />

        <svg
          className="barplot"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {data.map((d) => {
              const percentage = totalStudents
                ? ((d.students / totalStudents) * 100).toFixed(1)
                : 0;

              return (
                <g
                  key={d.country}
                  className="bar-group"
                  onMouseEnter={(event) => {
                    const rect = event.currentTarget
                      .querySelector(".bar")
                      .getBoundingClientRect();

                    setTooltip({
                      country: d.country,
                      students: d.students,
                      percentage,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                >
                  {/* Background track */}
                  <rect
                    className="bar-track"
                    x={0}
                    y={yScale(d.country)}
                    width={innerWidth}
                    height={yScale.bandwidth()}
                    rx={10}
                  />

                  {/* Actual bar */}
                  <rect
                    className="bar"
                    x={0}
                    y={yScale(d.country)}
                    width={xScale(d.students)}
                    height={yScale.bandwidth()}
                    rx={10}
                  />

                  {/* Country label */}
                  <text
                    className="country-label"
                    x={-16}
                    y={yScale(d.country) + yScale.bandwidth() / 2}
                    textAnchor="end"
                    dominantBaseline="middle"
                  >
                    {d.country}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Custom tooltip */}
        {tooltip && (
          <div
            className="chart-tooltip"
            style={{
              left: tooltip.x,
              top: tooltip.y,
            }}
          >
            <strong>{tooltip.country}</strong>
            <span>{tooltip.students} students</span>
            <small>{tooltip.percentage}% of total</small>
          </div>
        )}
      </div>
    </div>
  );
}

export default Barplot;
