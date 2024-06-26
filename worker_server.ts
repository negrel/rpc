import { Rpc } from "./rpc.ts";

declare const self: Worker;

/**
 * workerMessageHandler is a wrapper around self.onmessage and self.postMessage
 * so a worker script can be used for Rpc by a {@link WorkerRpcClient}.
 */
export function workerMessageHandler(
  // deno-lint-ignore no-explicit-any
  procedures: Record<string, (...args: any[]) => any>,
  // deno-lint-ignore no-explicit-any
): (_: MessageEvent<Rpc<any>>) => Promise<void> {
  // deno-lint-ignore no-explicit-any
  return async (event: MessageEvent<Rpc<any>>): Promise<void> => {
    try {
      const procedure = procedures[event.data.name];
      if (typeof procedure !== "function") {
        throw new Error(`procedure "${event.data.name}" doesn't exist`);
      }

      const result = await procedure(event.data.args);

      self.postMessage(
        {
          id: event.data.id,
          result,
        },
        [],
      );
    } catch (err) {
      const error = (err as { stack: string })?.stack ??
        (err as { toString(): string }).toString();

      self.postMessage(
        {
          id: event.data.id,
          error,
        },
        [],
      );
    }
  };
}
