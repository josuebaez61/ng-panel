import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ControlError } from '@shared/components/ui/control-error/control-error';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FormField } from '@shared/components/ui/form-field/form-field';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { Label } from '@shared/components/ui/label/label';
import { MessageModule } from 'primeng/message';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { PanelModule } from 'primeng/panel';
import { DialogActions } from '@shared/directives/dialog-actions';
@NgModule({
  imports: [CommonModule, Label, ControlError, FormField, DialogActions],
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
    ConfirmDialogModule,
    TextareaModule,
    PanelModule,
    DialogActions,
  ],
})
export class SharedModule {}
