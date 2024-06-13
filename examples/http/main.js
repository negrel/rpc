import { HttpRpcClient } from "jsr:@negrel/rpc";

// Create a worker based RpcClient.
const client = new HttpRpcClient("http://localhost:8000");

const result = await client.remoteProcedureCall({
  name: "doWork",
  args: { i: Math.random() },
});

console.log(result);
