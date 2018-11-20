const path = require('path');
const fs = require('fs');
const solc = require('solc');

const EthPolynomialCurvedTokenPath = path.resolve(__dirname, 'contracts', 'EthPolynomialCurvedToken.sol');
const source = fs.readFileSync(EthPolynomialCurvedTokenPath, 'utf8');

module.exports = solc.compile(source, 1).contracts[':EthPolynomialCurvedToken'];