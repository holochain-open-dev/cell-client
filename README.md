# Cell Client

Temporary wrapper around AppWebsocket and @holo-host/web-sdk.

This is useful to build agnostic UIs, that can potentially connect both with Holo and with Holochain infrastructure transparently.

Note that this will only be useful until there is a unified API for both cases.

## Installing

```bash
npm i "https://github.com/holochain-open-dev/cell-client#build"
```

## Connecting to Holochain

```ts
import { HolochainClient } from "@holochain-open-dev/cell-client";
import { AppWebsocket } from "@holochain/conductor-api";

async function setupHolochainClient() {
  const appWs = await AppWebsocket.connect("ws://localhost:8888");

  const appInfo = await appWs.appInfo({
    installed_app_id: "test-app",
  });
  const cellData = appInfo.cell_data[0];

  return new HolochainClient(appWs, cellData);
}
```

See all documentation for the `AppWebsocket` [here](https://github.com/holochain/holochain-conductor-api).

## Connecting to Chaperone (Holo)

```ts
import { WebSdkClient, HoloClient } from "@holochain-open-dev/cell-client";

async function setupHoloClient() {
  const client = new WebSdkClient("https://devnet-chaperone.holo.host", {
    app_name: "elemental-chess",
    skip_registration: true,
  });

  await client.connection.ready();
  await client.connection.signIn();

  const appInfo = await client.connection.appInfo("my-app-id");

  if (!appInfo.cell_data)
    throw new Error(`Holo appInfo() failed: ${JSON.stringify(appInfo)}`);

  const cellData = appInfo.cell_data[0];

  if (!(cellData.cell_id[0] instanceof Uint8Array)) {
    cellData.cell_id = [
      new Uint8Array((cellData.cell_id[0] as any).data),
      new Uint8Array((cellData.cell_id[1] as any).data),
    ] as any;
  }
  return new HoloClient(client, cellData);
}
```

See all documentation for the `WebSdkConnection` [here](https://github.com/holo-host/web-sdk).

## Usage

```ts
import { CellClient } from "@holochain-open-dev/cell-client";
import { AgentPubKeyB64 } from "@holochain-open-dev/core-types";

export class InvitationsService {
  constructor(
    public cellClient: CellClient,
    public zomeName: string = "invitations"
  ) {}

  async sendInvitation(input: AgentPubKeyB64[]): Promise<void> {
    return this.cellClient.callZome(this.zomeName, "send_invitation", input);
  }
}
```

Now you can instantiate the `InvitationsService` both with `HoloClient` and `HolochainClient`:

```ts
async function setupCellClient(holo: boolean) {
  if (holo) return setupHoloClient();
  else setupHolochainClient();
}

async function setupService() {
  const cellClient = setupCellClient(process.env.IS_HOLO_CONTEXT);
  return new InvitationService(cellClient);
}
```

## Adding signal handlers

```ts
export class InvitationsStore {
  public invitations: Dictionary<InvitationEntryInfo> = {};

  constructor(protected cellClient: CellClient) {
    cellClient
      .addSignalHandler((signal) => {
        // Do something with the signal: eg. update invitations dictionary
      })
      .then(({ unsubscribe }) => {
        this.unsubscribe = unsubscribe;
      });
  }
}
```
