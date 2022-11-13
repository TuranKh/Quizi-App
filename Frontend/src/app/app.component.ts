import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private _authService: AuthService) {
    _authService.environment = environment.apiUrl;
    console.log(_authService.environment);
  }
  title = 'quiz-app';
}
