import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class CountMessageService {

    count: number = 0;

    source: Subject<number> = new Subject<number>();
    count$: Observable<number> = this.source.asObservable();

    pushCount(count: number) {
        this.count = count;
        this.source.next(this.count);
    }

}
