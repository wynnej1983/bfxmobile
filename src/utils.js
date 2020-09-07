const keys = Object.freeze({
  tBTCUSD: 'BTC/USD',
});

export const toDisplayName = (key) => keys[key];

export const percent = (total, maxTotal) => (100 * total) / maxTotal;
