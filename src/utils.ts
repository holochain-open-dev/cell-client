import { CellId, InstalledAppInfo, InstalledCell } from "@holochain/client";
import isEqual from "lodash-es/isEqual";

export function areEqual(cellId1: CellId, cellId2: CellId): boolean {
  return isEqual(cellId1[0], cellId2[0]) && isEqual(cellId1[1], cellId2[1]);
}

export function fixHoloAppInfo(app: InstalledAppInfo): InstalledAppInfo {
  return {
    ...app,
    cell_data: app.cell_data.map((c) => fixCellData(c)),
  };
}

function fixCellData(cell: InstalledCell): InstalledCell {
  return {
    ...cell,
    cell_id: [fixBuffer(cell.cell_id[0]), fixBuffer(cell.cell_id[1])],
  };
}

function fixBuffer(b: any): Uint8Array {
  if (b.type === "Buffer") return new Uint8Array(b.data);
  return b;
}
