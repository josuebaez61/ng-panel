import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonDirective } from 'primeng/button';

export interface PageHeaderConfig {
  title?: string;
  description?: string;
  backRoute?: string;
  showAddButton?: boolean;
  addButtonLabel?: string;
  addButtonIcon?: string;
}

@Component({
  selector: 'app-panel-page-header',
  imports: [TranslateModule, RouterModule, ButtonDirective],
  templateUrl: './panel-page-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelPageHeader {
  // Input properties
  public title = input<string>('');
  public description = input<string>('');
  public backRoute = input<string>('');
  public showAddButton = input<boolean>(false);
  public addButtonLabel = input<string>('common.add');
  public addButtonIcon = input<string>('pi-plus');
  public config = input<PageHeaderConfig>({});

  // Output events
  public addButtonClick = output<void>();
  public backClick = output<void>();

  // Computed signals for better performance
  public hasLeftContent = computed(() => {
    const config = this.config();
    return !!(
      this.title() ||
      this.description() ||
      this.backRoute() ||
      config.title ||
      config.description ||
      config.backRoute
    );
  });

  public hasRightContent = computed(() => {
    const config = this.config();
    return !!(this.showAddButton() || config.showAddButton);
  });

  public effectiveTitle = computed(() => {
    const config = this.config();
    return this.title() || config.title || '';
  });

  public effectiveDescription = computed(() => {
    const config = this.config();
    return this.description() || config.description || '';
  });

  public effectiveBackRoute = computed(() => {
    const config = this.config();
    return this.backRoute() || config.backRoute || '';
  });

  public effectiveAddButtonLabel = computed(() => {
    const config = this.config();
    return this.addButtonLabel() || config.addButtonLabel || 'common.add';
  });

  public effectiveAddButtonIcon = computed(() => {
    const config = this.config();
    return this.addButtonIcon() || config.addButtonIcon || 'pi-plus';
  });

  public effectiveShowAddButton = computed(() => {
    const config = this.config();
    return this.showAddButton() || config.showAddButton || false;
  });
}
