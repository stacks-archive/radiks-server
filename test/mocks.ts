import faker from 'faker';
import getDB from './db';
import constants from '../src/lib/constants';

const userGroupId = faker.random.uuid();

const withUsernameId = faker.random.uuid();

const models = {
  test1: {
    name: faker.name.findName(),
    email: faker.internet.email(),
    info: faker.helpers.createCard(),
    _id: faker.random.uuid(),
  },
  hank: {
    name: 'hank stoever',
    age: 120,
    _id: faker.random.uuid(),
  },
  myla: {
    name: 'Myla',
    age: 4.5,
    _id: faker.random.uuid(),
  },
  notUpdatable: {
    updatable: false,
    _id: faker.random.uuid(),
  },
  userGroup: {
    radiksType: 'UserGroup',
    _id: userGroupId,
  },
  withGroup: {
    _id: faker.random.uuid(),
    userGroupId,
  },
  user: {
    username: 'hankstoever.id',
    signingKeyId: 'personal',
    _id: faker.random.uuid(),
  },
  withUsername: {
    username: 'hankstoever.id',
    gaiaURL: `https://gaia.blockstack.org/hub/1Me8MbfjnNEeK5MWGokVM6BLy9UbBf7kTD/${withUsernameId}`,
    _id: withUsernameId,
  },
};

