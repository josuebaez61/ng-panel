# Form Error Message Directive

Esta directiva centraliza el manejo de mensajes de error de formularios, mapeando automáticamente los `ValidationError` de Angular con las traducciones de `ngx-translate`.

## Características

- ✅ **Mapeo automático** de errores de validación a traducciones
- ✅ **Soporte para parámetros** en mensajes de error (minlength, maxlength, etc.)
- ✅ **Mensajes personalizados** por campo
- ✅ **Integración con ngx-translate** para internacionalización
- ✅ **Reactive** - se actualiza automáticamente cuando cambian los errores

## Uso Básico

```html
<mat-form-field>
  <mat-label>Email</mat-label>
  <input matInput formControlName="email" type="email">
  <mat-error [appFormErrorMessage]="form.get('email')?.errors">
  </mat-error>
</mat-form-field>
```

## Uso con Mensajes Personalizados

```html
<mat-form-field>
  <mat-label>Password</mat-label>
  <input matInput formControlName="password" type="password">
  <mat-error 
    [appFormErrorMessage]="form.get('password')?.errors"
    [customMessages]="customPasswordMessages">
  </mat-error>
</mat-form-field>
```

```typescript
export class MyComponent {
  customPasswordMessages = {
    'required': 'La contraseña es obligatoria',
    'minlength': 'La contraseña debe tener al menos 8 caracteres'
  };
}
```

## Errores Soportados

La directiva mapea automáticamente los siguientes errores de validación:

| Error | Clave de Traducción | Parámetros |
|-------|-------------------|------------|
| `required` | `form.errors.required` | - |
| `email` | `form.errors.email` | - |
| `minlength` | `form.errors.minlength` | `requiredLength`, `actualLength` |
| `maxlength` | `form.errors.maxlength` | `requiredLength`, `actualLength` |
| `min` | `form.errors.min` | `min`, `actual` |
| `max` | `form.errors.max` | `max`, `actual` |
| `pattern` | `form.errors.pattern` | `pattern` |
| `custom` | `form.errors.custom` | - |

## Traducciones

Las traducciones se encuentran en:

- **Inglés**: `public/i18n/en.json` → `form.errors.*`
- **Español**: `public/i18n/es.json` → `form.errors.*`

### Ejemplo de Traducciones

```json
{
  "form": {
    "errors": {
      "required": "Este campo es requerido",
      "email": "Por favor ingresa un correo electrónico válido",
      "minlength": "La longitud mínima es de {{requiredLength}} caracteres (actual: {{actualLength}})",
      "maxlength": "La longitud máxima es de {{requiredLength}} caracteres (actual: {{actualLength}})",
      "min": "El valor mínimo es {{min}} (actual: {{actual}})",
      "max": "El valor máximo es {{max}} (actual: {{actual}})",
      "pattern": "Formato inválido. Patrón esperado: {{pattern}}",
      "custom": "Valor inválido",
      "generic": "Valor inválido"
    }
  }
}
```

## Ventajas

1. **Consistencia**: Todos los mensajes de error siguen el mismo patrón
2. **Mantenibilidad**: Centraliza la lógica de manejo de errores
3. **Internacionalización**: Integración automática con ngx-translate
4. **Flexibilidad**: Permite mensajes personalizados por campo
5. **Reactive**: Se actualiza automáticamente cuando cambian los errores
6. **Simplicidad**: Solo necesita los errores, no el control completo
7. **Performance**: No requiere suscripciones a observables

## Migración

### Antes (Método Manual)
```html
<mat-error *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
  {{ getFieldError('email') | translate }}
</mat-error>
```

```typescript
getFieldError(fieldName: string): string {
  const field = this.form.get(fieldName);
  if (field?.errors && field.touched) {
    if (field.errors['required']) {
      return 'validation.required';
    }
    if (field.errors['email']) {
      return 'validation.email';
    }
  }
  return '';
}
```

### Después (Con Directiva)
```html
<mat-error [appFormErrorMessage]="form.get('email')?.errors">
</mat-error>
```

## Notas Importantes

- La directiva solo necesita los errores del control, no el control completo
- Se recomienda usar el operador `?.` para acceder a los errores de forma segura
- Los mensajes personalizados tienen prioridad sobre las traducciones automáticas
- La directiva se actualiza automáticamente cuando cambian los errores (OnChanges)
- No requiere suscripciones a observables, mejorando el performance
