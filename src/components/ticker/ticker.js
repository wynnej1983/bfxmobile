import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { SvgUri } from 'react-native-svg';
import { toDisplayName } from '../../utils';
import numeral from 'numeral';

class Ticker extends Component {
  render() {
    const {
      symbol,
      low,
      high,
      dailyChange,
      dailyChangePerc,
      isPriceDown,
      volume,
      lastPrice,
    } = this.props;
    return (
      <View style={styles.container}>
        <SvgUri
          width="50"
          height="50"
          uri="https://www.bitfinex.com/assets/BTC-alt-1ca8728fcf2bc179dfe11f9a0126bc303bee888bff8132c5ff96a4873cf9f0fb.svg"
          style={{ marginRight: 10 }}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Text style={styles.primaryText}>{symbol}</Text>
            <Text style={styles.primaryText}>
              {numeral(lastPrice).format('0,0')}
            </Text>
          </View>
          <View style={styles.row}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.label}>VOL</Text>
              <Text style={styles.secondaryText}>
                {numeral(volume).format('0,0')}
              </Text>
              <Text style={styles.label}> USD</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={isPriceDown ? styles.redText : styles.greenText}>
                {numeral(dailyChange).format('0.00')}
              </Text>
              <Text style={isPriceDown ? styles.redText : styles.greenText}>
                ({dailyChangePerc})
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.label}>LOW</Text>
              <Text style={styles.secondaryText}>
                {numeral(low).format('0,0')}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.label}>HIGH</Text>
              <Text style={styles.secondaryText}>
                {numeral(high).format('0,0')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    symbol,
    low,
    high,
    dailyChange,
    dailyChangePerc,
    volume,
    lastPrice,
  } = state.ticker;

  return {
    symbol: toDisplayName(symbol),
    low: Number(low).toFixed(1),
    high: Number(high).toFixed(1),
    dailyChange: Math.abs(dailyChange).toFixed(2),
    dailyChangePerc: `${Math.abs(dailyChangePerc * 100).toFixed(2)}%`,
    isPriceDown: dailyChangePerc < 0,
    volume: Number(volume * lastPrice).toFixed(0),
    lastPrice: Number(lastPrice).toFixed(1),
  };
};

export default connect(mapStateToProps)(Ticker);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 85,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 20,
    backgroundColor: '#1b262d',
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 23,
  },
  label: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.75,
    marginRight: 4,
    lineHeight: 18,
  },
  secondaryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  redText: {
    color: '#aa6064',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    marginLeft: 2,
  },
  greenText: {
    color: '#7a9c4a',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    marginLeft: 2,
  },
});
