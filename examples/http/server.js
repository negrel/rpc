import { httpServerHandler } from "jsr:@negrel/rpc";

Deno.serve(httpServerHandler({
  doWork({ i }) {
    console.log("doWork", i);
    return i * 2;
  },
}));
