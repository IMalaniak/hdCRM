import { Pipe, PipeTransform } from '@angular/core';
/**
 * @description Memoized pipe for optimization
 * @summary Angular executes a pure pipe only when it detects a pure change
 *          to the input value. A pure change is either a change to
 *          a primitive input value (String, Number, Boolean, Symbol)
 *          or a changed object reference (Date, Array, Function, Object).
 * @usage {{ value | memoize : method [: context] }}
 * @see https://blog.usejournal.com/angular-optimization-memoized-pipe-functions-in-templates-75f62e16df5a
 * @class MemoizePipe
 * @implements {PipeTransform}
 */
@Pipe({ name: 'memoize' })
export class MemoizePipe implements PipeTransform {
  /**
   * @param {*} value
   * @param {(value: any, options?: any) => any} handler
   * @param context
   * @returns {*}
   * @memberof MemoizePipe
   */
  transform(value: any, handler: (value: any) => any, context?: any): any {
    if (context) {
      return handler.call(context, value);
    }
    return handler(value);
  }
}
