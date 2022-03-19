# IC-Naming JS SDK

## Installing

Using npm:

```sh
npm install @dfinity/{agent,candid,principal} # dfinity needs
npm install @ic-naming/client
```

Using yarn:

```sh
yarn add @dfinity/{agent,candid,principal} # dfinity needs
yarn add @ic-naming/client
```

<!--
Using unpkg CDN. Access through `(window or global).IcNaming.Client`:

```html
<script src="https://unpkg.com/browse/@ic-naming/client/dist/index-umd.js"></script>
``` -->

## Example

Normal:

```js
import { IcNamingClient } from "@ic-naming/client";

const client = new IcNamingClient({
  net: "MAINNET", // MAINNET | TICP
  mode: "local", // local | production
});

client.isAvailableNaming("hello.world").then((isAvailable) => {
  console.log(isAvailable ? "Available!" : "Not Available!");
});
```

Special host and identity:

```js
import { IcNamingClient } from "@ic-naming/client";

const client = new IcNamingClient({
  net: "MAINNET",
  mode: "local",
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

**Document TODO**

## Contribute

Local commands:

```sh
yarn dev # rollup library watch mode
yarn type # typescript type check
yarn test # jest unit test
yarn build # rollup build to dist/
yarn release # generate new version
```
