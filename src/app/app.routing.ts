import {Routes, RouterModule} from '@angular/router';

import {HomePageComponent} from './components/home/home-page.component';
import {FormPageComponent} from './components/form/form-page.component';
import {TablePageComponent} from './components/table/table-page.component';
import {TabsPageComponent} from './components/tabs/tabs-page.component';

const routes: Routes = [{
    path: '', 
    component: HomePageComponent
}, {
    path: 'form',
    component: FormPageComponent
}, {
    path: 'tabs',
    component: TabsPageComponent
}, {
    path: 'table',
    component: TablePageComponent
}];

export const routing = RouterModule.forRoot(routes);
