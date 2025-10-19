import dotenv from "dotenv";
dotenv.config();

interface IConfig {
  PORT?: number;
}



const config: IConfig = {
  PORT: Number(process.env.PORT) || 5000,
  
};

export default config;
