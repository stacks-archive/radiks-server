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
    await this.fetchPrevious();
    await this.validateSignature();
    await this.validatePrevious();
    return true;
  }

  async fetchPrevious() {
    const { _id } = this.attrs;
    this.previous = await this.db.findOne({ _id });
  }

  async validateSignature() {
    const { signingKeyId } = this.attrs.userGroupId ? this.attrs : this.previous || this.attrs;
    const {
      signature, updatable, updatedAt, _id,
    } = this.attrs;
    if (updatable === false) {
      return true;
    }
    this.validatePresent('signature');
    this.validatePresent('signingKeyId');
    this.validatePresent('updatedAt');
    await this.signingKeyMatchesGroup(signingKeyId);
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

  async signingKeyMatchesGroup() {
    if (this.attrs.userGroupId) {
      const userGroup = await this.db.findOne({ _id: this.attrs.userGroupId });
      if (userGroup && userGroup.signingKeyId !== this.attrs.signingKeyId) {
        errorMessage('Signing key does not match UserGroup signing key');
      }
    }
    return true;
  }

  async validatePrevious() {
    if (this.previous && (this.attrs.updatable === false)) {
      errorMessage('Tried to update a non-updatable model');
    }
  }

  validatePresent(key) {
    if (!this.attrs[key]) {
      errorMessage(`No '${key}' attribute, which is required.`);
    }
  }
}

module.exports = Validator;
