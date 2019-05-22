import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {MatDialog} from '@angular/material';
import {LevelSelectorComponent} from './level-selector/level-selector.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fade-in', [
      transition(':enter', [
        style({ opacity: '0'}),
        animate(2000)]),
    ])
  ]
})
export class AppComponent implements OnInit{

  activeBox: any;
  activeBlocks: any = [];
  blocks: any;
  count: number = 0;
  current: any;
  dataBlocks: any;
  done: any;
  isOpponentPlayed = true;
  visible: any;
  line: any  = {};
  level: string = '';
  length: number = 3;
  maxLength: number;
  winIndices: any;
  winLines: any = {
     diagonal:   { x1: '0', x2: 'this.length50', y1: '0', y2: '280' },
     horizontal: { x1: '0', x2: '100%', y1: '50', y2: '50' },
     vertical:   { x1: '60', x2: '60', y1: '0', y2: '100%' },
     revDiagonal:{ x1: '0', x2: '100%', y1: '100%', y2: '0' }
  };
  
  constructor(private dialog: MatDialog) {
    this.reset();
  }

  checkValid(index, opponent): boolean {
    return index > -1 &&
    !this.dataBlocks[opponent].includes(index) &&
    this.dataBlocks[this.current].includes(index)
  }

  isGameOver(row, col): boolean {
    let opponent = this.current === 'x' ? 'o' : 'x';
    let current = (row * this.length) + col;

    let top = ((row + 1) * this.length) + col;
    let right = (row * this.length) + col + 1;
    let bottom = ((row - 1) * this.length) + col;
    let left = (row * this.length) + col - 1;

    if (this.checkValid(top, opponent)) {

    }


    return false;
  }

  newGame(): void {
    const dialogRef = this.dialog.open(LevelSelectorComponent, {
      width: '250px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.level = result;
      this.reset();
      console.log(result);
    });
  }

  reset(): void {
    this.activeBox = {};
    this.activeBlocks = [];
    this.blocks = Array.from(Array(this.length), () => Array(this.length).fill(''));
    this.current = 'x';
    this.done = false;
    this.isOpponentPlayed = true;
    this.visible = Array.from(Array(this.length), () => Array(this.length).fill(false));
    this.line = {};
    this.maxLength = this.length * this.length;
    this.dataBlocks = { x: [], o: [] };
    for (let i = 0; i < this.maxLength; i++) {
      this.activeBlocks.push(i);
    }
  }

  select(row, col): void {
    if (!this.blocks[row][col] && this.isOpponentPlayed) {
      if (this.count > 4 && this.isGameOver(row, col)) {
        alert(this.current);
        return;
      }
      this.setBlock(row, col);
      this.activeBlocks.splice(this.activeBlocks.indexOf((row * this.length) + col), 1);
      this.isOpponentPlayed = false;
      this.visible[row][col] = true;
      if (this.activeBlocks.length > 0) {
        setTimeout(() => {
          const nextBlock = this.activeBlocks.splice(Math.floor(Math.random() * (this.activeBlocks.length - 1)), 1)[0];
          row = Math.floor(nextBlock / this.length);
          col = nextBlock % this.length;
          if (this.count > 4 && this.isGameOver(row, col)) {
            alert(this.current);
            return;
          }
          this.setBlock(row, col);
          this.isOpponentPlayed = true;
        }, 500);
      }
    }
  }

  setBlock(row, col): void {
    this.blocks[row][col] = this.current;
    this.current = this.current === 'x' ? 'o' : 'x';
    this.activeBox = {
      x: row,
      y: col
    };
    this.dataBlocks[this.current].push((row * this.length) + col);
    this.count++;
  }

  ngOnInit(): void {
    this.newGame();
  }

}
