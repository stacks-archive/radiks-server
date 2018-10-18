const EllipticCurve = require('elliptic').ec;
const crypto = require('crypto');

const ecurve = new EllipticCurve('secp256k1');

const verifyECDSA = (content, publicKey, signature) => {
  const contentBuffer = Buffer.from(content);
  const ecPublic = ecurve.keyFromPublic(publicKey, 'hex');
  const contentHash = crypto.createHash('sha256').update(contentBuffer).digest();

  return ecPublic.verify(contentHash, signature);
};

module.exports = {
  verifyECDSA,
};
