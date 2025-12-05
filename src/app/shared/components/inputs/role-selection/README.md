# RoleSelection Component

A reusable Angular component for selecting roles with support for both single and multiple selection modes. Implements `ControlValueAccessor` for seamless integration with Angular reactive forms.

## Features

- ✅ **ControlValueAccessor implementation** - Works with reactive forms
- ✅ **Single and multiple selection modes**
- ✅ **Search/Filter functionality**
- ✅ **Disabled state support**
- ✅ **TypeScript support with proper typing**
- ✅ **Accessibility features**

## Usage

### Basic Usage

```html
<app-role-selection [roles]="availableRoles" [multiple]="false" formControlName="selectedRole" />
```

### With Reactive Forms

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({...})
export class MyComponent {
  userForm: FormGroup;
  availableRoles: Role[] = [...];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      singleRole: [null, Validators.required],
      multipleRoles: [[], Validators.required],
    });
  }
}
```

```html
<form [formGroup]="userForm">
  <!-- Single selection -->
  <app-role-selection [roles]="availableRoles" [multiple]="false" formControlName="singleRole" />

  <!-- Multiple selection -->
  <app-role-selection [roles]="availableRoles" [multiple]="true" formControlName="multipleRoles" />
</form>
```

## API

### Inputs

| Property   | Type      | Default | Description               |
| ---------- | --------- | ------- | ------------------------- |
| `roles`    | `Role[]`  | `[]`    | Array of roles to display |
| `multiple` | `boolean` | `false` | Enable multiple selection |

### Outputs

| Event           | Type                     | Description                    |
| --------------- | ------------------------ | ------------------------------ |
| `ngModelChange` | `Role \| Role[] \| null` | Emitted when selection changes |

### Methods

| Method             | Return Type | Description                   |
| ------------------ | ----------- | ----------------------------- |
| `clearSelection()` | `void`      | Clears current selection      |
| `selectedRoles`    | `Role[]`    | Get selected roles as array   |
| `hasSelection`     | `boolean`   | Check if any role is selected |

## Examples

### Single Selection

```html
<app-role-selection [roles]="roles" [multiple]="false" [(ngModel)]="selectedRole" />
```

### Multiple Selection

```html
<app-role-selection [roles]="roles" [multiple]="true" [(ngModel)]="selectedRoles" />
```

### Listening to ngModelChange Events

```html
<!-- Single selection with change listener -->
<app-role-selection
  [roles]="availableRoles"
  [multiple]="false"
  [(ngModel)]="selectedRole"
  (ngModelChange)="onRoleChange($event)"
/>

<!-- Multiple selection with change listener -->
<app-role-selection
  [roles]="availableRoles"
  [multiple]="true"
  [(ngModel)]="selectedRoles"
  (ngModelChange)="onRolesChange($event)"
/>
```

```typescript
export class MyComponent {
  selectedRole: Role | null = null;
  selectedRoles: Role[] = [];

  onRoleChange(role: Role | null): void {
    console.log('Role changed:', role);
    // Handle single role change
  }

  onRolesChange(roles: Role[] | null): void {
    console.log('Roles changed:', roles);
    // Handle multiple roles change
  }
}
```

### With Reactive Forms and Change Listeners

```html
<form [formGroup]="userForm">
  <app-role-selection
    [roles]="availableRoles"
    [multiple]="false"
    formControlName="role"
    (ngModelChange)="onFormRoleChange($event)"
  />
</form>
```

```typescript
export class MyComponent {
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      role: [null, Validators.required],
    });
  }

  onFormRoleChange(role: Role | null): void {
    console.log('Form role changed:', role);
    // Handle form role change
  }
}
```

### With Form Validation

```typescript
this.form = this.fb.group({
  role: [null, Validators.required],
  roles: [[], [Validators.required, this.customValidator]],
});
```

## Styling

The component uses PrimeNG's Listbox component and can be styled using CSS classes:

```css
app-role-selection {
  .p-listbox {
    width: 100%;
  }
}
```

## Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- Focus management
