import axios from "axios";
import React, { useEffect, useState } from "react";
import Banner from "./components/Banner";
import Main from "./components/Main";
import { dateButtonText, returnObjectProperty, URL_PARAMS } from "./constants";
const App = () => {
  const [VTSM, setVTSM] = useState([]);
  const [VBMFX, setVBMFX] = useState([]);
  const [riskIndex, setRiskIndex] = useState([]);
  const [dataAdjustedAs, setDataAdjustedAs] = useState(dateButtonText.ONE_YEAR);
  const [loading, setLoading] = useState(true);

  let apiKeys = [
    process.env.REACT_APP_ALPHA_API_KEY,
    process.env.REACT_APP_ALPHA_API_KEY2,
    process.env.REACT_APP_ALPHA_API_KEY3,
    process.env.REACT_APP_ALPHA_API_KEY4,
  ];

  let chooseKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
  const SYMBOLS = [
    { name: "VTI", func: setRiskIndex },
    { name: "VTSMX", func: setVTSM },
    { name: "VBMFX", func: setVBMFX },
  ];

  const dropdownValueChanged = (value) => {
    console.log("dvalue = ", value);
    preprocessData(null, dataAdjustedAs.iterations, value);
  };

  const getData = (adjustedAs = "monthly") => {
    let adjust;
    setLoading(true);

    switch (adjustedAs) {
      case "daily":
        adjust = URL_PARAMS.TIME_SERIES_DAILY_ADJUSTED;
        break;

      case "weekly":
        adjust = URL_PARAMS.TIME_SERIES_WEEKLY_ADJUSTED;
        break;

      case "monthly":
        adjust = URL_PARAMS.TIME_SERIES_MONTHLY_ADJUSTED;
        break;

      default:
        return;
    }

    const url = (symbol) =>
      `https://www.alphavantage.co/query?function=${adjust}&symbol=${symbol}&apikey=${chooseKey}`;

    SYMBOLS.forEach((sym) => {
      const u = url(sym.name);
      axios.get(u).then((res) => {
        // console.log("res = ", res.data);
        sym.func(res.data[returnObjectProperty[adjust]]);
        setLoading(false);
      });
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const [data, setData] = useState({});

  const preprocessData = (dataRange, iterations = null, dropdownValue = 1) => {
    // dataRange = value of any key of dateButtonText
    const prev = dataAdjustedAs.type;

    if (dataRange) {
      if (dataRange.type === "daily") {
        setDataAdjustedAs(dataRange);

        if (prev !== dataRange.type) {
          getData("daily");
          return;
        }
      } else if (dataRange.type === "year") {
        setDataAdjustedAs(dataRange);

        if (prev !== dataRange.type) {
          getData();
          return;
        }
      } else if (dataRange.type === "weekly") {
        setDataAdjustedAs(dataRange);

        if (prev !== dataRange.type) {
          getData("weekly");
          return;
        }
      }
    }

    // let iterations = dataAdjustedAs.iterations;

    // console.log(
    //   "iterations = ",
    //   iterations,
    //   "dataAdjustedAs = ",
    //   dataAdjustedAs,
    //   "data Range = ",
    //   dataRange
    // );

    // assume investment started 02/01/2015
    let investFund = 100000;

    let startVTSM, startVBMFX;

    dropdownValue = parseInt(dropdownValue);

    if (dropdownValue === 1) {
      startVTSM = Number((investFund * 0.6) / 51.55);
      startVBMFX = Number((investFund * 0.4) / 10.9);
    } else if (dropdownValue === 2) {
      startVTSM = Number((investFund * 0.2) / 51.55);
      startVBMFX = Number((investFund * 0.8) / 10.9);
    }

    let startRisk = Number(investFund / 105);

    let dateArr = [];
    let priceArr = [];
    let riskArr = [];

    if (VTSM && VBMFX && riskIndex) {
      let obKey = Object.keys(VTSM);

      let dateRange = (arr) => {
        if (!iterations) iterations = arr.length;
        for (let i = iterations - 1; i > -1; i--) dateArr.push(arr[i]);
        return dateArr;
      };

      dateRange(obKey);

      let riskInVal = Object.values(riskIndex);
      let riskdata = riskInVal.map((d) => d["4. close"]);

      let riskInPrice = (arr1) => {
        if (!iterations) iterations = arr1.length;

        for (let i = iterations - 1; i > -1; i--)
          riskArr.push((startRisk * Number(arr1[i])).toFixed(2));
        return riskArr;
      };

      riskInPrice(riskdata);

      let obVal = Object.values(VTSM);
      let VTSMdata = obVal.map((d) => d["4. close"]);

      let obVal2 = Object.values(VBMFX);
      let VBMFXdata = obVal2.map((d) => d["4. close"]);

      console.log("startVTSM", startVTSM, "startVBMFX", startVBMFX);

      let standardPrice = (arr1, arr2) => {
        if (!iterations) iterations = arr1.length;

        for (let i = iterations - 1; i > -1; i--) {
          priceArr.push(
            (
              startVTSM * Number(arr1[i]) +
              startVBMFX * Number(arr2[i])
            ).toFixed(2)
          );
        }
        return priceArr;
      };

      standardPrice(VTSMdata, VBMFXdata);

      console.log({
        dateArr,
        priceArr,
        riskArr,
      });

      setData({
        dateArr,
        priceArr,
        riskArr,
      });
    }
  };

  useEffect(() => {
    preprocessData(null, dataAdjustedAs.iterations);
  }, [VTSM, VBMFX, riskIndex]);

  return (
    <div>
      <Banner />

      <Main
        date={data.dateArr}
        price={data.priceArr}
        riskPrice={data.riskArr}
        loading={loading}
        preprocessData={preprocessData}
        dropdownValueChanged={dropdownValueChanged}
      />
    </div>
  );
};

export default App;
