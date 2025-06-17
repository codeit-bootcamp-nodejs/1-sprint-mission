import { server } from "./app";
import { PORT } from "./lib/constants";

server.listen(PORT, () => {
  const env = process.env.NODE_ENV === "production" ? "PRODUCTION" : "LOCAL";
  console.log(`Server is listening on ${PORT} - Running in ${env} mode`);
});