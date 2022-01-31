import {
  CellId,
  InstalledAppInfo,
  InstalledCell,
  RoleId,
} from "@holochain/client";
import { CellClient } from "./cell-client";
import { SignalHandler } from "./signal-handler";
import { areEqual } from "./utils";

export abstract class BaseClient extends SignalHandler {
  abstract appInfo: InstalledAppInfo;

  abstract callZome(
    cellId: CellId,
    zomeName: string,
    fnName: string,
    payload: any,
    timeout: number
  ): Promise<any>;

  // Get the cell data for the given cellId
  cellData(cellId: CellId): InstalledCell | undefined {
    return this.appInfo.cell_data.find((c) => areEqual(c.cell_id, cellId));
  }

  // Get the cell data for the given cellId
  cellDataByRoleId(roleId: RoleId): InstalledCell | undefined {
    return this.appInfo.cell_data.find((c) => c.role_id === roleId);
  }

  forCell(cellData: InstalledCell): CellClient {
    return new CellClient(this, cellData);
  }
}
