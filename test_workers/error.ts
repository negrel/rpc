import { workerProcedureHandler } from "../web_worker_back.ts";

declare const self: Worker;

self.onmessage = workerProcedureHandler(
  {
    error() {
      throw new Error("runtime error from worker");
    },
  },
);
