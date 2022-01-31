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
import { RoleId } from "@holochain/client";

async function setupClient(roleId: RoleId) {
  const installed_app_id = "test-app";
  const client: HolochainClient = await HolochainClient.connect(
    "ws://localhost:8888",
    installed_app_id
  );

  return client;
}
```

### Connecting to Chaperone (Holo)

```ts
import { HoloClient } from "@holochain-open-dev/cell-client";
import { RoleId } from "@holochain/client";

async function setupClient(roleId: RoleId) {
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

  return client;
}
```

## Usage

There are two layers that you can use:

### HolochainClient / HoloClient (both extend from BaseClient)

Use this layer if you need to be switching which cell you are making the call to. This is specially needed in apps that use the pattern of cloning cells.

```ts
const client: HolochainClient = await setupClient();

// Find the cell you want to make the call to
const cellId = client.appInfo.cell_data[0].cell_id;

const response = await client.callZome(cellId, "my-zome", "my_fn_name", {
  this: "is a sample payload",
});

client.addSignalHandler((signal) => console.log("Received signal from any of the cells", signal));
```

### CellClient

Use this layer if you only have one cell, or predefined set of cells.

```ts
const client: HolochainClient = await setupClient();

const roleId = "my-cell-role";
// Find the cell you want to make the call to
const cellData = client.cellDataByRoleId(roleId);

const cellClient = client.forCell(cellData);

// Now the calls and signals will only interact with the desired cell
const response = await client.callZome("my-zome", "my_fn_name", {
  this: "is a sample payload",
});

const { unsubscribe } = client.addSignalHandler((signal) =>
  console.log(`Received signal for cell role ${roleId}`, signal)
);

...

// You can unsubscribe from listening to the signal whenever needed
unsubscribe();
```
