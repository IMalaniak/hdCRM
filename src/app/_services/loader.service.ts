import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
@Injectable()
export class LoaderService {
    public showLoader = new BehaviorSubject(false);
    public isLoaded: Observable<boolean>;

    constructor() {
        this.isLoaded = this.showLoader.asObservable();
    }

    show() {
        this.showLoader.next(true);
    }

    hide() {
        setTimeout(() => {
            this.showLoader.next(false);
        }, 300);
    }
}
