import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {Subscription} from 'rxjs/Subscription';

import {CountMessageService} from './services/count-message.service';

@Component({
    selector: 'app',
    templateUrl: 'app.html'
})

export class AppComponent implements OnInit, OnDestroy {

    private HEADER_HEIGHT: number = 64;

    @ViewChild('sidebar') sidebar;
    private height: number;

    countSub: Subscription;
    countMessage: string = '';

    constructor(
        private countMessageService: CountMessageService,
        private router: Router
    ) {}

    /***************************************************************************
     * Event handlers.
     **************************************************************************/

    ngOnInit() {
        this.onWindowResize();
        this.countSub = this.countMessageService.count$.subscribe((cnt) => {
            this.countMessage = cnt.toString();
        });
    }

    ngOnDestroy() {
        this.countSub.unsubscribe();
    }

    onSidebarToggleClick() {
        this.sidebar.toggle();
    }

    onWindowResize() {
        this.height = window.innerHeight - this.HEADER_HEIGHT;
    }

    onHomeClick() {
        this.router.navigate(['/']);
        this.sidebar.close();
    }

    onFormClick() {
        this.router.navigate(['/form']);
        this.sidebar.close();
    }

    onTabsClick() {
        this.router.navigate(['/tabs']);
        this.sidebar.close();
    }
}
