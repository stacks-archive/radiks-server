# Radiks-Server Changelog

## 1.1.0-beta.3 - July 30, 2019

- Fixed an issue with validating usernames

## 0.2.0 - July 26th, 2019

- All code from the `v1.0.0` betas has been made backwards compatible, so we're publishing these changes as `v0.2.0`.
- Port to Typescript (Thanks [@pradel](https://github.com/pradel))
- Automatically reconnect to MongoDB if the connection was closed
- Fixed a bug around validating models before saving them

## 1.0.0-beta.3 - July 26th, 2019

- Fix from @pradel around validating models before saving them. [#20](https://github.com/blockstack-radiks/radiks-server/pull/20)

## 1.1.0-beta.1 - July 23, 2019

- Adds server validation if `username` is included in the model, to validate ownership of that username. See [#19](https://github.com/blockstack-radiks/radiks-server/pull/19)

## 1.0.0-beta.3 - July 22nd, 2019

- Adds configuration to automatically try reconnecting to MongoDB if the connection was destroyed

## 1.0.0-beta.2 - July 22nd, 2019

- Updated `radiks-server` bin file to use correct path, which was broken during the TypeScript merge

## 1.0.0-beta.1 - July 1st, 2019

- Ported existing codebase to Typescript. Thanks to [@pradel](https://github.com/blockstack-radiks/radiks-server/pull/14)!

## 0.1.13 - June 22, 2019

- Fixed CORS error blocking DELETE requests

## 0.1.12 - June 9th, 2019

- Added route to return count of models for a certain query, thanks to @pradel [#9]
- Update blockstack.js to v19.2.1

## 0.1.11 - April 5, 2019

- Fixed an issue caused when fixing eslint errors from the [maxLimit PR](https://github.com/blockstack-radiks/radiks-server/pull/5)

## 0.1.10 - April 1, 2019

- Support for adding a `maxLimit` configuration to radiks, so that you can limit the maximum number of records that can be fetched from the API. Thanks to @pradel for [their contribution!](https://github.com/blockstack-radiks/radiks-server/pull/5)

## 0.1.9 - March 25, 2019

- Added support for deleting models

## 0.1.8 - March 1, 2019

- Fixes a bug where saving data wouldn't work in Firefox. This was due to Firefox not accepting a wildcard (`*`) for the `Access-Control-Allow-Headers` response header.
  - New allowed headers: `origin`, `content-type`
