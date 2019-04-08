import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
@Injectable()
export class LoaderService {
    private showDataLoader: BehaviorSubject<boolean>;
    private dataIsLoaded: BehaviorSubject<boolean>;
    public isLoaded: Observable<boolean>;
    public showLoader: Observable<boolean>;

    constructor() {
        this.showDataLoader = new BehaviorSubject(false);
        this.dataIsLoaded = new BehaviorSubject(false);
        this.isLoaded = this.dataIsLoaded.asObservable();
        this.showLoader = this.showDataLoader.asObservable();
    }

    show() {
        this.showDataLoader.next(true);
        this.dataIsLoaded.next(false);
    }

    hide() {
        setTimeout(() => {
            this.showDataLoader.next(false);
            this.dataIsLoaded.next(true);
        }, 300);
    }
}
