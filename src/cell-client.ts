import { AppSignalCb, AppWebsocket, InstalledCell } from "@holochain/client";
import { BaseClient } from "./base-client";
import { areEqual } from "./utils";

export class CellClient {
  constructor(
    protected client: BaseClient,
    protected cellData: InstalledCell
  ) {}

  get cellId() {
    return this.cellData.cell_id;
  }

  get cellRoleId() {
    return this.cellData.role_id;
  }

  callZome(
    zomeName: string,
    fnName: string,
    payload: any,
    timeout = 15000
  ): Promise<any> {
    return this.client.callZome(
      this.cellId,
      zomeName,
      fnName,
      payload,
      timeout
    );
  }

  addSignalHandler(signalHandler: AppSignalCb): { unsubscribe: () => void } {
    const { unsubscribe } = this.client.addSignalHandler((signal) => {
      if (areEqual(signal.data.cellId, this.cellId)) {
        signalHandler(signal);
      }
    });

    return { unsubscribe };
  }
}
