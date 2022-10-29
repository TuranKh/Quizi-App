import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuizComponent } from './quiz/quiz.component';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { SignupComponent } from './components/login/signup/signup.component';
import { LoginModule } from './components/login/login.module';
import { QuestionComponent } from './quiz/question/question.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { AdminPanelModule } from './admin-panel/admin-panel.module';
import { MatDialogModule } from '@angular/material/dialog';
import { InformationBarModule } from './shared/information-bar/information-bar.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    SignupComponent,
    QuestionComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    LoginModule,
    DragDropModule,
    HttpClientModule,
    AdminPanelModule,
    MatDialogModule,
    InformationBarModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
