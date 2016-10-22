import {Component} from '@angular/core';
import {CountMessageService} from '../../services/count-message.service';

@Component({
    selector: 'tabs-page',
    templateUrl: 'tabs-page.html'
})

export class TabsPageComponent {

    initialCount: number = this.countMessageService.count;

    constructor(
        private countMessageService: CountMessageService
    ) {}

    onCountChanged(count) {
        this.countMessageService.pushCount(count);
    }
}
