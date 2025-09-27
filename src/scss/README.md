### SCSS Folder

```
scss/
  ├── abstracts/         # Variables, mixins, funciones
  │   ├── _variables.scss
  │   ├── _mixins.scss
  │   ├── _functions.scss
  │   └── _placeholders.scss
  │
  ├── base/              # Reset, tipografía, elementos HTML
  │   ├── _reset.scss
  │   ├── _typography.scss
  │   ├── _forms.scss
  │   └── _base.scss
  │
  ├── layout/            # Grid, header, footer, sidebar
  │   ├── _grid.scss
  │   ├── _header.scss
  │   ├── _footer.scss
  │   └── _sidebar.scss
  │
  ├── components/        # Estilos de componentes reutilizables
  │   ├── _button.scss
  │   ├── _card.scss
  │   ├── _table.scss
  │   └── _modal.scss
  │
  ├── pages/             # Estilos específicos por página
  │   ├── _home.scss
  │   ├── _dashboard.scss
  │   └── _users.scss
  │
  ├── themes/            # Temas (light, dark, etc.)
  │   ├── _light.scss
  │   └── _dark.scss
  │
  ├── vendors/           # Overrides de librerías externas (Material, Bootstrap)
  │   ├── _material.scss
  │   └── _ngx-translate.scss
  │
  ├── utils/             # Helpers, clases utilitarias
  │   ├── _spacing.scss
  │   ├── _visibility.scss
  │   └── _z-index.scss
  │
  └── _index.scss          # Archivo principal que importa todo
```
