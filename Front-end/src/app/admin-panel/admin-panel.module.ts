import { NgModule } from '@angular/core';
import { CreateNewQuizComponent } from './components/create-new-quiz/create-new-quiz.component';
import { AdminPanelComponent } from './admin-panel.component';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { WaitingListComponent } from './components/waiting-list/waiting-list.component';
import { UserStatisticComponent } from './components/user-statistic/user-statistic.component';
import { CommonModule } from '@angular/common';
const routes: Routes = [{
  path: '', component: AdminPanelComponent, children: [
    { path: 'new-quiz', component: CreateNewQuizComponent },
    { path: 'waiting-list', component: WaitingListComponent },
    { path: 'statistics', component: UserStatisticComponent}
  ]
}]


@NgModule({
  declarations: [AdminPanelComponent, CreateNewQuizComponent, WaitingListComponent, UserStatisticComponent],
  imports: [ReactiveFormsModule, RouterModule.forChild(routes), CommonModule],
  exports: [AdminPanelComponent, RouterModule],
})
export class AdminPanelModule { }