/* eslint-disable no-console */
export type LogType = 'log' | 'debug' | 'info' | 'warn' | 'error' | 'dir';

export interface LogEntry {
  type: LogType;
  content: string;
  timestamp: Date;
}

const MAX_LOGS = 1000; // 保持するログの最大数

let logs: LogEntry[] = [];

const addLog = (type: LogType, args: unknown[]): void => {
  const content = args
    .map(arg => (typeof arg === 'string' ? arg : JSON.stringify(arg)))
    .join(' ')
    .trimEnd();

  if (!content) {
    return;
  }

  logs.push({ type, content, timestamp: new Date() });

  if (logs.length > MAX_LOGS) {
    logs = logs.slice(-MAX_LOGS);
  }
};

const originalConsole = {
  log: console.log,
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
  dir: console.dir,
};

console.log = function (...args: unknown[]): void {
  addLog('log', args);
  originalConsole.log.call(console, ...args);
};

console.debug = function (...args: unknown[]): void {
  addLog('debug', args);
  originalConsole.debug.call(console, ...args);
};

console.info = function (...args: unknown[]): void {
  addLog('info', args);
  originalConsole.info.call(console, ...args);
};

console.warn = function (...args: unknown[]): void {
  addLog('warn', args);
  originalConsole.warn.call(console, ...args);
};

console.error = function (...args: unknown[]): void {
  addLog('error', args);
  originalConsole.error.call(console, ...args);
};

console.dir = function (obj: unknown, options?: object): void {
  addLog('dir', [obj]);
  originalConsole.dir.call(console, obj, options);
};

export const getLogs = (): LogEntry[] => [...logs];
