import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable()
export class TranslationsService {
  private _globalTranslations: string[];

  public get globalTranslations(): string[] {
    return this._globalTranslations;
  }
  public set globalTranslations(value: string[]) {
    this._globalTranslations = value;
  }

  constructor(
    public translate: TranslateService
  ) { }

  getTranslations(codes: string[]): Observable<string[]> {
    return this.translate.get(codes).pipe(
            // tap(transitions => this.messageService.add(`Translations Fetched`))
          );
  }

  initGlobalTranslations(codes: string[]) {
    this.getTranslations(codes).subscribe((translations: string[]) => {
      this._globalTranslations = translations;
  });
  }

}
