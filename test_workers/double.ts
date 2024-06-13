import { workerProcedureHandler } from "../web_worker_back.ts";

declare const self: Worker;

self.onmessage = workerProcedureHandler(
  {
    double(nb: number): number {
      return nb * 2;
    },
  },
);
