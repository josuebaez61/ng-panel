import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Label } from '@shared/components/label/label';
import { ControlError } from '@shared/components/control-error/control-error';
import { FormField } from '@shared/components/form-field/form-field';

@NgModule({
  imports: [CommonModule, Label, ControlError, FormField],
  exports: [
    CommonModule,
    ButtonModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    DialogModule,
    SplitButtonModule,
    InputTextModule,
    SelectModule,
    DividerModule,
    InputGroupModule,
    InputGroupAddonModule,
    RippleModule,
    InputMaskModule,
    MessageModule,
    ReactiveFormsModule,
    TranslateModule,
    Label,
    ControlError,
    FormField,
    TooltipModule,
  ],
})
export class SharedModule {}
