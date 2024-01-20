const { Worker } = require("bullmq");
const worker = new Worker(
  "email-que",
  async (job) => {
    console.log(job.data.id);
    const email = await new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          resolve("success");
        }, 2000);
      } catch (error) {
        reject("something went wrong");
      }
    });
    return "email send successfully " + job.data.id;
  },
  {
    connection: {
      host: "redis-12d75cbc-virenderkumar23435-ed80.a.aivencloud.com",
      port: 20966,
      password: "AVNS_XNQN_xMIQWnTtp-hHpF",
      username: "default",
    },
  }
);
worker.on("completed", (job, returnvalue) => {
  console.log(returnvalue);
  return returnvalue;
});
