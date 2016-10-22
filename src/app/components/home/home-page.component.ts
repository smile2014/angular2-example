import {Component} from '@angular/core';
import {CountMessageService} from '../../services/count-message.service';

@Component({
    selector: 'home-page',
    templateUrl: 'home-page.html'
})

export class HomePageComponent {

    countName: string = 'Home';

    constructor(
        private countMessageService: CountMessageService
    ) {}

    onCountChanged(count) {
        this.countMessageService.pushCount(this.countName, count);
    }
}
