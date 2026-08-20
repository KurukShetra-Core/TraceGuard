// capture uncaught errors

import fs from "node:fs";
import process from "node:process";

import { logger } from "../../utils/logger";

process?.on("uncaughtException", (error, origin) => {
  logger.error({
    msg: "error occurred while capturing uncaught errors",
    error,
  });

  logger.info({ msg: "origin details of this uncaught error", origin });

  fs.writeSync(
    process?.stderr.fd,
    `caught exception : ${error}` + `origin : ${origin}`,
  );

  //   notExistenceFunction() // -> to check whether this works
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});
