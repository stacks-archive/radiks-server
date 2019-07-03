import { Collection } from 'mongodb';
import { verifyECDSA } from 'blockstack/lib/encryption';
import { verifyAuthResponse } from 'blockstack/lib/auth/authVerification';

const errorMessage = (message: string) => {
  throw new Error(`Error when validating: ${message}`);
};

class Validator {
  private db: Collection;

  private attrs: any;

  private previous: any;

  constructor(db: Collection, attrs: any) {
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
      radiksSignature, updatable, updatedAt, _id,
    } = this.attrs;
    if (updatable === false) {
      return true;
    }

    this.validatePresent('radiksSignature');
    this.validatePresent('updatedAt');

    let publicKey: string;
    if (this.attrs.signingKeyId) {
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
      publicKey = signingKey.publicKey
    } else {
      this.validatePresent('username');
      const radiksUser = await this.db.findOne({ _id: this.attrs.username });
      if (!radiksUser) {
        errorMessage(`No user is present with username: '${this.attrs.username}'`);
      }
      if (!radiksUser.authResponseToken) {
        errorMessage(`No authResponseToken found for user: '${this.attrs.username}'`);
      }
      const nameLookupURL = 'https://core.blockstack.org/v1/names/';
      if (!(await verifyAuthResponse(radiksUser.authResponseToken, nameLookupURL))) {
        errorMessage(`Invalid auth response for user: '${this.attrs.username}'`);
      }
      publicKey = radiksUser.publicKey;
    }
    
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

  validatePresent(key: string) {
    if (!this.attrs[key]) {
      errorMessage(`No '${key}' attribute, which is required.`);
    }
  }
}

export default Validator;