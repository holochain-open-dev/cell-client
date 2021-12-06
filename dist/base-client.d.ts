import { AppSignalCb } from "@holochain/conductor-api";
export declare abstract class BaseClient {
    protected handlers: Array<AppSignalCb>;
    addSignalHandler(signalHandler: AppSignalCb): Promise<{
        unsubscribe: () => void;
    }>;
    protected handleSignal(signal: any): void;
}
