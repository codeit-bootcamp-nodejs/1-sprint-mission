export type PrismaError = {
    code?: string;
  };
  
  export function isPrismaError(err: unknown): err is PrismaError {
    return typeof err === 'object' && err !== null && 'code' in err;
  }
  
  export function isSyntaxErrorWithBody(
    err: unknown
  ): err is SyntaxError & { status: number; body?: unknown } {
    return (
        typeof err === 'object' &&
        err !== null &&
        err instanceof SyntaxError &&
        'status' in err &&
        typeof (err as Record<string, unknown>).status === 'number' && //모르겠다다
        'body' in err
    );
  }