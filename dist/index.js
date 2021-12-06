import { AppWebsocket } from '@holochain/conductor-api';

class BaseClient {
    constructor() {
        this.handlers = [];
    }
    async addSignalHandler(signalHandler) {
        this.handlers.push(signalHandler);
        return {
            unsubscribe: () => {
                const index = this.handlers.findIndex((h) => h === signalHandler);
                this.handlers.splice(index, 1);
            },
        };
    }
    handleSignal(signal) {
        for (const handler of this.handlers) {
            handler(signal);
        }
    }
}

class HoloClient extends BaseClient {
    constructor(connection, cellData, branding) {
        super();
        this.connection = connection;
        this.cellData = cellData;
        this.branding = branding;
        this.handlers.push(this.connection.signalCb);
        this.connection.signalCb = (s) => this.handleSignal(s);
    }
    get cellId() {
        return this.cellData.cell_id;
    }
    async callZome(zomeName, fnName, payload) {
        const result = await this.connection.zomeCall(this.cellData.role_id, zomeName, fnName, payload);
        if (result && result.type === "error") {
            throw new Error(result.payload.message);
        }
        return result;
    }
}

class HolochainClient extends BaseClient {
    constructor(appWebsocket, cellData) {
        super();
        this.appWebsocket = appWebsocket;
        this.cellData = cellData;
        AppWebsocket.connect(this.appWebsocket.client.socket.url, 15000, (s) => this.handleSignal(s));
    }
    get cellId() {
        return this.cellData.cell_id;
    }
    callZome(zomeName, fnName, payload, timeout = 15000) {
        return this.appWebsocket.callZome({
            cap: null,
            cell_id: this.cellId,
            zome_name: zomeName,
            fn_name: fnName,
            payload: payload,
            provenance: this.cellId[1],
        }, timeout);
    }
}

export { HoloClient, HolochainClient };
//# sourceMappingURL=index.js.map
