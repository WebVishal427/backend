import server from "./server"; // Import the Express instance

const http = require("http");

const port = process.env.PORT || 1998;

// Create an HTTP server using the Express instance
const appServer = http.createServer(server);

appServer.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
