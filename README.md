# @nexe/logger

<div align="center">

![Nexe Logger](https://img.shields.io/badge/Nexe-Logger-blue?style=for-the-badge&logo=typescript)

**A powerful, modern logging solution for Nexe framework based on Pino**

[![npm version](https://img.shields.io/npm/v/@nexe/logger?style=flat-square)](https://www.npmjs.com/package/@nexe/logger)
[![downloads](https://img.shields.io/npm/dm/@nexe/logger?style=flat-square)](https://www.npmjs.com/package/@nexe/logger)
[![license](https://img.shields.io/npm/l/@nexe/logger?style=flat-square)](https://github.com/aqz236/nexe-logger/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

</div>

## ✨ Features

- 🚀 **High Performance** - Built on top of Pino, one of the fastest JSON loggers
- 🎨 **Beautiful Output** - Clean, readable console logs with customizable formatting
- 🔧 **TypeScript Native** - Full TypeScript support with comprehensive type definitions
- 🌍 **Environment Aware** - Different configurations for development, production, and testing
- 📝 **Structured Logging** - JSON logging with customizable serializers
- 🎯 **Context Support** - Add request IDs, user IDs, and custom context data
- 🔄 **Multiple Transports** - Console, file, rotating files, and custom transports
- 🛡️ **Security First** - Built-in redaction for sensitive information
- 📦 **Framework Integration** - Seamlessly integrates with Nexe framework


![](assets/20250727_225757_image.png)


## 📦 Installation

```bash
# npm
npm install @nexe/logger

# yarn
yarn add @nexe/logger

# pnpm
pnpm add @nexe/logger

# bun
bun add @nexe/logger
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { createLogger, logger } from '@nexe/logger';

// Use global logger
logger.info('Hello, World!');
logger.error('Something went wrong!', { error: 'details' });

// Create named logger
const apiLogger = createLogger('API');
apiLogger.info('API server started');
```

### With Nexe Framework

```typescript
import { Hono } from 'hono';
import { createLogger } from '@nexe/logger';

const logger = createLogger('app');
logger.info('🚀 Starting Nexe application...');

const app = new Hono();
app.get('/', (c) => {
  return c.text('Hello Nexe!');
});

logger.info('✅ Application ready!');
export default app;
```

### Advanced Configuration

```typescript
import { createLogger, LogLevel } from '@nexe/logger';

const customLogger = createLogger('MyService', {
  level: LogLevel.DEBUG,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss.l',
    }
  }
});

customLogger.debug('Debug information');
customLogger.info('Service initialized');
customLogger.warn('Warning message');
customLogger.error('Error occurred');
```

## 📖 API Reference

### Core Functions

#### `createLogger(name?, config?)`

Creates a new logger instance with optional name and configuration.

```typescript
const logger = createLogger('ServiceName', {
  level: LogLevel.INFO,
  // ... other options
});
```

#### `logger` (Global Logger)

Pre-configured global logger instance.

```typescript
import { logger } from '@nexe/logger';

logger.info('Global log message');
```

### Logger Methods

```typescript
logger.fatal('Fatal error');
logger.error('Error message');
logger.warn('Warning message');
logger.info('Info message');
logger.debug('Debug message');
logger.trace('Trace message');
```

### Context Support

```typescript
// Set context for all subsequent logs
logger.setContext({ requestId: '123', userId: 'user456' });
logger.info('User action performed');

// Create child logger with context
const childLogger = logger.child({ module: 'auth' });
childLogger.info('Authentication successful');
```

## ⚙️ Configuration

### Environment-based Configuration

The logger automatically adapts based on `NODE_ENV`:

- **Development**: Pretty-printed colored output
- **Production**: JSON format optimized for log aggregation
- **Test**: Minimal logging to reduce noise

### Custom Configuration

```typescript
import { createLogger, LogLevel } from '@nexe/logger';

const logger = createLogger('MyApp', {
  level: LogLevel.INFO,
  redact: ['password', 'token'], // Hide sensitive fields
  formatters: {
    level: (label, number) => ({ level: number }),
    bindings: (bindings) => ({ service: 'MyApp', ...bindings })
  },
  serializers: {
    req: (req) => ({ method: req.method, url: req.url }),
    res: (res) => ({ statusCode: res.statusCode })
  }
});
```

## 🎨 Output Examples

### Development Output

```
[2025-07-27 14:08:19.149] INFO (MyService): User login successful
[2025-07-27 14:08:19.150] ERROR (Auth): Invalid credentials provided
    error: "Invalid username or password"
    requestId: "req_123456"
```

### Production Output

```json
{"level":30,"time":1643299699149,"name":"MyService","msg":"User login successful","requestId":"req_123456"}
{"level":50,"time":1643299699150,"name":"Auth","msg":"Invalid credentials provided","err":{"type":"AuthError","message":"Invalid username or password"}}
```

## 🔧 Transports

### Console Transport

```typescript
import { createConsoleTransport } from '@nexe/logger';

const transport = createConsoleTransport({
  colorize: true,
  translateTime: 'yyyy-mm-dd HH:MM:ss.l'
});
```

### File Transport

```typescript
import { createFileTransport } from '@nexe/logger';

const transport = createFileTransport({
  destination: './logs/app.log',
  mkdir: true
});
```

### Rotating Files

```typescript
import { createRotatingFileTransport } from '@nexe/logger';

const transport = createRotatingFileTransport({
  filename: './logs/app-%DATE%.log',
  frequency: 'daily',
  maxSize: '10M',
  maxFiles: '7'
});
```

## 🛡️ Security Features

### Automatic Redaction

```typescript
const logger = createLogger('SecureApp', {
  redact: ['password', 'token', 'authorization', 'cookie']
});

// This will automatically redact sensitive fields
logger.info('User data', { 
  username: 'john_doe', 
  password: 'secret123' // This will be redacted
});
```

### Safe Serialization

All serializers include error handling to prevent logging failures from crashing your application.

## 🧪 Testing

```typescript
import { createLogger, LogLevel } from '@nexe/logger';

// Create test logger with minimal output
const testLogger = createLogger('Test', {
  level: LogLevel.WARN // Only log warnings and errors in tests
});
```

## 📊 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=aqz236/nexe-logger&type=Date)](https://star-history.com/#aqz236/nexe-logger&Date)

## 📊 Performance

- **Zero-cost abstractions** when logging is disabled
- **Fast serialization** with Pino's optimized JSON stringification
- **Minimal memory footprint** with streaming architecture
- **Benchmark**: Up to 35,000 logs/second in production mode

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Nexe Framework](https://github.com/aqz236/nexe)
- [Pino Logger](https://github.com/pinojs/pino)
- [Documentation](https://github.com/aqz236/nexe-logger/wiki)
- [Issues](https://github.com/aqz236/nexe-logger/issues)

---

<div align="center">

**Built with ❤️ for the Nexe ecosystem**

[⭐ Star us on GitHub](https://github.com/aqz236/nexe-logger) • [📝 Report Bug](https://github.com/aqz236/nexe-logger/issues) • [💡 Request Feature](https://github.com/aqz236/nexe-logger/issues)

</div>
