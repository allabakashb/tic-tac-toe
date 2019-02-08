import {Component, enableProdMode} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fade-in', [
      transition(':enter', [
        style({ opacity: '0'}),
        animate(2000)]),
    ]),
    trigger('stretch', [
      transition(':enter', [
        style({ transform: 'scale(1)'}),
        animate(700)]),
    ])
  ]
})
export class AppComponent {

  blocks: any = Array.from(Array(3), () => Array(3).fill(''));
  current: any = 'x';

  constructor() {
    console.log(this.blocks);
  }

  select(row, col): void {
    if (!this.blocks[row][col]) {
      this.blocks[row][col] = this.current;
      this.current = this.current === 'x' ? 'o' : 'x';
    }
  }

}
