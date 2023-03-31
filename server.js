const app = require("./app");
const dotenv = require("dotenv");
const cron = require('node-cron')
const User = require('./models/index').users
const { Op } = require('sequelize')
const logger = require("./utils/logger");


dotenv.config({ path: "./env" });


//CONFIGURE UNCAUGHT EXCEPTIONS
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 🔥 Shutting Down...");
  console.log(err.name, err.message);
  process.exit(1);
});

//START SERVER
const PORT = process.env.PORT || 3310;

// ---> CRON JOB
// DEFINE TASK SCHEDULER FOR ACCOUNT DELETION
const DeletionScheduler = cron.schedule('0 23 * * *', async () => {  // RUN AT 23:00 EVERYDAY
  // DELETE: ANY ACCOUNT DUE FOR DELETION
  try {
    const result = await User.destroy({
      where: {
        deletionDate: { [Op.lt]: Date.now() }
      }
    })
    if (result) {
      logger.info(`DELETED ${result} ACCOUNT(S)!`);
    }
  } catch (error) {
    logger.error(error);
  }
})

const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  // START SCHEDULER
  DeletionScheduler.start()
});

//CONFIGURE UNHANDLED REJECTIONS
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 🔥 Shutting Down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
