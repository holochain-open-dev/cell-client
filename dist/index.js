import { s as src } from './index-df2b9e7b.js';
import * as ConductorApi from '@holochain/conductor-api';

//@ts-ignore
class HoloClient {
    constructor(connection, cellData, branding) {
        this.connection = connection;
        this.cellData = cellData;
        this.branding = branding;
    }
    get cellId() {
        return this.cellData.cell_id;
    }
    callZome(zomeName, fnName, payload) {
        return this.connection.zomeCall(this.cellData.cell_nick, zomeName, fnName, payload);
    }
    addSignalHandler(signalHandler) {
        new src.Connection(this.connection.chaperone_url, signalHandler, this.branding);
    }
}

class HolochainClient {
    constructor(appWebsocket, cellData) {
        this.appWebsocket = appWebsocket;
        this.cellData = cellData;
    }
    get cellId() {
        return this.cellData.cell_id;
    }
    callZome(zomeName, fnName, payload) {
        return this.appWebsocket.callZome({
            cap: null,
            cell_id: this.cellId,
            zome_name: zomeName,
            fn_name: fnName,
            payload: payload,
            provenance: this.cellId[1],
        });
    }
    addSignalHandler(signalHandler) {
        ConductorApi.AppWebsocket.connect(this.appWebsocket.client.socket.url, 15000, signalHandler);
    }
}

export { HoloClient, HolochainClient };
//# sourceMappingURL=index.js.map
