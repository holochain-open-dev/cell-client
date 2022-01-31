import { AppSignalCb } from "@holochain/client";

export class SignalHandler {
  protected handlers: Array<AppSignalCb> = [];

  addSignalHandler(signalHandler: AppSignalCb) {
    this.handlers.push(signalHandler);

    return {
      unsubscribe: () => {
        const index = this.handlers.findIndex((h) => h === signalHandler);
        this.handlers.splice(index, 1);
      },
    };
  }

  protected handleSignal(signal: any) {
    for (const handler of this.handlers) {
      handler(signal);
    }
  }
}
