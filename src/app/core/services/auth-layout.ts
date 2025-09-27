import { Injectable, signal } from '@angular/core';
// import { Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class AuthLayout {
  private _backRoute = signal('');
  public backRoute = this._backRoute.asReadonly();

  /**
   * Set the back route for the auth layout
   * @param backRoute - The back route to set
   */
  public setBackRoute(backRoute: string) {
    this._backRoute.set(backRoute);
  }

  public clearBackRoute() {
    this._backRoute.set('');
  }
}
