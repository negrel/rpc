import { assert, assertEquals } from "./dev_deps.ts";
import { HttpRpcClient } from "./http_client.ts";
import { httpServerHandler } from "./http_server.ts";

Deno.test("RPC double()", async () => {
  const server = Deno.serve(
    { onListen: () => {} },
    httpServerHandler({
      double: (n: number) => n * 2,
    }),
  );

  const client = new HttpRpcClient(
    "http://" + server.addr.hostname + ":" + server.addr.port.toFixed(0),
  );

  const result = await client.remoteProcedureCall({ name: "double", args: 2 });

  assertEquals(result, 4);

  await server.shutdown();
});

Deno.test("error response", async () => {
  const server = Deno.serve(
    {
      onListen: () => {},
      onError: () => new Response(null, { status: 500 }),
    },
    () => {
      throw new Error("server error");
    },
  );

  const client = new HttpRpcClient(
    "http://" + server.addr.hostname + ":" + server.addr.port.toFixed(0),
  );

  try {
    await client.remoteProcedureCall<undefined, number>({
      name: "error",
      args: undefined,
    });

    assert(false, "exception not thrown");
  } catch (err) {
    assert(err.toString().includes("500 Internal Server Error"));
  }

  await server.shutdown();
});

Deno.test("non existent procedure", async () => {
  const server = Deno.serve(
    { onListen: () => {} },
    httpServerHandler({
      double: (n: number) => n * 2,
    }),
  );

  const client = new HttpRpcClient(
    "http://" + server.addr.hostname + ":" + server.addr.port.toFixed(0),
  );

  try {
    await client.remoteProcedureCall<[], number>({
      name: "non existent",
      args: [],
    });

    assert(false, "exception not thrown");
  } catch (err) {
    assert(
      err.toString().includes(
        'procedure "non existent" doesn\'t exist',
      ),
    );
  }

  await server.shutdown();
});

Deno.test("timeout error is thrown if worker doesn't respond", async () => {
  const server = Deno.serve(
    { onListen: () => {} },
    httpServerHandler({
      sleep: (ms: number) => new Promise((res) => setTimeout(res, ms)),
    }),
  );

  const client = new HttpRpcClient(
    "http://" + server.addr.hostname + ":" + server.addr.port.toFixed(0),
  );

  try {
    await client.remoteProcedureCall<number, number>(
      {
        name: "sleep",
        args: 10000, // 10s
      },
      { timeout: 1000 }, // 1s
    );
  } catch (err) {
    assertEquals(err, "rpc (sleep) timed out");
  }

  await server.shutdown();
});
