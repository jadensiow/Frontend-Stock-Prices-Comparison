import axios from "axios";
import React from "react";

const App = () => {
  console.log(process.env.REACT_APP_YAHOO_API_KEY);
  const config = {
    headers: {
      "x-rapidapi-key": process.env.REACT_APP_YAHOO_API_KEY,
      "x-rapidapi-host": process.env.REACT_APP_YAHOO_API_HOST,
      useQueryString: true,
    },
    params: {
      symbol: "VTSMX",
      region: "US",
    },
  };

  axios
    .get(
      `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-historical-data`,
      config
    )
    .then((resp) => console.log(resp))
    .catch((err) => console.log(err));

  return <div className="App"></div>;
};

export default App;
