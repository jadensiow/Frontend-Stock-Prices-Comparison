import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

import "../styles/LineChart.css";
import Loader from "./Loader";

const LineChart = (props) => {
  const lineChart = useRef(null);
  const myChart = useRef(null);

  const conversion = 1.33;

  let newPrice, newRiskPrice;

  if (props.currency === "usd") {
    newPrice = props?.data?.price || [];
    newRiskPrice = props?.data?.riskPrice || [];
  } else if (props.currency === "sgd") {
    newPrice = props?.data?.price.map((p) => p * conversion) || [];
    newRiskPrice = props?.data?.riskPrice.map((p) => p * conversion) || [];
  }

  useEffect(() => {
    if (myChart.current) {
      myChart.current.destroy();
    }

    if (!lineChart.current) return;

    const ctx = lineChart.current.getContext("2d");

    myChart.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: props?.data?.date,
        datasets: [
          {
            label: "StashAway Risk Index 14%",
            data: newRiskPrice,
            fill: "none",
            backgroundColor: props.riskColor,
            pointRadius: 2,
            borderColor: props.riskColor,
            borderWidth: 1,
            lineTension: 0,
          },
          {
            label: [props.dropdownValue],
            data: newPrice,
            fill: "none",
            backgroundColor: props.otherColor,
            pointRadius: 2,
            borderColor: props.otherColor,
            borderWidth: 1,
            lineTension: 0,
          },
        ],
      },
      options: {
        color: "rgb(200, 200, 200)",
        scales: {
          x: {
            ticks: {
              color: "rgb(200,200,200)",
            },
          },

          y: {
            ticks: {
              color: "rgb(200,200,200)",
            },
          },
        },
        plugins: {
          legend: {
            position: "bottom",
            align: "center",
            labels: {
              boxHeight: 1,
            },
          },
          title: {
            display: true,
            text: [
              "Portfolio value based on gross returns",
              "Gross returns and exchange rates sourced from Alphavantage ",
            ],
            align: "start",
            color: "rgb(200, 200, 200)",
            font: {
              size: 20,
            },
            padding: {
              top: 30,
              bottom: 50,
            },
          },
          tooltip: {
            enabled: false,
            intersect: false,
            mode: "index",
            backgroundColor: "#fff",
            titleFontSize: 16,
            bodyFontSize: 14,

            external: function (context) {
              // Tooltip Element
              var tooltipEl = document.getElementById("chartjs-tooltip");

              // Create element on first render
              if (!tooltipEl || tooltipEl.querySelector("table") !== null) {
                tooltipEl = document.createElement("div");
                tooltipEl.id = "chartjs-tooltip";

                tooltipEl.innerHTML = `
                        <h6 id="date"></h6>
                        <div class="top-div">

                            <div class="circle-container">
                                <div 
                                    class="circle" 
                                    style="background-color: ${props.riskColor}"
                                ></div> 
                                <h6> 
                                    StashAway Risk Index 14% 
                                </h6>
                            </div>

                            <div class = "text"></div>
                        <div>

                        <div class="top-div">

                            <div class="circle-container">
                                <div 
                                    class="circle" 
                                    style="background-color: ${props.otherColor}"
                                >
                                </div> 
                                <h6 id='legend'> 
                                     
                                </h6>
                            </div>

                            <div class = "text"></div>
                        <div>
                        `;
                document.body.appendChild(tooltipEl);
              }

              // Hide if no tooltip
              var tooltipModel = context.tooltip;
              if (tooltipModel.opacity === 0) {
                tooltipEl.style.opacity = 0;
                return;
              }

              // Set caret Position
              tooltipEl.classList.remove("above", "below", "no-transform");

              if (tooltipModel.yAlign) {
                tooltipEl.classList.add(tooltipModel.yAlign);
              } else {
                tooltipEl.classList.add("no-transform");
              }

              function getBody(bodyItem) {
                return bodyItem.lines;
              }

              // Set Text
              if (tooltipModel.body) {
                var titleLines = tooltipModel.title || [];
                var bodyLines = tooltipModel.body.map(getBody);

                titleLines.forEach(function (title) {
                  tooltipEl.querySelector("#date").innerText = title;
                });

                const divs = tooltipEl.querySelectorAll(".top-div");
                //console.log("divs", divs);
                bodyLines.forEach((body, i) => {
                  const [name, value] = body[0].split(":");

                  divs[i].querySelector(".text").innerText =
                    "$ " + value + " " + props.currency.toUpperCase();

                  const l = divs[i].querySelector("#legend");

                  if (l) {
                    l.innerText = name;
                  }
                });
              }

              var position = context.chart.canvas.getBoundingClientRect();

              // Display, position, and set styles for font
              tooltipEl.style.opacity = 1;
              tooltipEl.style.position = "absolute";
              tooltipEl.style.left =
                position.left + window.pageXOffset + tooltipModel.caretX + "px";
              tooltipEl.style.top =
                position.top + window.pageYOffset + tooltipModel.caretY + "px";
              tooltipEl.style.font = "bodyFont.string";
              tooltipEl.style.padding =
                tooltipModel.padding + "px " + tooltipModel.padding + "px";
              tooltipEl.style.pointerEvents = "none";
            },
          },
        },
      },
    });
  }, [props]);

  useEffect(() => {
    return () => {
      myChart.current.destroy();
    };
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {props.loading ? (
        <Loader />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <canvas ref={lineChart} />
          <div>
            <p>VTSMX - Vanguard Total Stock Market Index</p>
            <p>VTBMX - Vanguard Total Bond Market Index</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LineChart;
