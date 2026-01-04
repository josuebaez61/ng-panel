import { Component, contentChild, input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'app-form-field-container',
  imports: [FloatLabel, TranslateModule],
  templateUrl: './form-field-container.html',
  styleUrl: './form-field-container.scss',
})
export class FormFieldContainer {
  public fixedHeight = input<boolean>(true);
  public ngControl = contentChild<NgControl>(NgControl);
}
