import { defaultRpcOptions, RpcOptions, RpcWorker } from "./rpc.ts";

type RpcResult<R> =
  | {
    id: number;
    result: R;
  }
  | {
    id: number;
    error: string;
  };

type ResponseHandler<T> = (_: RpcResult<T>) => void;

let globalMsgId = 0;

/**
 * WebWorkerFront is the front-end of {@link WebWorker} based {@link RpcWorker}.
 */
export class WebWorkerFront extends Worker implements RpcWorker {
  // deno-lint-ignore no-explicit-any
  private readonly responseHandlers = new Map<number, ResponseHandler<any>>();

  constructor(specifier: string | URL, options?: WorkerOptions) {
    super(specifier, options);
    this.addEventListener("message", this.onResponse.bind(this));
  }

  async remoteProcedureCall<A, R>(
    rpc: { name: string; args: A },
    options?: Partial<RpcOptions> | undefined,
  ): Promise<R> {
    const { timeout } = {
      ...defaultRpcOptions,
      ...options,
    };

    const msgId = globalMsgId++;

    return await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(`rpc ${msgId} (${rpc.name}) timed out`);
      }, timeout);

      this.addResponseHandler(msgId, (data: RpcResult<R>) => {
        // Clear timeout and response handler.
        clearTimeout(timeoutId);
        this.removeResponseHandler(msgId);

        if ("error" in data) {
          reject(data.error);
          return;
        }

        resolve(data.result);
      });

      this.postMessage({ id: msgId, ...rpc }, []);
    });
  }

  private onResponse<R>(event: MessageEvent<RpcResult<R>>): void {
    const responseId = event.data.id;
    const responseHandler = this.responseHandlers.get(responseId);

    if (responseHandler === undefined) {
      throw new Error(
        `received unexpected response for rpc ${responseId}, no handler registered`,
      );
    }

    responseHandler(event.data);
  }
  // deno-lint-ignore no-explicit-any
  private addResponseHandler(id: number, handler: ResponseHandler<any>): void {
    this.responseHandlers.set(id, handler);
  }

  private removeResponseHandler(id: number): void {
    this.responseHandlers.delete(id);
  }
}
