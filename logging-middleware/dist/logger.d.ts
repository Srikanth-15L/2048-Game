import { LogLevel, LogStack, LogPackage, LogConfig } from './types';
export declare class Logger {
    private config;
    private httpClient;
    constructor(config: LogConfig);
    /**
     * Main logging function that sends logs to API and optionally console
     */
    log(stack: LogStack, level: LogLevel, packageName: LogPackage, message: string): Promise<void>;
    /**
     * Convenience methods for different log levels
     */
    debug(packageName: LogPackage, message: string): Promise<void>;
    info(packageName: LogPackage, message: string): Promise<void>;
    warn(packageName: LogPackage, message: string): Promise<void>;
    error(packageName: LogPackage, message: string): Promise<void>;
    fatal(packageName: LogPackage, message: string): Promise<void>;
    /**
     * Express middleware function for backend applications
     */
    expressMiddleware(): (req: any, res: any, next: any) => void;
    /**
     * React hook for frontend applications
     */
    useLogger(): {
        debug: (packageName: LogPackage, message: string) => Promise<void>;
        info: (packageName: LogPackage, message: string) => Promise<void>;
        warn: (packageName: LogPackage, message: string) => Promise<void>;
        error: (packageName: LogPackage, message: string) => Promise<void>;
        fatal: (packageName: LogPackage, message: string) => Promise<void>;
    };
    /**
     * Private method to log to console with proper formatting
     */
    private logToConsole;
    /**
     * Private method to send logs to API with retry logic
     */
    private logToApi;
    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<LogConfig>): void;
}
//# sourceMappingURL=logger.d.ts.map