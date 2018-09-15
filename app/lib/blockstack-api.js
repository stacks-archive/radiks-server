const request = require('request-promise');

const lookupProfile = async (username) => {
  const uri = `https://core.blockstack.org/v1/users/${username}`;
  return (await request({
    uri,
    json: true,
  }))[username];
};

module.exports = {
  lookupProfile,
};
