const ax = require('axios');
const { API_KEY } = process.env;

const getTickerRSI_14 = async (ticker) => {

  const closePrices = [];
  let initialState = [];
  const prices = {
    gains: [],
    losses: [],
  };
  const rsi = {
    averageGains: 0,
    averageLoose: 0,
    initalAverage: {
      gains: 0,
      loose: 0,
    },
    value: 0,
  }

  const initial_average_range = () => {
        // Calculating inital values
    for ( let i = 0; i < initialState.length - 1; i += 1 ) {
      if (initialState[i] < initialState[i + 1]) {
        prices.gains.push((initialState[i + 1] - initialState[i]).toFixed(2));
      } else {
        prices.losses.push((initialState[i + 1] - initialState[i]).toFixed(2));
      }
    };

    // reduce data to get average gains
    for ( let f = 0; f <= prices.gains.length -1; f += 1) {
      let number = prices.gains[f];
      rsi.initalAverage.gains += Math.abs(number);
    } 

    // reduce data to get average losses
    for ( let f = 0; f <= prices.losses.length -1; f += 1) {
      let number = prices.losses[f];
      rsi.initalAverage.loose += Math.abs(number);
    } 

    rsi.averageGains = parseFloat(rsi.initalAverage.gains).toFixed(2) / 14;
    rsi.averageLoose = parseFloat(rsi.initalAverage.loose).toFixed(2) / 14;

    // getting RSI value
    const RS = (rsi.averageGains / rsi.averageLoose);
    const RSI = 100.0 - (100.0 / (1 + RS));

    // Asigning RSI value
    rsi.value = RSI;
    return exponentialAverage()
;  }

  const exponentialAverage = () => {
    for ( let i = 14; i < closePrices.length - 1; i += 1 ) {
      let averageGainsExponential = rsi.averageGains * 13;
      let averageLooseExponential = rsi.averageLoose * 13;
      if (closePrices[i] < closePrices[i + 1]) {
        averageGainsExponential += Math.abs(closePrices[i + 1] - closePrices[i]);
        averageLooseExponential += 0;
        rsi.averageGains = Math.abs(averageGainsExponential / 14);
        rsi.averageLoose = Math.abs(averageLooseExponential / 14);
      } else {
        averageLooseExponential += Math.abs(closePrices[i + 1] - closePrices[i]);
        averageGainsExponential += 0;
        rsi.averageGains = Math.abs(averageGainsExponential / 14);
        rsi.averageLoose = Math.abs(averageLooseExponential / 14);
      }
    };

    const RS = (rsi.averageGains / rsi.averageLoose);
    const RSI = 100.0 - (100.0 / (1 + RS));

    // Asigning RSI value
    rsi.value = RSI;

    return RSI;
  }

    // Get Data from server
    const call = await ax.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=compact&apikey=CVME68EYU0DNTGGO`);
    const res = call.data;
  
    // Parsing the data
    Object.keys(res['Time Series (Daily)'])
      .map((date) => {
        return Object.entries(res['Time Series (Daily)'][date])
        .map(([key, value], index) => {
          if (index === 3) {
              const closePrice = parseFloat(value);
              closePrices.push(closePrice.toFixed(2));
          }
        });
    });
  
    // Assinging Values
    closePrices.reverse();
    initialState = closePrices.slice(0, 14);

    console.log(initial_average_range());
};

getTickerRSI_14('STZ');
