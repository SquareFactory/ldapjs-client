# @csquare/ldapjs-client

[![GitHub license](https://img.shields.io/github/license/csquare-ai/ldapjs-client)](https://github.com/csquare-ai/ldapjs-client/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@csquare/ldapjs-client)](https://www.npmjs.com/package/@csquare/ldapjs-client)

Promisified version of the `ldapjs` package with additional typings.

## Acknowledgments

This library heavily relies on the [ldapjs](https://github.com/ldapjs/node-ldapjs) package.
Please see http://ldapjs.org/ for the complete detailed usage.

## Installation

Install with npm:

```shell
npm install --save @csquare/ldapjs-client
```

Install with Yarn:

```shell
yarn add @csquare/ldapjs-client
```

## Usage

```typescript
import { createClient } from '@csquare/ldapjs-client';

(async () => {
  const options = {};
  const client = createClient(options);
  await client.bind(/* args */);
})();
```
