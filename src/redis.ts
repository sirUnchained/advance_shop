import { Redis } from "ioredis";
import configs from "./configENV";

const redis = new Redis(configs.redisURI);

export default redis;
