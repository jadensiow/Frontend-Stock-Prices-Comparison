import React, { useState } from "react";
import { dateButtonText } from "../constants";
import "../styles/Main.css";
import LineChart from "./LineChart";

const Main = (props) => {
  // console.log(props);
  const array = {
    data: props,
    title: "Investment",
  };
  const [dateButtonsMap, setDateButtonsMap] = useState([
    { text: dateButtonText.ONE_MONTH.text, className: "" },
    { text: dateButtonText.SIX_MONTHS.text, className: "" },
    { text: dateButtonText.YEAR_TO_DATE.text, className: "" },
    { text: dateButtonText.ONE_YEAR.text, className: "clicked" },
    { text: dateButtonText.FIVE_YEARS.text, className: "" },
    { text: dateButtonText.MAX.text, className: "" },
  ]);

  const [currencyButtonsMap, setCurrencyButtonsMap] = useState([
    { text: "SGD", className: "" },
    { text: "USD", className: "clicked" },
  ]);

  const [dropdownValue, setDropdownValue] = useState(
    "60% VTSMX (stocks) + 40% VBMFX (bonds)"
  );

  const clickHandler = (type, btnIndex) => {
    const list = type === "date" ? dateButtonsMap : currencyButtonsMap;
    const newList = list.map((e, i) =>
      i === btnIndex ? { ...e, className: "clicked" } : { ...e, className: "" }
    );
    const obj = dateButtonText[Object.keys(dateButtonText)[btnIndex]];

    if (type === "date") {
      props.preprocessData(obj, obj.iterations);
      setDateButtonsMap(newList);
    } else {
      setCurrencyButtonsMap(newList);
    }
  };

  return (
    <div className="container">
      <div className="dropdown-container-wrapper">
        <div className="info">
          <p className="name">General Investing</p>{" "}
          <p className="risk-index">StashAway Risk Index 14%</p>
        </div>

        <div className="versus">VS</div>

        <div className="dropdown-container">
          <select
            onClick={(e) => {
              if (e.target.value !== "null") {
                console.log(e.target);
                setDropdownValue(e.target.options[e.target.value].innerText);
                props.dropdownValueChanged(e.target.value);
              }
            }}
          >
            <option value="null" disabled selected>
              Which benchmarks do you want to compare?
            </option>
            <option value="1">60% VTSMX (stocks) + 40% VBMFX (bonds)</option>
            <option value="2">20% VTSMX (stocks) + 80% VBMFX (bonds)</option>
          </select>
        </div>
      </div>

      <div id="buttons-container">
        <div className="date-range-buttons">
          {dateButtonsMap.map((button, index) => (
            <button
              className={button.className}
              onClick={() => clickHandler("date", index)}
              key={index}
            >
              {button.text}
            </button>
          ))}
        </div>

        <div className="currency-buttons">
          {currencyButtonsMap.map((button, index) => (
            <button
              className={button.className}
              onClick={() => clickHandler("currency", index)}
              key={index}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>

      <LineChart
        data={array.data}
        title={array.title}
        currency={currencyButtonsMap
          .filter((c) => c.className === "clicked")[0]
          .text.toLowerCase()}
        dropdownValue={dropdownValue}
        riskColor="#44b1a9"
        otherColor="yellow"
        loading={props.loading}
      />
    </div>
  );
};

export default Main;
