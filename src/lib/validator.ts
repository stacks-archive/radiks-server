import { Collection } from 'mongodb';
import { verifyECDSA } from 'blockstack/lib/encryption';
import request from 'request-promise';

const errorMessage = (message: string) => {
  throw new Error(`Error when validating: ${message}`);
};

class Validator {
  public db: Collection;

  public attrs: any;

  public previous: any;

  public gaiaUrl?: string;

  constructor(db: Collection, attrs: any, gaiaUrl?: string) {
    this.db = db;
    this.attrs = attrs;
    this.gaiaUrl = gaiaUrl;
  }

  async validate() {
    this.validatePresent('_id');
    await this.fetchPrevious();
    await this.validateSignature();
    await this.validatePrevious();
    await this.validateUsername();
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

  validatePresent(key: string) {
    if (!this.attrs[key]) {
      errorMessage(`No '${key}' attribute, which is required.`);
    }
  }

  async validateUsername(): Promise<boolean> {
    if (!(this.attrs.username && this.gaiaUrl)) {
      return true;
    }
    const gaiaUrls = await this.fetchProfileAppsGaiaUrls();
    const gaiaPrefix = this.attrs.gaiaUrl.match(/(.*)\/[\d|[a-z]|-]*^/)[1];
    const foundUrl = gaiaUrls.find((url) => url.startsWith(gaiaPrefix));

    if (!foundUrl) {
      return errorMessage('Username does not match provided Gaia URL');
    }

    return true;
  }

  /**
   * Fetch all gaia URLs from the 'apps' object in this user's profile.json
   */
  private async fetchProfileAppsGaiaUrls(): Promise<string[]> {
    const uri = `https://core.blockstack.org/v1/users/${this.attrs.username}`;
    try {
      const response = await request({
        uri,
        json: true,
      });
      const user = response[this.attrs.username];
      if (user && user.profile && user.profile.apps) {
        return Object.values(user.profile.apps);
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}

export default Validator;