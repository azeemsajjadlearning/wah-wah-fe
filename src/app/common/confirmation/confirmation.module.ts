import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationDialogComponent } from './dialog/dialog.component';
import { ConfirmationService } from './confirmation.service';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [MatButtonModule, MatDialogModule, MatIconModule, CommonModule],
  providers: [ConfirmationService],
})
export class ConfirmationModule {
  /**
   * Constructor
   */
  constructor(private confirmationService: ConfirmationService) {}
}
