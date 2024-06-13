# `rpc` - A lightweight, type-safe RPC facade and implementation for TypeScript.

A lightweight, type-safe RPC facade for typescript and a
[WebWorker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) and HTTP
based implementations.

## Usage

### WebWorker

In `main.js`:

```
import { WorkerRpcClient } from "jsr:@negrel/rpc";

// Create a worker based RpcClient.
const client = new WorkerRpcClient(
  new URL("./worker_script.js", import.meta.url),
  { type: "module" },
);

// Remote Procedure Call.
const result = await client.remoteProcedureCall({
  name: "doWork",
  args: { i: Math.random() },
});

console.log(result);

// Stop worker.
client.terminate();
```

In `worker_script.js`:

```
import { workerMessageHandler } from "jsr:@negrel/rpc";

self.onmessage = workerMessageHandler({
  doWork({ i }) {
    console.log("doWork", i);
    return i * 2;
  },
});
```

### HTTP

In `main.js`:

```
import { HttpRpcClient } from "jsr:@negrel/rpc";

// Create a worker based RpcClient.
const client = new HttpRpcClient("http://localhost:8000");

// Remote Procedure Call.
const result = await client.remoteProcedureCall({
  name: "doWork",
  args: { i: Math.random() },
});

console.log(result);
```

In `server.js`:

```
import { httpServerHandler } from "jsr:@negrel/rpc";

Deno.serve(httpServerHandler({
  doWork({ i }) {
    console.log("doWork", i);
    return i * 2;
  },
}));
```

## Contributing

If you want to contribute to `rpc` to add a feature or improve the code contact
me at [alexandre@negrel.dev](mailto:alexandre@negrel.dev), open an
[issue](https://github.com/negrel/rpc/issues) or make a
[pull request](https://github.com/negrel/rpc/pulls).

## :stars: Show your support

Please give a :star: if this project helped you!

[![buy me a coffee](https://github.com/negrel/.github/blob/master/.github/images/bmc-button.png?raw=true)](https://www.buymeacoffee.com/negrel)

## :scroll: License

MIT © [Alexandre Negrel](https://www.negrel.dev/)
