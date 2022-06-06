import { AppSignalCb, InstalledCell } from "@holochain/client";
import { AgnosticClient } from "./agnostic-client";
import { areEqual } from "./utils";

export class CellClient {
  constructor(protected client: AgnosticClient, public cell: InstalledCell) {}

  callZome(
    zomeName: string,
    fnName: string,
    payload: any,
    timeout = 15000
  ): Promise<any> {
    return this.client.callZome(
      this.cell.cell_id,
      zomeName,
      fnName,
      payload,
      timeout
    );
  }

  addSignalHandler(signalHandler: AppSignalCb): { unsubscribe: () => void } {
    const { unsubscribe } = this.client.addSignalHandler((signal) => {
      if (areEqual(signal.data.cellId, this.cell.cell_id)) {
        signalHandler(signal);
      }
    });

    return { unsubscribe };
  }
}
