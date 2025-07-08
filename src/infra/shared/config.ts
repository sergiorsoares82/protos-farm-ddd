import { join } from "node:path";
import { config } from "dotenv";

export class Config {
  static env: any = null;

  static db() {
    Config.readEnv();

    return {
      dialect: "sqlite",
      host: Config.env.DB_HOST,
      logging: Config.env.DB_LOGGING === "true",
    };
  }

  static readEnv() {
    if (Config.env) {
      return;
    }

    Config.env = config({
      path: join(__dirname, `../../../envs/.env.${process.env.NODE_ENV}`),
    }).parsed;
  }
}
