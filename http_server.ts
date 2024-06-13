import { Rpc } from "./rpc.ts";

export function httpServerHandler(
  // deno-lint-ignore no-explicit-any
  procedures: Record<string, (...args: any[]) => any>,
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    // deno-lint-ignore no-explicit-any
    const rpc: Rpc<any> = await req.json();

    try {
      const procedure = procedures[rpc.name];
      if (typeof procedure !== "function") {
        throw new Error(`procedure "${rpc.name}" doesn't exist`);
      }

      const result = await procedure(rpc.args ?? undefined);
      return Response.json({ result });
    } catch (err) {
      const error = (err as { stack: string })?.stack ??
        (err as { toString(): string }).toString();
      return Response.json({ error });
    }
  };
}
