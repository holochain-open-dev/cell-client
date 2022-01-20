import { AppWebsocket, InstalledCell } from "@holochain/client";
import { BaseClient } from "./base-client";
import { CellClient } from "./cell-client";
export declare class HolochainClient extends BaseClient implements CellClient {
    protected appWebsocket: AppWebsocket;
    protected cellData: InstalledCell;
    constructor(appWebsocket: AppWebsocket, cellData: InstalledCell);
    get cellId(): import("@holochain/client").CellId;
    callZome(zomeName: string, fnName: string, payload: any, timeout?: number): Promise<any>;
}
