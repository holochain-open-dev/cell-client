import { AppSignalCb, InstalledCell } from "@holochain/client";
import { CellClient } from "./cell-client";
import { BaseClient } from "./base-client";
export declare class WebSdkClient extends BaseClient {
    connection: any;
    constructor(url: string, branding: any);
}
export declare class HoloClient implements CellClient {
    protected connection: WebSdkClient;
    protected cellData: InstalledCell;
    constructor(connection: WebSdkClient, cellData: InstalledCell);
    get cellId(): import("@holochain/client").CellId;
    callZome(zomeName: string, fnName: string, payload: any): Promise<any>;
    addSignalHandler(signalHandler: AppSignalCb): Promise<{
        unsubscribe: () => void;
    }>;
}
