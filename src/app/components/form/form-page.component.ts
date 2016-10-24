import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'form-page',
    templateUrl: 'form-page.html'
})

export class FormPageComponent implements OnInit {

    form: FormGroup;

    lastSubmittedName: string;
    lastSubmittedAmount: number;

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl('', Validators.required),
            amount: new FormControl('', Validators.required)
        });
    }

    onFormSubmit() {
        this.lastSubmittedName = this.form.controls['name'].value;
        this.lastSubmittedAmount = this.form.controls['amount'].value;
    }
}
