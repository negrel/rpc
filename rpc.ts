/**
 * Rpc define a Remote Procedure Call (RPC).
 */
export interface Rpc<A> {
  id: number;
  name: string;
  args: A;
}

/**
 * RpcOptions define options of a RPC.
 */
export interface RpcOptions {
  timeout: number;
}

/**
 * Default RPC options used by {@link RpcWorker}s.
 */
export const defaultRpcOptions: RpcOptions = {
  timeout: 300000,
};

/**
 * RpcClient define interface common to all RPC client supporting Remote Procedure
 * Call (RPC).
 */
export interface RpcClient {
  remoteProcedureCall<A, R>(
    _: { name: string; args: A },
    options?: Partial<RpcOptions>,
  ): Promise<R>;
}
