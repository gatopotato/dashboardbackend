import app from "./src/app.js";
import "dotenv/config";
import connectdb from "./src/database/index.js";

const port = process.env.PORT || 3000;

connectdb()
  .then(() => {
    app.on("error", (err) => {
      console.log("Error occurred", err);
    });

    app.listen(port, () => {
      console.log(`serving at http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
