import { animate, state, style, transition, trigger, AnimationTriggerMetadata } from '@angular/animations';

export const personsAnimations: {
  readonly confirmDialogTransition: AnimationTriggerMetadata;
} = {
  confirmDialogTransition: trigger('confirmDialog', [
    state('void', style({ transform: 'scale3d(1, 0, 1)', visibility: 'hidden' })),
    state('*', style({ transform: 'none', visibility: 'visible' })),
    transition('void => *', animate('500ms cubic-bezier(0.35, 0, 0.25, 1)'))
  ])
};
