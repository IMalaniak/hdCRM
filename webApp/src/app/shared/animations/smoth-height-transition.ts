import { trigger, state, style, animate, transition } from '@angular/animations';

export const smoothHeightTransition = trigger('smoothHeightAnimation', [
  state('true', style({ opacity: 1, visibility: 'visible', height: '*', overflow: 'hidden' })),
  state('false', style({ opacity: 0, visibility: 'hidden', height: 0, overflow: 'hidden' })),
  transition('false => true', animate('225ms cubic-bezier(.60, -0, .35, 1)')),
  transition('true => false', animate('185ms cubic-bezier(.60, -0, .35, 1)'))
]);
