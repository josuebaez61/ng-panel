import { Component } from '@angular/core';

@Component({
  selector: 'app-hint',
  imports: [],
  template: `
    <small>
      <ng-content></ng-content>
    </small>
  `,
  styles: ``,
})
export class Hint {}
