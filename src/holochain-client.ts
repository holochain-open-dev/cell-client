import {
  AppSignalCb,
  AppWebsocket,
  CellId,
  InstalledAppInfo,
  InstalledCell,
  RoleId,
} from "@holochain/client";
import { BaseClient } from "./base-client";
import { CellClient } from "./cell-client";

export class HolochainClient extends BaseClient {
  private constructor(
    protected appWebsocket: AppWebsocket,
    public appInfo: InstalledAppInfo
  ) {
    super();
  }

  static async connect(
    url: string,
    installed_app_id: string,
    timeout: number = 15000
  ): Promise<HolochainClient> {
    let handleSignal: AppSignalCb | undefined = undefined;
    const appWs = await AppWebsocket.connect(
      url,
      timeout,
      (s) => handleSignal && handleSignal(s)
    );

    const appInfo = await appWs.appInfo({ installed_app_id });

    const client = new HolochainClient(appWs, appInfo);

    handleSignal = (s) => client.handleSignal(s);

    return client;
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

}
