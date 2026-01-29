export class Logger {
  private static formatMessage(level: string, message: string, ...args: unknown[]): string {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.length > 0 ? ` ${JSON.stringify(args)}` : '';
    return `[${timestamp}] [${level}] ${message}${formattedArgs}`;
  }

  static info(message: string, ...args: unknown[]): void {
    console.log(this.formatMessage('INFO', message, ...args));
  }

  static error(message: string, ...args: unknown[]): void {
    console.error(this.formatMessage('ERROR', message, ...args));
  }

  static warn(message: string, ...args: unknown[]): void {
    console.warn(this.formatMessage('WARN', message, ...args));
  }

  static debug(message: string, ...args: unknown[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('DEBUG', message, ...args));
    }
  }
}
