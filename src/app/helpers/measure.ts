import {catchError, defer, finalize, Observable, tap, throwError} from "rxjs";

export const measure = function <T>(
  nativeWindow: Window,
  name: string,
  prefix = "app:"
) {
  return (source: Observable<T>) => {
    if (
      "performance" in nativeWindow &&
      nativeWindow.performance !== undefined
    ) {
      return defer(() => {
        nativeWindow.performance.mark(`${prefix}${name}:subscribe`);
        return source.pipe(
          tap(() => nativeWindow.performance.mark(`${prefix}${name}:next`)),
          catchError((error) => {
            nativeWindow.performance.mark(`${prefix}${name}:error`);
            return throwError(error);
          }),
          finalize(() => {
            nativeWindow.performance.mark(`${prefix}${name}:complete`);
            nativeWindow.performance.measure(
              `${prefix}${name}`,
              `${prefix}${name}:subscribe`,
              `${prefix}${name}:complete`
            );
          })
        );
      });
    }
    return source;
  };
};
