import { combineReducers } from 'redux';
import tickerReducer from './tickerReducer';
import bookReducer from './bookReducer';
import tradesReducer from './tradesReducer';

export default combineReducers({
 ticker: tickerReducer,
 orderBook: bookReducer,
 trades: tradesReducer,
});
