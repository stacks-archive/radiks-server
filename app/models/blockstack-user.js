const mongoose = require('mongoose');

const { lookupProfile } = require('../lib/blockstack-api');

const schema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  address: String,
  publicKey: String,
});

schema.statics.findOrCreateByUsername = async function findOrCreateByUsername(username) {
  console.log(username);
  let user = await this.findOne({ username }).exec();
  if (!user) {
    const profile = await lookupProfile(username);
    user = await this.create({
      username,
      address: profile.owner_address,
      publicKey: profile.profile.public_key,
    });
  }
  return user;
};

const BlockstackUser = mongoose.model('BlockstackUser', schema);

module.exports = BlockstackUser;
