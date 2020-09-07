export const ON_TICKER_DATA = 'ON_TICKER_DATA';
export const ON_BOOK_DATA = 'ON_BOOK_DATA';
export const ON_TRADES_DATA = 'ON_TRADES_DATA';
export const INCREMENT_BOOK_PREC = 'INCREMENT_BOOK_PREC';
export const DECREMENT_BOOK_PREC = 'DECREMENT_BOOK_PREC';

export function onTickerData(data) {
  return {
    type: ON_TICKER_DATA,
    payload: {
      symbol: 'tBTCUSD',
      low: data[9],
      high: data[8],
      dailyChange: data[4],
      dailyChangePerc: data[5],
      volume: data[7],
      lastPrice: data[6],
    },
  };
}

export function onBookData(data) {
  return {
    type: ON_BOOK_DATA,
    payload: Array.isArray(data[0])
      ? data.map((d) => {
          return {
            price: d[0].toFixed(1),
            count: d[1].toFixed(0),
            amount: d[2].toFixed(2),
          };
        })
      : [
          {
            price: data[0].toFixed(1),
            count: data[1].toFixed(0),
            amount: data[2].toFixed(2),
          },
        ],
  };
}

export function onTradesData(data) {
  return {
    type: ON_TRADES_DATA,
    payload: data.map((d) => {
      return {
        time: new Date(d[1])
          .toLocaleTimeString('en-US', { hour12: false })
          .replace(/[AP]M$/, ''),
        price: d[3].toFixed(1),
        amount: d[2].toFixed(4),
      };
    }),
  };
}

export function incrementBookPrec() {
  return {
    type: INCREMENT_BOOK_PREC,
  };
}

export function decrementBookPrec() {
  return {
    type: DECREMENT_BOOK_PREC,
  };
}
