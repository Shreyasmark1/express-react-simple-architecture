export type GoSuccess<T> = [result: T, error: null];
export type GoError = [result: null, error: unknown | any];
export type GoResult<T> = GoSuccess<T> | GoError;

export async function AsyncGo<Args extends any[], T>(fn: (...args: Args) => Promise<T> | T, ...args: Args
): Promise<GoResult<T>> {
    try {
        const result = await fn(...args);
        return [result, null];
    } catch (error: unknown) {
        return [null, error];
    }
}