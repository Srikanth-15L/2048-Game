"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const axios_1 = __importDefault(require("axios"));
class Logger {
    constructor(config) {
        this.config = {
            enableConsole: true,
            enableApi: true,
            retryAttempts: 3,
            retryDelay: 1000,
            ...config
        };
        this.httpClient = axios_1.default.create({
            baseURL: this.config.apiUrl,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    /**
     * Main logging function that sends logs to API and optionally console
     */
    async log(stack, level, packageName, message) {
        const logEntry = {
            stack,
            level,
            package: packageName,
            message,
            timestamp: new Date().toISOString()
        };
        // Console logging
        if (this.config.enableConsole) {
            this.logToConsole(logEntry);
        }
        // API logging
        if (this.config.enableApi) {
            await this.logToApi(logEntry);
        }
    }
    /**
     * Convenience methods for different log levels
     */
    async debug(packageName, message) {
        await this.log(this.config.defaultStack, 'debug', packageName, message);
    }
    async info(packageName, message) {
        await this.log(this.config.defaultStack, 'info', packageName, message);
    }
    async warn(packageName, message) {
        await this.log(this.config.defaultStack, 'warn', packageName, message);
    }
    async error(packageName, message) {
        await this.log(this.config.defaultStack, 'error', packageName, message);
    }
    async fatal(packageName, message) {
        await this.log(this.config.defaultStack, 'fatal', packageName, message);
    }
    /**
     * Express middleware function for backend applications
     */
    expressMiddleware() {
        return (req, res, next) => {
            const start = Date.now();
            // Log incoming request
            this.info('middleware', `${req.method} ${req.path} - ${req.ip}`);
            // Log response when finished
            res.on('finish', () => {
                const duration = Date.now() - start;
                const level = res.statusCode >= 400 ? 'error' : 'info';
                this.log(this.config.defaultStack, level, 'middleware', `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
            });
            next();
        };
    }
    /**
     * React hook for frontend applications
     */
    useLogger() {
        return {
            debug: (packageName, message) => this.log('frontend', 'debug', packageName, message),
            info: (packageName, message) => this.log('frontend', 'info', packageName, message),
            warn: (packageName, message) => this.log('frontend', 'warn', packageName, message),
            error: (packageName, message) => this.log('frontend', 'error', packageName, message),
            fatal: (packageName, message) => this.log('frontend', 'fatal', packageName, message)
        };
    }
    /**
     * Private method to log to console with proper formatting
     */
    logToConsole(logEntry) {
        const timestamp = logEntry.timestamp || new Date().toISOString();
        const logMessage = `[${timestamp}] [${logEntry.stack.toUpperCase()}] [${logEntry.level.toUpperCase()}] [${logEntry.package}] ${logEntry.message}`;
        switch (logEntry.level) {
            case 'debug':
                console.debug(logMessage);
                break;
            case 'info':
                console.info(logMessage);
                break;
            case 'warn':
                console.warn(logMessage);
                break;
            case 'error':
            case 'fatal':
                console.error(logMessage);
                break;
            default:
                console.log(logMessage);
        }
    }
    /**
     * Private method to send logs to API with retry logic
     */
    async logToApi(logEntry) {
        let attempts = 0;
        const maxAttempts = this.config.retryAttempts || 3;
        while (attempts < maxAttempts) {
            try {
                const response = await this.httpClient.post('/evaluation-service/logs', logEntry);
                if (response.status === 200) {
                    const data = response.data;
                    // Optionally store the logID for tracking
                    logEntry.logID = data.logID;
                    return;
                }
            }
            catch (error) {
                attempts++;
                if (attempts >= maxAttempts) {
                    // Final attempt failed, log to console as fallback
                    console.error('Failed to send log to API after retries:', error);
                    return;
                }
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, this.config.retryDelay || 1000));
            }
        }
    }
    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map