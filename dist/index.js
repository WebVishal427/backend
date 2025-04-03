"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const server = require("http").Server(new server_1.Server().app);
let port = process.env.PORT || 1998;
server.listen(port, () => {
    console.log(`server is listening at port ${port}`);
});
