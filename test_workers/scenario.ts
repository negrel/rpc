import { workerMessageHandler } from "../worker_server.ts";

declare const self: Worker;

self.onmessage = workerMessageHandler(
  {
    async iter(iter: number) {
      for (let i = 0; i < iter; i++) {
        const response = await fetch("http://127.0.0.1:8080");
        if (!response.ok) throw new Error("...");
      }
    },
  },
);
