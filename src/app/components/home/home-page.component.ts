import {Component} from '@angular/core';
import {CountMessageService} from '../../services/count-message.service';

@Component({
    selector: 'home-page',
    templateUrl: 'home-page.html'
})

export class HomePageComponent {

    initialCount: number = this.countMessageService.count;

    constructor(
        private countMessageService: CountMessageService
    ) {}

    onCountChanged(count) {
        this.countMessageService.pushCount(count);
    }
}
