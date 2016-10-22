import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class CountMessageService {

    source: Subject<string> = new Subject<string>();
    countMsg$: Observable<string> = this.source.asObservable();

    pushCount(name: string, count: number ) {
        this.source.next(name + ': ' + count.toString());
    }
}
