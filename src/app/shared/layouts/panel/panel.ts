import {
  Component,
  output,
  signal,
  inject,
  OnInit,
  OnDestroy,
  computed,
  effect,
} from '@angular/core';
import { Topbar } from '../common/topbar/topbar';
import { RouterModule } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { PanelDrawer } from './panel-drawer/panel-drawer';
import { ResponsiveService } from '../../../core/services/responsive-service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-panel',
  imports: [Topbar, RouterModule, DrawerModule, PanelDrawer],
  templateUrl: './panel.html',
  styleUrl: './panel.scss',
})
export class Panel implements OnInit, OnDestroy {
  private responsiveService = inject(ResponsiveService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  public drawerVisible = signal<boolean>(true);
  public drawerWidth = signal<string>('300px');
  public isModal = computed(() => this.responsiveService.isMobile());

  constructor() {
    // Listen for breakpoint changes and auto-close drawer
    effect(() => {
      if (this.responsiveService.breakpointChanged()) {
        if (this.responsiveService.isCurrentlyMobile()) {
          this.drawerVisible.set(false);
        }
      }
    });
  }

  ngOnInit() {
    // Auto-close drawer on mobile when navigating
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.responsiveService.shouldAutoCloseSidebar()) {
          this.drawerVisible.set(false);
        }
      });

    // Set initial drawer state based on screen size
    this.updateDrawerState();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public toggleSidenav() {
    this.drawerVisible.set(!this.drawerVisible());
  }

  private updateDrawerState() {
    // On mobile, start with drawer closed
    if (this.responsiveService.isMobile()) {
      this.drawerVisible.set(false);
    }
  }
}