const users = {
  'https://core.blockstack.org/v1/users/hankstoever.id': {
    'hankstoever.id': {
      owner_address: '1G8XTwZkUzu7DJYDW4oA4JX5shnW8LcpC2',
      profile: {
        '@context': 'http://schema.org',
        '@type': 'Person',
        account: [
          {
            '@type': 'Account',
            identifier: 'hstove',
            placeholder: false,
            proofType: 'http',
            proofUrl:
              'https://gist.github.com/hstove/40d3d545fb1d58abfc674f1c2dd581bd',
            service: 'github',
          },
          {
            '@type': 'Account',
            identifier: 'heynky',
            placeholder: false,
            proofType: 'http',
            proofUrl: '',
            service: 'twitter',
          },
        ],
        api: {
          gaiaHubConfig: {
            url_prefix: 'https://gaia.blockstack.org/hub/',
          },
          gaiaHubUrl: 'https://hub.blockstack.org',
        },
        apps: {
          'http://127.0.0.1:3001':
            'https://gaia.blockstack.org/hub/1Me8MbfjnNEeK5MWGokVM6BLy9UbBf7kTD/',
          'http://humans.name':
            'https://gaia.blockstack.org/hub/1JcRkU1ooEJNBedGYortWGEuxnHuMZeax4/',
          'http://localhost:3000':
            'https://gaia.blockstack.org/hub/1Huuk9uNiyFVLcn25GVtD56oSr5JxSFNdU/',
          'http://localhost:5000':
            'https://gaia.blockstack.org/hub/18oiXHGHKiWVwCu3JxsED93ok8WMQcQYCu/',
          'http://localhost:8081':
            'https://gaia.blockstack.org/hub/1GW81UvfDKuqVJ99YsGkf8C58owtV7yUor/',
          'https://agaze.co':
            'https://gaia.blockstack.org/hub/19jniGm81USE11JMiCervUE3tQ7N1z1V5j/',
          'https://airtext.xyz':
            'https://gaia.blockstack.org/hub/145EKYwMCRQbcfrTtpwW7SXiwPwdUHxywq/',
          'https://animalkingdoms.netlify.com':
            'https://gaia.blockstack.org/hub/1EYVG8SdPdCodC3b2FLqG9wDs1YW5rQqSp/',
          'https://app.blockcred.io':
            'https://gaia.blockstack.org/hub/19J2pAqWCkxbV7Z8Y3cuRhq5a9xvHfhgNV/',
          'https://app.dmail.online':
            'https://gaia.blockstack.org/hub/1KaLFVAcv9euTvxCYLa7JvSPYaG61zXYZQ/',
          'https://app.forms.id':
            'https://gaia.blockstack.org/hub/1MKBDXzDoQ7Pu9foF7y8d96bzPPJnsoFGE/',
          'https://app.graphitedocs.com':
            'https://gaia.blockstack.org/hub/13hwRRNRXiWRvqkX4XHN8D4GPpWmWo8hGU/',
          'https://app.sigle.io':
            'https://gaia.blockstack.org/hub/16TTzjWyq8vpHwMum1DygWLagsCYyJHv2r/',
          'https://ares.hankstoever.com':
            'https://gaia.blockstack.org/hub/15aM5eEngkGbuoXRN7ih2GS6gMDjV5RHrB/',
          'https://banter-radiks-pr-17.herokuapp.com':
            'https://gaia.blockstack.org/hub/189LnpxeS6vbB2dzmWQwo9Sr55qvRwPFf1/',
          'https://banter-radiks-staging-pr-19.herokuapp.com':
            'https://gaia.blockstack.org/hub/1FU9oWG7N9ZT9xvQ7okrgkm6LxgHdjA7qz/',
          'https://banter-radiks-staging-pr-24.herokuapp.com':
            'https://gaia.blockstack.org/hub/19NXLtyRZyZP7vQQQoWn4AjQPbSopDf8As/',
          'https://banter-radiks-staging-pr-26.herokuapp.com':
            'https://gaia.blockstack.org/hub/12K8Hyd8PDDFkKCL86fioegkPijSfhobtU/',
          'https://banter-radiks-staging-pr-60.herokuapp.com':
            'https://gaia.blockstack.org/hub/1L3qP6JNwPmh3J85emWi5h8KsFwRh95WJL/',
          'https://banter-radiks.herokuapp.com':
            'https://gaia.blockstack.org/hub/1Q2xDDaD9CpxEj1TeFEqBrvuj8XYdrJYyQ/',
          'https://banter.pub':
            'https://gaia.blockstack.org/hub/1GPmRPpP4fiJazMgTg3dreDyhiHw6jRui5/',
          'https://beta.springrole.com':
            'https://gaia.blockstack.org/hub/1DE8mb8JjdDjrz6MF6ZpXRyf2HYtouegHp/',
          'https://bitcamp.blockboardapp.com':
            'https://gaia.blockstack.org/hub/1ARNRM3a3W82ix1iaHymcvR6XMJUXn24nC/',
          'https://bitpatron.co':
            'https://gaia.blockstack.org/hub/17EdDKivpgek4DxuVAgEWMKd15NfjkNWss/',
          'https://cafe-society.news':
            'https://gaia.blockstack.org/hub/16iWBLeQtWg1TXKA1yssBEvvmGmj5hRGS5/',
          'https://dapp.cryptocracy.io':
            'https://gaia.blockstack.org/hub/155fBgqn8mvaxRh7A8tvVU9jQLnQWEUmhu/',
          'https://debutapp.social':
            'https://gaia.blockstack.org/hub/1NDADqQaVJwT2b2HBm9mS3DC5mcbopZqxW/',
          'https://festive-bhabha-7e881b.netlify.com':
            'https://gaia.blockstack.org/hub/1D3FxNQhncNtmerP9uA3Kb4m4wvBzhdSjh/',
          'https://focused-rosalind-344827.netlify.com':
            'https://gaia.blockstack.org/hub/1EUWQGrBsq6pRg8JgEfWG2ank1fcm8DCDZ/',
          'https://foodrover.info':
            'https://gaia.blockstack.org/hub/1G52nxyPRDhJD8fDGMDYobHKU8Z7jLvnVV/',
          'https://hardcore-mcclintock-a6dc09.netlify.com':
            'https://gaia.blockstack.org/hub/1N2USmXSvkE3ujrBD8YUX2xsQAuN7gbJWf/',
          'https://hungry-wilson-249b01.netlify.com':
            'https://gaia.blockstack.org/hub/1Px9k2rVbpCWKgkuxr4Edxq3PjVCGfmNkX/',
          'https://justsnake.live':
            'https://gaia.blockstack.org/hub/1AZBhQ6P1tNugUdz4ivujSmaofK2SRAcVJ/',
          'https://kanstack.herokuapp.com':
            'https://gaia.blockstack.org/hub/1C4ruBsUxbZd72sPUn73BJSLsfSQwgChMh/',
          'https://lettermesh.com':
            'https://gaia.blockstack.org/hub/14Z9niGmdTnSDeL54mBVuXsaDmkzvRvyxK/',
          'https://musing-mcclintock-2e6e1a.netlify.com':
            'https://gaia.blockstack.org/hub/14pCC5W7A6G6gmcg2cTDf8Sd69cKDjv32k/',
          'https://pgeon.com':
            'https://gaia.blockstack.org/hub/14Gz68LLQcC4C8pwfZx1h6SerAL7gUhYKF/',
          'https://pressure.carolkng.com':
            'https://gaia.blockstack.org/hub/1FGrc6ZrNzfa8J2PvDE17s372gDrd9f3Gm/',
          'https://remark.cryptocracy.io':
            'https://gaia.blockstack.org/hub/14M4dLuVEbP1RssyimtP5bc3TWgixkVNBW/',
          'https://staging--objective-wiles-65a1ef.netlify.com':
            'https://gaia.blockstack.org/hub/1KBkWtMNhDnfsQ1N2Y5jaSWeJXBD3mM25d/',
          'https://staging.banter.pub':
            'https://gaia.blockstack.org/hub/15pUGtq7x7s12brbJ1GwCvNTdhUgpnEkUz/',
          'https://testnet.dmail.online':
            'https://gaia.blockstack.org/hub/1GSu4ainHjMRRGhvjGYcMw6NbHGCEvBwAq/',
          'https://www.chat.hihermes.co':
            'https://gaia.blockstack.org/hub/1DiqxTBwCrU2LDBKteaUcG2L88hYdoXuA8/',
          'https://www.justsnake.live':
            'https://gaia.blockstack.org/hub/1FuLK4cxv63pfkhxc9Sv8AMDLWCzG2jN2Z/',
          'https://www.myblockspace.com':
            'https://gaia.blockstack.org/hub/16HRkNBUaCxTj2P5foK2TAnPM1aEFXfD57/',
          'https://www.web.stealthy.im':
            'https://gaia.blockstack.org/hub/1FegzjDY9fRoQeYW6gedAFVQpgD8i6ZP6P/',
          'https://xordrive.io':
            'https://gaia.blockstack.org/hub/15MZUgQg3wqm4g3yWbft2JHL98wjrJJiHa/',
        },
        description: 'Developer at Blockstack',
        image: [
          {
            '@type': 'ImageObject',
            contentUrl:
              'https://gaia.blockstack.org/hub/1G8XTwZkUzu7DJYDW4oA4JX5shnW8LcpC2//avatar-0',
            name: 'avatar',
          },
        ],
        name: 'Hank Stoever',
      },
      public_key:
        '02dbe23b383136fad995327d5274f9d168a7edbbd5f89b92afa2abc86ee40e0fba',
      verifications: [
        {
          identifier: 'hstove',
          proof_url:
            'https://gist.github.com/hstove/40d3d545fb1d58abfc674f1c2dd581bd',
          service: 'github',
          valid: true,
        },
        {
          identifier: 'heynky',
          proof_url: '',
          service: 'twitter',
          valid: false,
        },
      ],
      zone_file: {
        $origin: 'hankstoever.id',
        $ttl: 3600,
        uri: [
          {
            name: '_http._tcp',
            priority: 10,
            target:
              'https://gaia.blockstack.org/hub/1G8XTwZkUzu7DJYDW4oA4JX5shnW8LcpC2/profile.json',
            weight: 1,
          },
        ],
      },
    },
  },
};

const saveAll = async () => {
  const db = await getDB();
  const data = Object.values(models);
  await db.collection(constants.COLLECTION).insertMany(data);
};

export { models, saveAll, users };
