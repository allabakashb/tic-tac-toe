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

  blocks: any;
  count: number = 0;
  dataBlocks: any;
  done: any;
  isOpponent = false;
  visible: any;
  line: any  = {};
  level: string = '';
  length: number = 3;
  maxLength: number;
  winLines: any = {
     diagonal:   { x1: '0', x2: 'this.length50', y1: '0', y2: '280' },
     horizontal: { x1: '0', x2: '100%', y1: '50', y2: '50' },
     vertical:   { x1: '60', x2: '60', y1: '0', y2: '100%' },
     revDiagonal:{ x1: '0', x2: '100%', y1: '100%', y2: '0' }
  };
  NONE: string = 'NONE';
  TIE: string = 'Draw';
  human: string = 'x';
  ai: string = 'o';

  constructor(private dialog: MatDialog) {
    this.reset();
  }

  findWinner(blocks: any): string {

    let winnerFound = true;

    for (let i = 0; i < blocks.length; i++) {

        for (let j = 0; j < blocks[0].length-1; j++) {

            if (blocks[i][j] != blocks[i][j+1]) {

              winnerFound = false;
              break;
            }
        }

        if (winnerFound && blocks[i][0] != '') {

          return blocks[i][0];
        } else {
          winnerFound = true;
        }
    }

    for (let i = 0; i < blocks[0].length; i++) {

      for (let j = 0; j < blocks.length-1; j++) {

        if (blocks[j][i] != blocks[j+1][i]) {

          winnerFound = false;
          break;
        }
      }

      if (winnerFound && blocks[0][i] != '') {

        return blocks[0][i];
      } else {
        winnerFound = true;
      }
    }

    winnerFound = true;
    for (let i = 0; i < this.length-1; i++) {
        if (blocks[i][i] != blocks[i+1][i+1]) {
          winnerFound = false;
          break;
        }
    }

    if (winnerFound && blocks[0][0] != '') {

      return blocks[0][0];
    } else {
      winnerFound = true;
    }

    let i = 0;
    for (let j = this.length-1; j > 0; j--) {
        if (blocks[i][j] != blocks[i+1][j-1]) {
          winnerFound = false;
          break;
        }
        ++i;
    }

    if (winnerFound && blocks[0][this.length-1] != '') {

      return blocks[0][this.length-1];
    }

    return this.count < 9 ? this.NONE : this.TIE;
  }

  newGame(winner?): void {
    const dialogRef = this.dialog.open(LevelSelectorComponent, {
      width: '250px',
      disableClose: true,
      data: { winner: winner ? winner.toUpperCase() : '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.level = result;
      this.reset();
    });
  }

  reset(): void {
    this.blocks = Array.from(Array(this.length), () => Array(this.length).fill(''));
    this.human = 'x';
    this.ai = 'o';
    this.done = false;
    this.isOpponent = false;
    this.visible = Array.from(Array(this.length), () => Array(this.length).fill(false));
    this.line = {};
    this.maxLength = this.length * this.length;
    this.dataBlocks = { x: [], o: [] };
    this.count = 0;
  }

  minimax(blocks, isMaximizing, depth): any {
    let bestMove = {
      rate: -Infinity,
      row: -1,
      col: -1
    };

    if (this.count > 4) {
      let winner = this.findWinner(this.blocks);
      if (winner == this.ai) {
        bestMove.rate = 1;
        return bestMove;
      } else if (winner != this.NONE) {
        bestMove.rate = winner == this.TIE ? 0 : -1;
        return bestMove;
      }
    }

    if (isMaximizing) {
        bestMove.rate = -Infinity;
        for (let i = 0; i < blocks.length; i++) {
          for (let j = 0; j < blocks.length; j++) {
              if (!blocks[i][j]) {
                blocks[i][j] = this.ai;
                ++this.count;
                let move = this.minimax(blocks,false, depth+1);
                --this.count;
                blocks[i][j] = '';
                if (move.rate > bestMove.rate) {
                  bestMove.rate = move.rate;
                  bestMove.row = i;
                  bestMove.col = j;
                }
              }
          }
        }
        return bestMove;
    } else {
      bestMove.rate = Infinity;
      for (let i = 0; i < blocks.length; i++) {
        for (let j = 0; j < blocks.length; j++) {
          if (!blocks[i][j]) {
            blocks[i][j] = this.human;
            ++this.count;
            let move = this.minimax(blocks, true, depth+1);
            --this.count;
            blocks[i][j] = '';
            if (move.rate < bestMove.rate) {
              bestMove.rate = move.rate;
              bestMove.row = i;
              bestMove.col = j;
            }
          }
        }
      }
      return bestMove;
    }
  }

  select(row, col): void {
    if (!this.blocks[row][col] && !this.isOpponent) {
      this.setBlock(row, col);
      this.checkWinner(this.playAi);
    }
  }

  playAi = () => {
    let bestMove = this.getBestMove(this.blocks);
    this.setBlock(bestMove.row, bestMove.col);
    this.checkWinner();
  }

  getBestMove(blocks): any {
    let bestMove;
    if (this.level != 'easy') {
      bestMove = this.minimax(blocks,true, 1);
    } else {
      let row = 0, col = 0;
      while (blocks[row][col]) {
        row = this.random(blocks.length);
        col = this.random(blocks.length);
      }
      bestMove = { row: row, col: col };
    }
    return bestMove;
  }

  random(n): number {
    return Math.floor(Math.random() * n);
  }

  checkWinner(callback?): void {
    if (this.count > 4) {
      let winner = this.findWinner(this.blocks);
      if (winner != this.NONE) {
        setTimeout(() => {
          winner = winner != this.TIE ? winner.concat(' Won') : winner;
          this.newGame(winner);
        });
        return;
      }
    }
    callback && callback();
  }

  setBlock(row, col): void {
    this.blocks[row][col] = this.isOpponent ? this.ai : this.human;
    this.isOpponent = !this.isOpponent;
    this.count++;
  }

  ngOnInit(): void {
    this.newGame();
  }
}
