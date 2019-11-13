import { trigger, transition, style, query, animate } from '@angular/animations';

export const appRouterTransition = trigger('appRouterAnimations', [
  transition('* => PrivateView', [
    query(
      ':leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ],
      { optional: true }
    ),
    query(
      ':enter',
      [
        style({
          opacity: 0
        })
      ],
      { optional: true }
    ),
    query(':leave', [animate('750ms cubic-bezier(0.9, 0, 0.32, 1)', style({ left: '100%' }))], { optional: true }),
    query(':enter', [animate('200ms ease-in-out', style({ opacity: 1 }))], {
      optional: true
    })
  ])
]);
