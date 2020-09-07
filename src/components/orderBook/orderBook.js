import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import numeral from 'numeral';
import { percent } from '../../utils';
import { incrementBookPrec, decrementBookPrec } from '../../actions';

class OrderBook extends Component {
  renderBidListHeader = () => {
    return (
      <View style={styles.row}>
        <Text style={styles.columnHeaderText}>TOTAL</Text>
        <Text style={styles.columnHeaderText}>PRICE</Text>
      </View>
    );
  };

  renderBidListItem = ({ item: { count, amount, price, total } }) => {
    const { bids } = this.props;
    const maxBidTotal = Math.max(...bids.map((bid) => bid.total));
    return (
      <View style={styles.row}>
        <View
          style={[
            styles.bidBar,
            {
              width: `${percent(total, maxBidTotal)}%`,
            },
          ]}
        />
        <Text style={styles.valueText}>{numeral(total).format('0,0.00')}</Text>
        <Text style={styles.valueText}>{numeral(price).format('0,0')}</Text>
      </View>
    );
  };

  renderAskListHeader = () => {
    return (
      <View style={styles.row}>
        <Text style={styles.columnHeaderText}>PRICE</Text>
        <Text style={styles.columnHeaderText}>TOTAL</Text>
      </View>
    );
  };

  renderAskListItem = ({ item: { count, amount, price, total } }) => {
    const { asks } = this.props;
    const maxAskTotal = Math.max(...asks.map((ask) => Math.abs(ask.total)));
    return (
      <View style={styles.row}>
        <View
          style={[
            styles.askBar,
            {
              width: `${percent(Math.abs(total), maxAskTotal)}%`,
            },
          ]}
        />
        <Text style={styles.valueText}>{numeral(price).format('0,0')}</Text>
        <Text style={styles.valueText}>
          {numeral(Math.abs(total)).format('0,0.00')}
        </Text>
      </View>
    );
  };

  render() {
    const {
      bids,
      asks,
      prec,
      decrementBookPrec,
      incrementBookPrec,
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>TRADING BOOK</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.headerText}>{prec}</Text>
            <TouchableOpacity
              onPress={decrementBookPrec}
              disabled={prec === 'P0'}
            >
              <Text
                style={[styles.button, { opacity: prec === 'P0' ? 0.5 : 1 }]}
              >
                -
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={incrementBookPrec}
              disabled={prec === 'P4'}
            >
              <Text
                style={[styles.button, { opacity: prec === 'P4' ? 0.5 : 1 }]}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.content}>
          <FlatList
            data={bids}
            keyExtractor={(item, index) => item.price}
            scrollEnabled={false}
            ListHeaderComponent={this.renderBidListHeader}
            renderItem={this.renderBidListItem}
          />
          <FlatList
            data={asks}
            keyExtractor={(item, index) => item.price}
            scrollEnabled={false}
            ListHeaderComponent={this.renderAskListHeader}
            renderItem={this.renderAskListItem}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ orderBook }) => {
  return {
    prec: orderBook.prec,
    bids: orderBook.bids,
    asks: orderBook.asks,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    incrementBookPrec: () => dispatch(incrementBookPrec()),
    decrementBookPrec: () => dispatch(decrementBookPrec()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderBook);

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
  button: {
    color: '#fff',
    fontSize: 23,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bidBar: {
    backgroundColor: '#1f4335',
    position: 'absolute',
    right: 0,
    height: '100%',
  },
  askBar: {
    backgroundColor: '#483136',
    position: 'absolute',
    left: 0,
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
