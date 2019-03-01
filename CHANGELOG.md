# Radiks-Server Changelog

## 0.1.8 - March 1, 2019

- Fixes a bug where saving data wouldn't work in Firefox. This was due to Firefox not accepting a wildcard (`*`) for the `Access-Control-Allow-Headers` response header.
  - New allowed headers: `origin`, `content-type` 