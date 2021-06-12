export const URL_PARAMS = Object.freeze({
  TIME_SERIES_MONTHLY_ADJUSTED: "TIME_SERIES_MONTHLY_ADJUSTED",
  TIME_SERIES_WEEKLY_ADJUSTED: "TIME_SERIES_WEEKLY_ADJUSTED",
  TIME_SERIES_DAILY_ADJUSTED: "TIME_SERIES_DAILY_ADJUSTED",
});

export const returnObjectProperty = Object.freeze({
  TIME_SERIES_MONTHLY_ADJUSTED: "Monthly Adjusted Time Series",
  TIME_SERIES_WEEKLY_ADJUSTED: "Weekly Adjusted Time Series",
  TIME_SERIES_DAILY_ADJUSTED: "Time Series (Daily)",
});

const monthDiff = () => {
  const d1 = new Date("2015-01-01T00:00:00");
  const d2 = new Date();

  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};

export const dateButtonText = Object.freeze({
  ONE_MONTH: { text: "1 Month", type: "daily", iterations: 20 },
  SIX_MONTHS: { text: "6 Months", type: "weekly", iterations: 4 * 6 },
  YEAR_TO_DATE: { text: "Year-to-date", type: "daily", iterations: null },
  ONE_YEAR: { text: "1 Year", type: "year", iterations: 12 },
  FIVE_YEARS: { text: "5 Years", type: "year", iterations: 60 },
  MAX: { text: "Max", type: "year", iterations: monthDiff() + 1 },
});

export const dateButtonTextReverse = Object.freeze({});
