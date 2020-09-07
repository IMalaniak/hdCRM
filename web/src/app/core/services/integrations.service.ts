import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntegrationsService {
  // TODO: @IMalaniak, @ArseniiIrod add logic to work with data from real API

  getGoogleDriveToken(): Observable<string> {
    return of('ThisIsGoogleDriveToken');
  }

  removeGoogleDriveToken(): Observable<boolean> {
    return of(true);
  }
}
