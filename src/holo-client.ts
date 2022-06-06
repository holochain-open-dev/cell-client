import {
  AppSignalCb,
  CellId,
  InstalledAppInfo,
  InstalledCell,
} from "@holochain/client";
//@ts-ignore
import WebSdkApi from "@holo-host/web-sdk/src/index";

import { AgnosticClient } from "./agnostic-client";
import { areEqual, fixHoloAppInfo } from "./utils";
import { SignalHandler } from "./signal-handler";

export type Branding = {
  app_name: string;
  logo_url?: string;
  info_link?: string;
  publisher_name?: string;
  skip_registration?: boolean;
};

export class HoloClient implements AgnosticClient {
  signalHandler = new SignalHandler();

  private constructor(
    protected connection: any,
    public appInfo: InstalledAppInfo
  ) {}

  static async connect(
    url: string,
    installed_app_id: string,
    branding: Branding
  ): Promise<HoloClient> {
    let handleSignal: AppSignalCb | undefined = undefined;

    const connection = new WebSdkApi(
      url,
      (s: any) => handleSignal && handleSignal(s),
      branding
    );
    await connection.ready();
    const appInfo: InstalledAppInfo = await connection.appInfo(
      installed_app_id
    );

    const client = new HoloClient(connection, fixHoloAppInfo(appInfo));
    handleSignal = (s) => client.signalHandler.handleSignal(s);

    return client;
  }

  async signIn() {
    await this.connection.signIn();
    await this.refetchAppInfo();
  }
  async signUp() {
    await this.connection.signUp();
    await this.refetchAppInfo();
  }
  async signOut() {
    await this.connection.signOut();
    await this.refetchAppInfo();
  }

  // Get the cell data for the given cellId
  cellData(cellId: CellId): InstalledCell | undefined {
    return this.appInfo.cell_data.find((c) => areEqual(c.cell_id, cellId));
  }

  async callZome(
    cellId: CellId,
    zomeName: string,
    fnName: string,
    payload: any
  ): Promise<any> {
    const cellData = this.cellData(cellId);

    if (!cellData)
      throw new Error(
        "There is no cell with the given CellId for the connected app"
      );

    const result = await this.connection.zomeCall(
      cellData?.role_id,
      zomeName,
      fnName,
      payload
    );

    if (result && result.type === "error") {
      throw new Error(result.payload.message);
    }
    return result;
  }

  addSignalHandler(signalHandler: AppSignalCb): { unsubscribe: () => void } {
    return this.signalHandler.addSignalHandler(signalHandler);
  }

  private async refetchAppInfo() {
    const appInfo: InstalledAppInfo = await this.connection.appInfo(
      this.appInfo.installed_app_id
    );
    this.appInfo = fixHoloAppInfo(appInfo);
  }
}
