import { assert, assertEquals, assertMatch } from "./dev_deps.ts";
import { WorkerRpcClient } from "./worker_client.ts";

Deno.test("RPC double()", async () => {
  const client = new WorkerRpcClient(
    new URL("./test_workers/double.ts", import.meta.url).href,
    { type: "module" },
  );

  const result = await client.remoteProcedureCall<number, number>({
    name: "double",
    args: 2,
  });

  assertEquals(result, 4);

  client.terminate();
});

Deno.test("error is thrown from worker", async () => {
  const client = new WorkerRpcClient(
    new URL("./test_workers/error.ts", import.meta.url).href,
    { type: "module" },
  );

  try {
    await client.remoteProcedureCall<undefined, number>({
      name: "error",
      args: undefined,
    });

    assert(false, "exception not thrown");
  } catch (err) {
    assert(err.startsWith("Error: runtime error from worker"));
  }

  client.terminate();
});

Deno.test("non existent procedure", async () => {
  const client = new WorkerRpcClient(
    new URL("./test_workers/error.ts", import.meta.url).href,
    { type: "module" },
  );

  try {
    await client.remoteProcedureCall<[], number>({
      name: "non existent",
      args: [],
    });

    assert(false, "exception not thrown");
  } catch (err) {
    assert(err.startsWith('Error: procedure "non existent" doesn\'t exist'));
  }

  client.terminate();
});

Deno.test("timeout error is thrown if worker doesn't respond", async () => {
  const client = new WorkerRpcClient(
    new URL("./test_workers/timeout.ts", import.meta.url).href,
    { type: "module" },
  );

  try {
    await client.remoteProcedureCall<number, number>(
      {
        name: "sleep",
        args: 10000, // 10s
      },
      { timeout: 1000 },
    ); // 1s

    assert(false, "exception not thrown");
  } catch (err) {
    assertMatch(err, /^rpc \d+ \(sleep\) timed out/);
  }

  client.terminate();
});
