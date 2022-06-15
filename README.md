# Cell Client

Temporary wrapper around `@holochain/client` and `@holo-host/web-sdk`.

This is useful to build agnostic UIs, that can potentially connect both with Holo and with Holochain infrastructure transparently.

Note that this will only be useful until there is a unified API for both cases.

## Installing

```bash
npm i @holochain-open-dev/cell-client
```

## Setup

### Connecting to Holochain

```ts
import { HolochainClient } from "@holochain-open-dev/cell-client";
import { RoleId, AppWebsocket } from "@holochain/client";

async function setupClient() {
  const appWebsocket = await AppWebsocket.connect(
    "ws://localhost:8888"
  );

  const client = new HolochainClient(appWebsocket);

  return client;
}
```

### Connecting to Chaperone (Holo)

```ts
import { HoloClient } from "@holochain-open-dev/cell-client";
import { RoleId } from "@holochain/client";

async function setupClient() {
  const installed_app_id = "test-app";
  const branding: Branding = {
    app_name: "My cool app",
  };
  const client: HoloClient = await HoloClient.connect(
    "https://devnet-chaperone.holo.host",
    installed_app_id,
    branding
  );

  // Most likely you want to sign in at application startup
  await client.signIn();

  const connection = client.connection;

  // Here you can use the WebSdk API, like:
  connection.on('agent-state', state => console.log(state));

  return client;
}
```

## Usage

There are two layers that you can use:

### HolochainClient / HoloClient (both implement the AgnosticClient interface)

Use this layer if you need to be switching which cell you are making the call to. This is specially needed in apps that use the pattern of cloning cells.

```ts
const client: HolochainClient = await setupClient();

const appInfo = await client.appWebsocket.appInfo({
  installed_app_id: 'test-app'
});

// Find the cell you want to make the call to
const cellId = appInfo.cell_data[0].cell_id;

const response = await client.callZome(cellId, "my-zome", "my_fn_name", {
  this: "is a sample payload",
});

const { unsubscribe } = client.addSignalHandler((signal) =>
  console.log("Received signal from any of the cells", signal)
);

...

// You can unsubscribe from listening to the signal whenever needed
unsubscribe();
```

Here, use `AgnosticClient` instead of `HolochainClient` or `HoloClient` if you want your calls to be Holo/Holochain agnostic.

### CellClient

Use this layer if you only have one cell, or predefined set of cells.

```ts
const client: HolochainClient = await setupClient();

const appInfo = await client.appWebsocket.appInfo({
  installed_app_id: 'test-app'
});

// Find the cell you want to make the call to
const cell = appInfo.cell_data[0];

const cellClient = new CellClient(client, cell);

// Now the calls and signals will only interact with the desired cell
const response = await cellClient.callZome("my-zome", "my_fn_name", {
  this: "is a sample payload",
});

const { unsubscribe } = client.addSignalHandler((signal) =>
  console.log(`Received signal for cell`, cell, signal)
);

...

// You can unsubscribe from listening to the signal whenever needed
unsubscribe();
```
