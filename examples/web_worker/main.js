import { WorkerRpcClient } from "jsr:@negrel/rpc";

// Create a worker based RpcClient.
const client = new WorkerRpcClient(
  new URL("./worker_script.js", import.meta.url),
  { type: "module" },
);

const result = await client.remoteProcedureCall({
  name: "doWork",
  args: { i: Math.random() },
});

console.log(result);

client.terminate();
