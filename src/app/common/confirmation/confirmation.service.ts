import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './dialog/dialog.component';
import { ConfirmationConfig } from './confirmation.types';
import { merge } from 'lodash-es';

@Injectable()
export class ConfirmationService {
  private _defaultConfig: ConfirmationConfig = {
    title: 'Confirm action',
    message: 'Are you sure you want to confirm this action?',
    icon: {
      show: true,
      name: 'error',
      color: 'basic',
    },
    actions: {
      confirm: {
        show: true,
        label: 'Confirm',
        color: 'primary',
      },
      cancel: {
        show: true,
        label: 'Cancel',
      },
    },
    dismissible: false,
  };

  /**
   * Constructor
   */
  constructor(private _matDialog: MatDialog) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  open(
    config: ConfirmationConfig = {}
  ): MatDialogRef<ConfirmationDialogComponent> {
    // Merge the user config with the default config
    const userConfig = merge({}, this._defaultConfig, config);

    // Open the dialog
    return this._matDialog.open(ConfirmationDialogComponent, {
      autoFocus: false,
      disableClose: !userConfig.dismissible,
      data: userConfig,
      panelClass: 'fuse-confirmation-dialog-panel',
      maxWidth: '600px',
    });
  }
}
