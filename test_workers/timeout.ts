import { workerProcedureHandler } from "../web_worker_back.ts";

declare const self: Worker;

self.onmessage = workerProcedureHandler(
  {
    sleep(ms: number): Promise<void> {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    },
  },
);
