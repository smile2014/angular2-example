import {Component} from '@angular/core';
import {CountMessageService} from '../../services/count-message.service';

@Component({
    selector: 'tabs-page',
    templateUrl: 'tabs-page.html'
})

export class TabsPageComponent {

    countName: string = 'Tabs';

    constructor(
        private countMessageService: CountMessageService
    ) {}

    onCountChanged(count) {
        this.countMessageService.pushCount(this.countName, count);
    }
}
