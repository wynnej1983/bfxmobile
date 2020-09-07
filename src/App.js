import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import Websocket from 'react-native-websocket';

import Ticker from './components/ticker';
import OrderBook from './components/orderBook';
import Trades from './components/trades';
import { onTickerData, onBookData, onTradesData } from './actions';

class App extends Component {
  constructor(props) {
    super(props);
    this.channels = [];
    this.state = {
      isConnected: false,
    };
  }

  componentDidMount() {
    console.log(this.props);
  }

  subscribeChannel = (channel, options = {}) => {
    const ws = this.refWebSocket.state.ws;
    ws.send(
      JSON.stringify({
        event: 'subscribe',
        channel,
        symbol: 'tBTCUSD',
        ...options,
      })
    );
  };

  handleMessage = (msg) => {
    const message = JSON.parse(msg.data);
    if (Array.isArray(message)) {
      const chanId = message[0];
      const channel = this.channels[chanId];
      if (channel === 'ticker') {
        const data = message[1];
        if (Array.isArray(data)) {
          this.props.dispatch(onTickerData(data));
        }
      } else if (channel === 'book') {
        const data = message[1];
        if (Array.isArray(data)) {
          this.props.dispatch(onBookData(data));
        }
      } else if (channel === 'trades') {
        const data =
          message[1] === 'te' || message[1] === 'tu'
            ? [message[2]]
            : message[1];
        if (Array.isArray(data) && message[1] !== 'tu') {
          this.props.dispatch(onTradesData(data));
        }
      }
    } else {
      const { event, channel, chanId } = message;
      if (event === 'subscribed') {
        this.channels[chanId] = channel;
      }
    }
  };

  handleOpen = () => {
    console.log('connected:)');
    this.setState({ isConnected: true });
    this.subscribeChannel('ticker');
    this.subscribeChannel('book', { prec: this.props.bookPrec });
    this.subscribeChannel('trades');
  };

  handleClose = () => {
    this.setState({ isConnected: false });
    console.log('disconnected:(');
  };

  toggleConnection = () => {
    if (this.state.isConnected) {
      this.refWebSocket.reconnect = false;
      this.refWebSocket.state.ws.close();
    } else {
      this.refWebSocket.reconnect = true;
      this.refWebSocket._handleWebSocketSetup();
    }
    this.setState({ isConnected: !this.state.isConnected });
  };

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.bookPrec !== this.props.bookPrec) {
      this.refWebSocket.reconnect = false;
      this.refWebSocket.state.ws.close();
      this.refWebSocket._handleWebSocketSetup();
      this.subscribeChannel('book', { prec: nextProps.bookPrec });
    }
  }

  render() {
    const { isConnected } = this.state;
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView>
          <StatusBar style="light" />
          <Websocket
            ref={(ref) => {
              this.refWebSocket = ref;
            }}
            url="wss://api.bitfinex.com/ws/2"
            onMessage={this.handleMessage}
            onOpen={this.handleOpen}
            onClose={this.handleClose}
            onError={console.log}
            reconnect // Will try to reconnect onClose
          />
          <TouchableOpacity onPress={this.toggleConnection}>
            <Text style={[styles.button, { opacity: isConnected ? 1 : 0.5 }]}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </TouchableOpacity>
          <Ticker />
          <OrderBook />
          <Trades />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({ orderBook }) => {
  return {
    bookPrec: orderBook.prec,
  };
};

export default connect(mapStateToProps)(App);

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#1b262d',
  },
  button: {
    color: '#FFF',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 5,
    padding: 5,
  },
});
