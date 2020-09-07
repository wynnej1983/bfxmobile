import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import numeral from 'numeral';
import { connect } from 'react-redux';
import { percent } from '../../utils';

class Trades extends Component {
  renderListHeader = () => {
    return (
      <View style={styles.row}>
        <Text style={styles.columnHeaderText}>TIME</Text>
        <Text style={styles.columnHeaderText}>PRICE</Text>
        <Text style={styles.columnHeaderText}>AMOUNT</Text>
      </View>
    );
  };

  renderListItem = ({ item: { time, price, amount } }) => {
    const { trades } = this.props;
    const maxAmount = Math.max(
      ...trades.map((trade) => Math.abs(trade.amount))
    );
    const opacity = percent(Math.abs(amount), maxAmount) / 100;
    return (
      <View style={styles.row}>
        <View
          style={[
            styles.bar,
            {
              backgroundColor:
                amount < 0 ? 'rgba(90,49,54,1)' : 'rgba(1,157,110,1)',
              opacity: isNaN(opacity) ? 0 : opacity,
            },
          ]}
        />
        <Text style={styles.valueText}>{time}</Text>
        <Text style={styles.valueText}>{numeral(price).format('0,0.0')}</Text>
        <Text style={styles.valueText}>
          {numeral(Math.abs(amount)).format('0,0.0000')}
        </Text>
      </View>
    );
  };

  render() {
    const { trades } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>TRADES</Text>
          <Text style={styles.marketText}>Market</Text>
        </View>
        <View style={styles.content}>
          <FlatList
            style={{ maxHeight: 500 }}
            data={trades}
            keyExtractor={(item, index) => index}
            ListHeaderComponent={this.renderListHeader}
            renderItem={this.renderListItem}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    trades: state.trades,
  };
};

export default connect(mapStateToProps)(Trades);

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#1b262d',
  },
  content: {
    width: '100%',
    flexDirection: 'row',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(256,256,256,0.3)',
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  marketText: {
    color: '#fff',
    fontSize: 14,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bar: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  columnHeaderText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.75,
    marginHorizontal: 20,
  },
  valueText: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    marginHorizontal: 20,
  },
});
