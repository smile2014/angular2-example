import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'sentenceCase'})
export class SentenceCasePipe implements PipeTransform {

    transform(word: string): string {
        if (word === null || word === '' || typeof word === 'undefined') {
            return '';
        }
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    }
}