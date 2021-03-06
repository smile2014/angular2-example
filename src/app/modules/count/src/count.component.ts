import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'count',
    templateUrl: 'count.html'
})

export class CountComponent {

    @Input() initialCount: number;
    @Output() changed: EventEmitter<number> = new EventEmitter<number>();

    private _count: number = 0;
    get count(): number { return this._count; }

    ngOnInit() {
        this._count = this.initialCount;
    }

    onCountClick() {
        this.increment();
    }

    onResetClick() {
        this.reset();
    }

    increment() {
        this._count += 1;
        this.emitChanged();
    }

    reset() {
        this._count = 0;
        this.emitChanged();
    }

    private emitChanged() {
        this.changed.emit(this._count);
    }
}
