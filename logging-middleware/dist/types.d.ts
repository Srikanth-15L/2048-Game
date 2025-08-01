export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogStack = 'backend' | 'frontend';
export type LogPackage = 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler' | 'repository' | 'route' | 'service' | 'api' | 'component' | 'hook' | 'page' | 'state' | 'style' | 'auth' | 'config' | 'middleware' | 'utils';
export interface LogEntry {
    stack: LogStack;
    level: LogLevel;
    package: LogPackage;
    message: string;
    timestamp?: string;
    logID?: string;
}
export interface LogConfig {
    apiUrl: string;
    enableConsole?: boolean;
    enableApi?: boolean;
    defaultStack: LogStack;
    retryAttempts?: number;
    retryDelay?: number;
}
export interface LogResponse {
    logID: string;
    message: string;
}
//# sourceMappingURL=types.d.ts.map