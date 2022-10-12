import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  openSuccessSnackBar(message: string = 'Əməliyyat uğurla baş tutdu!') {
    this.snackBar.open(message, "Oldu", {
      duration: 3000,
      panelClass: ['green-snackbar', 'login-snackbar'],
    });
  }
  openFailureSnackBar(message: string = 'Xəta baş verdi!', action: string = "Yenidən cəhd edin!") {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['red-snackbar', 'login-snackbar'],
    });
  }
}
