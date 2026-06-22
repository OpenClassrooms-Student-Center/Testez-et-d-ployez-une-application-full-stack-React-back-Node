import app from "./app.js";
import { getConfig } from "./config.js";

const { port } = getConfig();

app.listen(port, () => {
  console.log(`API 724events démarrée sur http://localhost:${port}`);
});
