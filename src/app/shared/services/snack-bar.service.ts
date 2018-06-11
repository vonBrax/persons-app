import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable()
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  show(message: string, action?: string, duration?: number): MatSnackBarRef<any> {
    return this.snackbar.open(message, action, { duration });
  }
}
