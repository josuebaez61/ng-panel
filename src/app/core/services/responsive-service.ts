import { Injectable, signal, computed, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  private breakpointObserver = inject(BreakpointObserver);

  // Signals for reactive state management
  private _isMobile = signal<boolean>(false);
  private _isTablet = signal<boolean>(false);
  private _isDesktop = signal<boolean>(false);
  private _screenSize = signal<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('lg');

  // Computed signals
  public isMobile = computed(() => this._isMobile());
  public isTablet = computed(() => this._isTablet());
  public isDesktop = computed(() => this._isDesktop());
  public screenSize = computed(() => this._screenSize());

  // Combined state
  public state = computed<ResponsiveState>(() => ({
    isMobile: this._isMobile(),
    isTablet: this._isTablet(),
    isDesktop: this._isDesktop(),
    screenSize: this._screenSize(),
  }));

  constructor() {
    this.initializeBreakpoints();
  }

  private initializeBreakpoints(): void {
    // Mobile breakpoints
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe((result) => {
      this._isMobile.set(result.matches);
      if (result.matches) {
        this._screenSize.set(result.breakpoints[Breakpoints.XSmall] ? 'xs' : 'sm');
      }
    });

    // Tablet breakpoints
    this.breakpointObserver.observe([Breakpoints.Medium]).subscribe((result) => {
      this._isTablet.set(result.matches);
      if (result.matches) {
        this._screenSize.set('md');
      }
    });

    // Desktop breakpoints
    this.breakpointObserver.observe([Breakpoints.Large, Breakpoints.XLarge]).subscribe((result) => {
      this._isDesktop.set(result.matches);
      if (result.matches) {
        this._screenSize.set(result.breakpoints[Breakpoints.Large] ? 'lg' : 'xl');
      }
    });
  }

  /**
   * Check if the current screen size is mobile or tablet
   */
  public isMobileOrTablet(): boolean {
    return this._isMobile() || this._isTablet();
  }

  /**
   * Get the current window width
   */
  public getCurrentWidth(): number {
    return window.innerWidth;
  }

  /**
   * Check if the sidebar should auto-close on navigation
   * Only closes on mobile devices
   */
  public shouldAutoCloseSidebar(): boolean {
    return this._isMobile();
  }
}
