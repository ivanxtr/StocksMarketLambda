const ax = require('axios');
const { API_KEY } = process.env;

const ema14 = async ticker => {
  const closePrices = [];
  
  const SMA = {
    fifty: [],
    fifty_count: 0,
    fifty_multiplier: 0,
    two_hundred: [],
    two_hundred_count: 0,
    two_hundred_multiplier: 0,
    value: {
      fifty: 0,
      two_hundred: 0,
    },
  };
  const EMA = {
    value: {
      fifty: 0,
      two_hundred: 0,
    }
  };

  // Get Data from server
  const call = await ax.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=full&apikey=${API_KEY}`);
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

  /*
      SMA calculation.
      Multiplier: (2 / (Time periods + 1) ) 
      EMA: {Close - EMA(previous day)} x multiplier + EMA(previous day). 
  */

  // 50 periods
  SMA.fifty = closePrices.slice(0, 50);
  SMA.fifty_multiplier = ((2 / 50) + 1);

  // 200 periods
  SMA.two_hundred = closePrices.slice(0, 200);
  SMA.two_hundred_multiplier = ((2 / 200) + 1);

  // Calculating SMA 50
  for ( let sma50 = 0; sma50 < SMA.fifty.length - 1; sma50 += 1 ) {
    SMA.fifty_count += parseFloat(SMA.fifty[sma50]);
    SMA.value.fifty = Math.abs(SMA.fifty_count / 50).toFixed(2);
  };

  // Calculating SMA 200
  for ( let sma200 = 0; sma200 < SMA.two_hundred.length - 1; sma200 += 1 ) {
    SMA.two_hundred_count += parseFloat(SMA.two_hundred[sma200]);
    SMA.value.two_hundred = Math.abs(SMA.two_hundred_count / 200).toFixed(2);
  };

  // Calculating EMA 50

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      ticker,
      SMA_FIFTY: SMA.value.fifty,
      SMA_two_hundred: SMA.value.two_hundred,
    })
  }
  return console.log(response);
}

ema14('NKE.MEX');
