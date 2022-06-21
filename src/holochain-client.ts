import {
  AppSignalCb,
  AppWebsocket,
  CellId,
} from "@holochain/client";
import { WsClient } from "@holochain/client/lib/websocket/client";
import { AgnosticClient } from "./agnostic-client";
import { SignalHandler } from "./signal-handler";

export class HolochainClient implements AgnosticClient {
  signalHandler = new SignalHandler();

  constructor(public appWebsocket: AppWebsocket) {
    appWebsocket.client = new WsClient(
      appWebsocket.client.socket,
      s => this.signalHandler.handleSignal(s)
    );
  }

  callZome(
    cellId: CellId,
    zomeName: string,
    fnName: string,
    payload: any,
    timeout = 15000
  ): Promise<any> {
    return this.appWebsocket.callZome(
      {
        cap_secret: null,
        cell_id: cellId,
        zome_name: zomeName,
        fn_name: fnName,
        payload: payload,
        provenance: cellId[1],
      },
      timeout
    );
  }

  addSignalHandler(signalHandler: AppSignalCb): { unsubscribe: () => void } {
    return this.signalHandler.addSignalHandler(signalHandler);
  }
}
