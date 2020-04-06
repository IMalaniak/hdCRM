import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() { }

  public setObject(key: string, value: any) {
    if (value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  public getObject(key: string) {
    const json = localStorage.getItem(key);
    if (json === undefined) {
      return undefined;
    }
    return JSON.parse(json);
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
