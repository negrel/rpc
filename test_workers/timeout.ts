import { workerMessageHandler } from "../worker_server.ts";

declare const self: Worker;

self.onmessage = workerMessageHandler(
  {
    sleep(ms: number): Promise<void> {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    },
  },
);
