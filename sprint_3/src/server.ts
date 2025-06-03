import { server } from "./app";
import { PORT } from "./lib/constants";

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
