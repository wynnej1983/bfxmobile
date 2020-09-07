import { ON_TRADES_DATA } from '../actions';

const initialState = [
  {
    time: 'N/A',
    price: 'N/A',
    amount: 'N/A',
  },
];

const parseTradeData = (data) => {
  return data.map((d) => ({
    amount: Number(d.amount),
    price: Math.floor(Number(d.price)),
    time: d.time,
  }));
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ON_TRADES_DATA:
      if (action.payload.length > 1) {
        //snapshot
        return parseTradeData(action.payload);
      }

      const trade = {
        amount: Number(action.payload[0].amount),
        price: Math.floor(Number(action.payload[0].price)),
        time: action.payload[0].time,
      };

      return [trade, ...state];
    default:
      return state;
  }
};
