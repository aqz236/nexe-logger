import pino from "pino";
import pretty from "pino-pretty";
import {
  createConfigFromEnv,
  getEnvironmentConfig,
  mergeConfig,
} from "./config";
import { getDefaultFormatters } from "./formatters";
import { HestLogger } from "./logger";
import { getDefaultSerializers } from "./serializers";
import type { Logger, LoggerConfig } from "./types";

/**
 * 创建 Logger 实例
 */
export function createLogger(
  name?: string,
  config?: Partial<LoggerConfig>
): Logger {
  // 合并配置：默认配置 -> 环境配置 -> 环境变量配置 -> 用户配置
  const envConfig = getEnvironmentConfig();
  const envVarConfig = createConfigFromEnv();
  const userConfig = config || {};

  // 如果提供了名称，添加到配置中
  if (name) {
    userConfig.name = name;
  }

  const finalConfig = mergeConfig(envConfig, envVarConfig, userConfig);

  // 设置默认序列化器和格式化器
  if (!finalConfig.serializers) {
    finalConfig.serializers = getDefaultSerializers();
  }

  if (!finalConfig.formatters) {
    finalConfig.formatters = getDefaultFormatters();
  }

  // 根据环境创建 logger
  const environment = process.env.NODE_ENV || "development";
  let pinoLogger: any;

  if (environment === "development" || environment === "dev") {
    // 开发环境使用 pino-pretty 作为流
    const stream = pretty({
      levelFirst: false,
      colorize: true,
      translateTime: "yy-mm-dd HH:MM:ss.l",
    });

    const pinoConfig = {
      name: finalConfig.name || name || "HestJS",
      level: finalConfig.level || "debug",
      serializers: finalConfig.serializers || {},
      formatters: finalConfig.formatters || {},
    };

    pinoLogger = pino(pinoConfig, stream);
  } else {
    // 生产环境直接输出 JSON 到 stdout
    pinoLogger = pino({
      name: finalConfig.name || "HestJS",
      level: finalConfig.level || "info",
      serializers: finalConfig.serializers || {},
      formatters: finalConfig.formatters || {},
    });
  }

  // 如果有 name，创建一个 child logger 来包含 name
  const loggerName = name || finalConfig.name || "HestJS";
  const loggerWithName = pinoLogger.child({ name: loggerName });

  // 返回 HestLogger 实例
  return new HestLogger(loggerWithName);
}

/**
 * 创建带有上下文的 Logger
 */
export function createLoggerWithContext(
  name: string,
  context: Record<string, any>,
  config?: Partial<LoggerConfig>
): Logger {
  const logger = createLogger(name, config);
  return logger.setContext(context);
}

/**
 * 创建子 Logger
 */
export function createChildLogger(
  parent: Logger,
  bindings: Record<string, any>
): Logger {
  return parent.child(bindings);
}
