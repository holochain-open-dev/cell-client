import { CellClient } from "./cell-client";
import { InstalledCell } from "@holochain/conductor-api";
import { BaseClient } from "./base-client";
export declare class HoloClient extends BaseClient implements CellClient {
    protected connection: any;
    protected cellData: InstalledCell;
    protected branding: any;
    constructor(connection: any, cellData: InstalledCell, branding: any);
    get cellId(): import("@holochain/conductor-api").CellId;
    callZome(zomeName: string, fnName: string, payload: any): Promise<any>;
}
