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

  public gaiaURL?: string;

  constructor(db: Collection, attrs: any, gaiaURL?: string) {
    this.db = db;
    this.attrs = attrs;
    this.gaiaURL = gaiaURL;
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

  /**
   * If a username is included in the model attributes, then validate that
   * the model was created by the owner of the username. This is done by matching
   * the Gaia URL to any Gaia URL in that user's profile.json
   */
  async validateUsername(): Promise<boolean> {
    if (!(this.attrs.username && this.gaiaURL)) {
      return true;
    }
    const gaiaAddresses = await this.fetchProfileGaiaAddresses();
    const gaiaAddressParts = this.gaiaURL.split('/');
    const gaiaAddress = gaiaAddressParts[gaiaAddressParts.length - 3];
    const foundUrl = gaiaAddresses.find((address) => address === gaiaAddress);

    if (!foundUrl) {
      return errorMessage('Username does not match provided Gaia URL');
    }

    return true;
  }

  /**
   * Fetch all gaia addresses from the 'apps' object in this user's profile.json
   */
  private async fetchProfileGaiaAddresses(): Promise<string[]> {
    const uri = `https://core.blockstack.org/v1/users/${this.attrs.username}`;
    try {
      const response = await request({
        uri,
        json: true,
      });
      const user = response[this.attrs.username];
      if (user && user.profile && user.profile.apps) {
        const urls: string[] = Object.values(user.profile.apps);
        return urls.map((url) => {
          const parts = url.split('/');
          return parts[parts.length - 2];
        });
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}

export default Validator;