import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { InformationBarComponent } from 'src/app/shared/information-bar/information-bar.component';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: any;

  constructor(
    private userCredentials: UserService,
    private _router: Router,
    private matDialog: MatDialog,
    private _snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  submit() {
    if (this.loginForm.valid) {
      this.submitEM.emit(this.loginForm.value);
    }
    this.login();
  }
  login() {
    if (this.loginForm.valid) {
      this.userCredentials.logInUser(this.loginForm.value).subscribe(
        (res: any) => {
          if (res.success) {
            this.userCredentials.setUserId(res.id);
            localStorage.setItem('token', res.token);
            this._snackbar.openSuccessSnackBar('Uğurla login oldunuz!');
            if (res.userRole === 1) {
              this._router.navigateByUrl('/admin');
            } else {
              this._router.navigateByUrl('/quiz');
            }
          } else {
            this._snackbar.openFailureSnackBar('Email və ya şifrə səhvdir');
          }
        },
        (error) => {
          error.message;
        }
      );
    } else {
      this._snackbar.openFailureSnackBar('Xanalar düzgün doldurulmayıb!');
    }
  }

  @Output() submitEM = new EventEmitter();
}
