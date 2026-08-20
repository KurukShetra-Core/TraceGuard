import { logger } from "./utils/logger";

type IInit = {
  connection: string;
  id: string | number;
};

let state = {
  isConnected: false,
  connectionUrl: undefined as string | undefined,
  id: undefined as string | number | undefined,
};
/**
 * @param connection string
 * @param id string | number
 * @description  above both params is an created by self hosted backend itself ,
 * we can use it connect sdk and expressjs backend
 * **/

export function init({ connection, id }: IInit) {
  if (!connection || !id) {
    throw new Error("connection credentials for traceguard not passed");
  }

  state.connectionUrl = connection;
  state.id = id;
  state.isConnected = false;

  logger.info({
    msg: "connection data established",
    id: id !== "" || undefined || null,
    connection: connection !== "" || undefined || null,
  });

  fetch(connection, {
    method: "HEAD",
  })
    .then((res) => {
      logger.info({ msg: "status of connection", status: res.status });
      state.isConnected = true;
    })
    .catch((err) => {
      logger.error({
        msg: "error while making connection to backend by sdk",
        err,
      });
      // throwing error to catch by users catch block
      throw err;
    });
}

/**
 * @description connecting to sdk with backend states
 * **/
export function getConnection() {
  if (state.isConnected === false) {
    throw new Error("not ready to connect");
  }
  return { ...state };
}
