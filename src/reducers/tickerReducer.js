import {
  ON_TICKER_DATA,
} from '../actions';

const initialState = {
  symbol: 'tBTCUSD',
  low: 'N/A',
  high: 'N/A',
  dailyChange: 'N/A',
  dailyChangePerc: 'N/A',
  volume: 'N/A',
  lastPrice: 'N/A',
};

export default (state = initialState, action) => {
 switch (action.type) {
   case ON_TICKER_DATA:
     return action.payload;
   default:
     return state;
 }
}
