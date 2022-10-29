import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './quiz/quiz.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/login/signup/signup.component';
import { AuthGuardService } from './core/auth.guard';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./components/login/login.module').then(
        (LoginFile) => LoginFile.LoginModule
      ),
  },
  { path: 'quiz', component: QuizComponent, canActivate: [AuthGuardService] },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin-panel/admin-panel.module').then(
        (admin => admin.AdminPanelModule)
      ),
    canActivate: [AuthGuardService]
  },
  { path: '**', redirectTo: '/login' },


];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
