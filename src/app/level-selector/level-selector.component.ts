import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-level-selector',
  templateUrl: './level-selector.component.html',
  styleUrls: ['./level-selector.component.scss']
})
export class LevelSelectorComponent {

  constructor(private dialogRef: MatDialogRef<LevelSelectorComponent>) {

  }

  close(level): void {
      this.dialogRef.close(level);
  }
}
