import { defaultRpcOptions, RpcClient, RpcOptions } from "./rpc.ts";

type RpcResult<R> = { result: R } | { error: string };

/**
 * HttpRpcClient is an HTTP based {@link RpcClient}
 */
export class HttpRpcClient implements RpcClient {
  private readonly input: string | URL | Request;
  private readonly init?: RequestInit;

  constructor(input: string | URL | Request, init?: RequestInit) {
    this.input = input;
    this.init = init;
  }

  async remoteProcedureCall<A, R>(
    rpc: { name: string; args: A },
    options?: Partial<RpcOptions> | undefined,
  ): Promise<R> {
    const { timeout } = {
      ...defaultRpcOptions,
      ...options,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(`rpc (${rpc.name}) timed out`),
      timeout,
    );

    const response = await fetch(this.input, {
      ...this.init,
      method: "POST",
      headers: {
        ...this.init?.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rpc),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `${response.status} ${response.statusText}: ${await response.text()}`,
      );
    }

    const result: RpcResult<R> = await response.json();
    if ("error" in result) {
      throw new Error(result.error);
    }

    return result.result;
  }
}
