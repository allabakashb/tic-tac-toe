import {Component, Inject} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-level-selector',
  templateUrl: './level-selector.component.html',
  styleUrls: ['./level-selector.component.scss']
})
export class LevelSelectorComponent {

  winner: string = '';

  constructor(private dialogRef: MatDialogRef<LevelSelectorComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any) {

      this.winner = data.winner;
  }

  close(level): void {
      this.dialogRef.close(level);
  }
}
