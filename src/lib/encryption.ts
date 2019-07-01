import elliptic from 'elliptic';
import crypto from 'crypto';

const ecurve = new elliptic.ec('secp256k1');

export const verifyECDSA = (content, publicKey, signature) => {
  const contentBuffer = Buffer.from(content);
  const ecPublic = ecurve.keyFromPublic(publicKey, 'hex');
  const contentHash = crypto.createHash('sha256').update(contentBuffer).digest();

  return ecPublic.verify(contentHash, signature);
};