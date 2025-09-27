import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hint',
  imports: [CommonModule],
  template: `
    <small class="hint-text">
      <ng-content></ng-content>
    </small>
  `,
  styles: [
    `
      .hint-text {
        font-size: 0.75rem;
        line-height: 1.25rem;
        color: rgb(107 114 128); /* gray-500 */
        display: block;
        transition: all 0.2s ease-in-out;
      }

      :host-context(html.color-scheme-dark) .hint-text {
        color: rgb(156 163 175); /* gray-400 */
      }
    `,
  ],
})
export class Hint {
  @Input()
  public for?: string; // Optional: associate hint with specific control
}
