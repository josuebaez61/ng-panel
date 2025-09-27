import { Component, input } from '@angular/core';

@Component({
  selector: 'app-label',
  imports: [],
  template: `
    <label [for]="for()" [class]="class()" [class.inline-block]="inline()">
      <ng-content></ng-content>
    </label>
  `,
  styles: ``,
})
export class Label {
  public for = input<string>();
  public class = input<string>();
  public inline = input<boolean>();
}
