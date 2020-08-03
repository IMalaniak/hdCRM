import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public setObject(key: string, value: any) {
    if (value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  public getObject(key: string) {
    const json = localStorage.getItem(key);
    return json ? JSON.parse(json) : undefined;
  }

  public setObjectKeyValue(obj: string, key: string, value: any) {
    let json = this.getObject(obj);
    if (json) {
    } else {
      json = {};
    }
    json[key] = value;
    this.setObject(obj, json);
  }
}
