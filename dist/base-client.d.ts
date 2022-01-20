import { AppSignalCb } from "@holochain/client";
export declare abstract class BaseClient {
    protected handlers: Array<AppSignalCb>;
    addSignalHandler(signalHandler: AppSignalCb): Promise<{
        unsubscribe: () => void;
    }>;
    protected handleSignal(signal: any): void;
}
