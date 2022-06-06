import { AppSignalCb, CellId } from "@holochain/client";

export interface AgnosticClient {
  callZome(
    cellId: CellId,
    zomeName: string,
    fnName: string,
    payload: any,
    timeout: number
  ): Promise<any>;

  addSignalHandler(signalHandler: AppSignalCb): { unsubscribe: () => void };
}
