import { trigger, transition, style, query, animate } from "@angular/animations";

export const privateRouterTransition = 
trigger('privateRouterAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        right: 0,
        padding: '0 15px',
        width: '100%',
        opacity: 0,
      })], {optional: true}),
    query(':enter', [
      animate('600ms ease-in-out',
        style({ opacity: 1 })
      )], {optional: true})
  ])
]);