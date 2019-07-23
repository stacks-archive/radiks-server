# Radiks-Server Changelog

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