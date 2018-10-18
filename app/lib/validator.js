const { verifyECDSA } = require('blockstack/lib/encryption');

const errorMessage = (message) => {
  throw new Error(`Error when validating: ${message}`);
};

class Validator {
  constructor(db, attrs) {
    this.db = db;
    this.attrs = attrs;
  }

  async validate() {
    this.validatePresent('_id');
    await this.validateSignature();
    await this.fetchPrevious();
    await this.validatePrevious();
    return true;
  }

  async fetchPrevious() {
    const { _id } = this.attrs;
    this.previous = await this.db.findOne({ _id });
  }

  async validateSignature() {
    const {
      signature, signingKeyId, updatable, updatedAt, _id,
    } = this.attrs;
    if (updatable === false) {
      return true;
    }
    this.validatePresent('signature');
    this.validatePresent('signingKeyId');
    this.validatePresent('updatedAt');
    const signingKey = await this.db.findOne({ _id: signingKeyId });
    if (!signingKey) {
      errorMessage(`No signing key is present with id: '${signingKeyId}'`);
    }
    const { publicKey } = signingKey;
    const message = `${_id}-${updatedAt}`;
    const isValidSignature = verifyECDSA(message, publicKey, signature);
    if (!isValidSignature) {
      errorMessage('Invalid signature provided');
    }
    return true;
  }

  async validatePrevious() {
    if (this.previous && this.attrs.updatable) {
      throw new Error('Tried to update a non-updatable model');
    }
  }

  validatePresent(key) {
    if (!this.attrs[key]) {
      errorMessage(`No '${key}' attribute, which is required.`);
    }
  }

  errorMessage(message) {
    throw new Error(`Error when validating: ${message}`);
  }
}

module.exports = Validator;
