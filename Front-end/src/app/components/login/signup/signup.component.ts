import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent implements OnInit {
  signupForm: any;

  constructor(
    private userCredentials: UserService,
    private _router: Router,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('^((\\+994-?)|0)?[0-9]{9}$'),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      surname: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      isAdmin: new FormControl(false),
    });
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get name() {
    return this.signupForm.get('name');
  }

  get surname() {
    return this.signupForm.get('surname');
  }

  get phoneNumber() {
    return this.signupForm.get('phoneNumber');
  }

  createNewAccount() {
    if (this.signupForm.valid) {
      this.submitEM.emit(this.signupForm.value);

      this.userCredentials
        .signUpUser(this.signupForm.value)
        .subscribe((res: any) => {
          if (res.status) {
            this.snackBar.openFailureSnackBar(
              res.message,
              'Yenidən cəhd edin!'
            );
          } else {
            this.snackBar.openSuccessSnackBar('Hesab uğurla yaradıldı!');
            this._router.navigateByUrl('/login');
          }
        });
    } else {
      this.snackBar.openFailureSnackBar('Xanalar düzgün doldurulmayıb!');
    }
  }

  @Output() submitEM = new EventEmitter();
}
