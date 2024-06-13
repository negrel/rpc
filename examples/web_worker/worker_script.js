import { workerMessageHandler } from "jsr:@negrel/rpc";

self.onmessage = workerMessageHandler({
  doWork({ i }) {
    console.log("doWork", i);
    return i * 2;
  },
});
