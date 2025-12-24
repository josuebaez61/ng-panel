import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class TranslateTestingLoader implements TranslateLoader {
  public getTranslation(_lang: string): Observable<any> {
    return of({});
  }
}
