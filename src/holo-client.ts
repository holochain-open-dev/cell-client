import { AppSignalCb, CellId, InstalledAppInfo } from "@holochain/client";
import WebSdk from "@holo-host/web-sdk";
const WebSdkConnection = WebSdk.Connection;

import { BaseClient } from "./base-client";
import { fixHoloAppInfo } from "./utils";

export type Branding = {
  app_name: string;
  logo_url?: string;
  info_link?: string;
  publisher_name?: string;
  skip_registration?: boolean;
};

export class HoloClient extends BaseClient {
  private constructor(
    protected connection: any,
    public appInfo: InstalledAppInfo
  ) {
    super();
  }

  static async connect(
    url: string,
    installed_app_id: string,
    branding: Branding
  ): Promise<HoloClient> {
    let handleSignal: AppSignalCb | undefined = undefined;

    const connection = new WebSdkConnection(
      url,
      (s: any) => handleSignal && handleSignal(s),
      branding
    );
    await connection.ready();
    const appInfo: InstalledAppInfo = await connection.appInfo(
      installed_app_id
    );

    const client = new HoloClient(connection, fixHoloAppInfo(appInfo));
    handleSignal = (s) => client.handleSignal(s);

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

  private async refetchAppInfo() {
    const appInfo: InstalledAppInfo = await this.connection.appInfo(
      this.appInfo.installed_app_id
    );
    this.appInfo = appInfo;
  }
}
