/*
 * IMPORTS.
 */

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {MaterialModule} from '@angular/material';
import {routing} from './app.routing';

import {AgGridModule} from 'ag-grid-ng2/main';

import {CountModule} from './modules/count';
import {FileManagerModule} from './modules/file-manager';



/*
 * DECLARATIONS.
 */

// Application component.
import {AppComponent} from './app.component';

// Page components.
import {HomePageComponent} from './components/home/home-page.component';
import {FormPageComponent} from './components/form/form-page.component';
import {TablePageComponent} from './components/table/table-page.component';
import {TabsPageComponent} from './components/tabs/tabs-page.component';

// Pipes.
import {SentenceCasePipe} from './pipes/sentence-case.pipe';



/*
 * PROVIDERS.
 */
import {CountMessageService} from './services/count-message.service';



@NgModule({
    declarations: [
        AppComponent,

        HomePageComponent,
        FormPageComponent,
        TablePageComponent,
        TabsPageComponent,

        SentenceCasePipe
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpModule,
        routing,

        MaterialModule.forRoot(),
        AgGridModule.withAotSupport(),

        CountModule,
        FileManagerModule
    ],
    providers: [
        CountMessageService,
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {}
