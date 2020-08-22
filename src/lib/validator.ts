import { Collection } from 'mongodb';
import { verifyECDSA } from 'blockstack/lib/encryption';

const errorMessage = (message: string) => {
  throw new Error(`Error when validating: ${message}`);
};

class Validator {
  db: Collection;

  attrs: any

  previous: any;

  constructor(db: Collection, attrs: any) {
    this.db = db;
    this.attrs = attrs;
  }

  async validate() {
    this.validatePresent('_id');
    await this.fetchPrevious();
    await this.validateSignature();
    await this.validatePrevious();
    await this.validateUpdatedAt();
    return true;
  }

  async fetchPrevious() {
    const { _id } = this.attrs;
    this.previous = await this.db.findOne({ _id });
  }

  async validateSignature() {
    const { signingKeyId } = this.attrs.userGroupId ? this.attrs : this.previous || this.attrs;
    const {
      radiksSignature, updatable, updatedAt, _id,
    } = this.attrs;
    if (updatable === false) {
      return true;
    }
    this.validatePresent('radiksSignature');
    this.validatePresent('signingKeyId');
    this.validatePresent('updatedAt');
    await this.signingKeyMatchesGroup();
    let signingKey;
    if (signingKeyId === 'personal') {
      const { publicKey } = this.previous || this.attrs;
      signingKey = {
        publicKey,
      };
    } else {
      signingKey = await this.db.findOne({ _id: signingKeyId });
      if (!signingKey) {
        errorMessage(`No signing key is present with id: '${signingKeyId}'`);
      }
    }
    const { publicKey } = signingKey;
    const message = `${_id}-${updatedAt}`;
    const isValidSignature = verifyECDSA(message, publicKey, radiksSignature);
    if (!isValidSignature) {
      errorMessage('Invalid radiksSignature provided');
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

  validateUpdatedAt() {
    if (!this.previous) {
      return true;
    }
    if (typeof this.previous.updatedAt !== "number") {
      errorMessage("This model's previous `updatedAt` is not a number");
    }
    if (typeof this.attrs.updatedAt !== "number") {
      errorMessage("This model's `updatedAt` is not a number");
    }
    if (this.attrs.updatedAt <= this.previous.updatedAt) {
      errorMessage("Model's `updatedAt` has not been increased");
    }
    return true;
  }

  validatePresent(key: string) {
    if (!this.attrs[key]) {
      errorMessage(`No '${key}' attribute, which is required.`);
    }
  }
}

export default Validator;