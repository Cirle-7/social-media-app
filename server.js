const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "./env" });

//CONFIGURE UNCAUGHT EXCEPTIONS
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 🔥 Shutting Down...");
  console.log(err.name, err.message);
  process.exit(1);
});

//START SERVER
const PORT = process.env.PORT || 3310;

const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

//CONFIGURE UNHANDLED REJECTIONS
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 🔥 Shutting Down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
