import { Directive, Output, EventEmitter, OnInit } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[elementInView]'
})
export class ElementInViewDirective implements OnInit {
  // tslint:disable-next-line:no-output-on-prefix
  @Output() elementInView: EventEmitter<any>;

  constructor() {
    this.elementInView = new EventEmitter<any>();
  }

  ngOnInit() {
    this.elementInView.emit('Element loaded');
  }
}
