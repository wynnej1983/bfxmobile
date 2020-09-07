import {
  ON_BOOK_DATA,
  INCREMENT_BOOK_PREC,
  DECREMENT_BOOK_PREC,
} from '../actions';

const initialState = {
  prec: 'P0',
  bids: [
    {
      count: 'N/A',
      amount: 'N/A',
      total: 'N/A',
      price: 'N/A',
    },
  ],
  asks: [
    {
      price: 'N/A',
      total: 'N/A',
      amount: 'N/A',
      count: 'N/A',
    },
  ],
};

const parseOrderData = (data, type) => {
  const startIndex = type === 'bid' ? 0 : 25;
  const endIndex = type === 'bid' ? 25 : 50;
  return data.slice(startIndex, endIndex).reduce((acc, d, idx) => {
    const result = {
      amount: Number(d.amount),
      total:
        idx === 0
          ? Number(d.amount)
          : +(Number(acc[idx - 1].total) + Number(d.amount)).toFixed(3),
      count: Number(d.count),
      price: Number(d.price),
    };
    return acc.concat(result);
  }, []);
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ON_BOOK_DATA:
      if (action.payload.length > 1) {
        //snapshot
        const bids = parseOrderData(action.payload, 'bid');
        const asks = parseOrderData(action.payload, 'ask');
        return { ...state, bids, asks };
      }
      const order = action.payload[0];
      const amount = Number(order.amount);
      const count = Number(order.count);
      const price = Number(order.price);
      if (count > 0) {
        if (amount > 0) {
          const index = state.bids.findIndex((d) => d.price === price);
          if (index !== -1) {
            //update bid
            return {
              ...state,
              bids: state.bids
                .map((d, idx) => {
                  if (idx === index) {
                    return { ...d, amount, count, price };
                  } else {
                    return d;
                  }
                })
                .reduce((acc, cur, idx) => {
                  const result = {
                    ...cur,
                    total:
                      idx === 0
                        ? Number(cur.amount)
                        : +(
                            Number(acc[idx - 1].total) + Number(cur.amount)
                          ).toFixed(3),
                  };
                  return acc.concat(result);
                }, []),
            };
          } else {
            //add bid
            return {
              ...state,
              bids: [
                ...state.bids,
                {
                  count,
                  amount,
                  price,
                },
              ]
                .reduce((acc, cur, idx) => {
                  const result = {
                    ...cur,
                    total:
                      idx === 0
                        ? Number(cur.amount)
                        : +(
                            Number(acc[idx - 1].total) + Number(cur.amount)
                          ).toFixed(3),
                  };
                  return acc.concat(result);
                }, [])
                .sort((a, b) => b.price - a.price),
            };
          }
        } else if (amount < 0) {
          const index = state.asks.findIndex((d) => d.price === price);
          if (index !== -1) {
            //update ask
            return {
              ...state,
              asks: state.asks
                .map((d, idx) => {
                  if (idx === index) {
                    return { ...d, amount, count, price };
                  } else {
                    return d;
                  }
                })
                .reduce((acc, cur, idx) => {
                  const result = {
                    ...cur,
                    total:
                      idx === 0
                        ? Number(cur.amount)
                        : +(
                            Number(acc[idx - 1].total) + Number(cur.amount)
                          ).toFixed(3),
                  };
                  return acc.concat(result);
                }, []),
            };
          } else {
            //add ask
            return {
              ...state,
              asks: [
                ...state.asks,
                {
                  count,
                  amount,
                  price,
                },
              ]
                .reduce((acc, cur, idx) => {
                  const result = {
                    ...cur,
                    total:
                      idx === 0
                        ? Number(cur.amount)
                        : +(
                            Number(acc[idx - 1].total) + Number(cur.amount)
                          ).toFixed(3),
                  };
                  return acc.concat(result);
                }, [])
                .sort((a, b) => a.price - b.price),
            };
          }
        }
      } else if (count === 0) {
        if (amount === 1) {
          //remove bid
          return {
            ...state,
            bids: state.bids.filter((d) => d.price !== price),
          };
        } else {
          //remove ask
          return {
            ...state,
            asks: state.asks.filter((d) => d.price !== price),
          };
        }
      }
      return state;
    case INCREMENT_BOOK_PREC:
      return {
        ...state,
        prec: state.prec === 'P4' ? 'P4' : `P${Number(state.prec[1]) + 1}`,
      };
    case DECREMENT_BOOK_PREC:
      return {
        ...state,
        prec: state.prec === 'P0' ? 'P0' : `P${Number(state.prec[1]) - 1}`,
      };
    default:
      return state;
  }
};
