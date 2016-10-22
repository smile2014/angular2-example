import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '@angular/material';

import {CountComponent} from './src/count.component';

@NgModule({
    declarations: [
        CountComponent
    ],
    exports: [
        CountComponent
    ],
    imports: [
        CommonModule,
        MaterialModule
    ],
    providers: [
        
    ]
})
export class CountModule {}
