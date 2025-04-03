import { Server } from "./server";

const server: any = require("http").Server(new Server().app);

let port = process.env.PORT || 1998;

server.listen(port, () => {
  console.log(`server is listening at port ${port}`);
});
