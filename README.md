# IC-Naming JavaScript SDK

[![NPM](https://nodei.co/npm/@ic-naming/client.png?downloads=true&downloadRank=true&stars=true)][1]

## Installing

Using npm:

```sh
npm install @dfinity/{agent,candid,principal} # dfinity dependencies
npm install @ic-naming/client
```

Using yarn:

```sh
yarn add @dfinity/{agent,candid,principal} # dfinity dependencies
yarn add @ic-naming/client
```

<!--
Using unpkg CDN. Access through `(window or global).IcNaming.Client`:

```html
<script src="https://unpkg.com/browse/@ic-naming/client/dist/index-umd.js"></script>
``` -->

## Example

```js
import { Principal } from "@dfinity/principal";
import { IcNamingClient } from "@ic-naming/client";

const client = new IcNamingClient({
  net: "IC", // IC | ICP | TICP
  mode: "production", // local | production
});

// get records
client.getRecordsOfName("helloworld.ic").then((records) => {
  // get ICP address(principal)
  const principal = records.find((r) => r[0] === "principal.icp");
  console.debug(`helloworld.ic's principal is ${principal}`);

  // get ICP address(account id)
  const accountId = records.find((r) => r[0] === "account_id.icp");
  console.debug(`helloworld.ic's account id is ${accountId}`);

  // get twitter
  const twitter = records.find((r) => r[0] === "com.twitter");
  console.debug(`helloworld.ic's twitter is ${twitter}`);

  // get eth address
  const ethAdddress = records.find((r) => r[0] === "token.eth");
  console.debug(`helloworld.ic's eth adddress is ${ethAdddress}`);
});

// get name's registrant
client.getRegistrantOfName("helloworld.ic").then((registrant) => {
  console.debug(`helloworld.ic's registrant is ${registrant}`);
});

// get name's expired time
client.getExpiredTimeOfName("helloworld.ic").then((timestamp) => {
  const expiredTime = new Date(Number(timestamp));
  console.debug(`helloworld.ic's expired time is ${expiredTime}`);
});

// get reverse resolve
const thePrincipal = Principal.fromText(
  "v2xhg-um7x6-mhni4-sgqsc-qarqs-bgoyy-ngobl-qoe7c-7a4cm-bvn4f-pqe"
);

client.getReverseResolve(thePrincipal).then((name) => {
  if (name) console.debug(`reverse resolve name is ${name}`);
  else console.debug(`reverse resolve name not exist`);
});
```

Special host and identity:

```js
import { IcNamingClient } from "@ic-naming/client";

const client = new IcNamingClient({
  net: "IC",
  mode: "production", // local | production
  httpAgent: {
    host: "https://ic0.app", // default by mode
    identity: {
      identity: {
        transformRequest: () => {
          /* ... */
        },
        getPrincipal: () => {
          /* ... */
        },
      },
    },
  },
});
```

### More example in repo

- [React App](./examples/react-app/) - A "React App" for search naming

## Client API

[client.ts](./src/client.ts)

https://IC-Naming.github.io/js-sdk/

## Contribute

Local commands:

```sh
yarn dev # rollup library watch mode
yarn type # typescript type check
yarn test # jest unit test
yarn build # rollup build to dist/
yarn release # generate new version
```

## Release

```shell
git tag vX.Y.Z HEAD  # Create a tag started with "v" to trigger CI/CD pipeline

git push origin main --tags
```

[1]: https://nodei.co/npm/@ic-naming/client/
