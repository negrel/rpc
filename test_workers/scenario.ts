import { workerProcedureHandler } from "../web_worker_back.ts";

declare const self: Worker;

self.onmessage = workerProcedureHandler(
  {
    async iter(iter: number) {
      for (let i = 0; i < iter; i++) {
        const response = await fetch("http://127.0.0.1:8080");
        if (!response.ok) throw new Error("...");
      }
    },
  },
);
