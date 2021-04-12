import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, timer, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export class DelayedPreloadingStrategy implements PreloadingStrategy {
  // TODO: @IMalaniak check this Function type
  // eslint-disable-next-line @typescript-eslint/ban-types
  preload(route: Route, load: Function): Observable<any> {
    const loadRoute = (delay: boolean) => (delay ? timer(300).pipe(mergeMap((_) => load())) : load());
    return route.data && route.data.preload ? loadRoute(route.data.delay) : EMPTY;
  }
}
