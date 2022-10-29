import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from 'src/app/services/quiz.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { questionAnswers } from 'src/app/models/enums/questionAnswer.enum';

@Component({
  selector: 'app-user-statistic',
  templateUrl: './user-statistic.component.html',
  styleUrls: ['./user-statistic.component.scss'],
})
export class UserStatisticComponent implements OnInit {
  constructor(
    private userService: UserService,
    private quizService: QuizService,
    private snackbar: SnackbarService
  ) {}

  tableData: any;
  questions: any[] = [];
  attendedQuiz: boolean = false;
  userAnswers: any;

  ngOnInit(): void {
    this.showStatistics();
    this.getExamQuestions();
  }

  showStatistics() {
    this.userService.showStatistics().subscribe((statistics) => {
      this.tableData = statistics;
    });
  }

  getUserAnswers(userId: number, attendedQuiz: number) {
    this.attendedQuiz = attendedQuiz === 1;
    if (attendedQuiz === 0) {
      this.snackbar.openFailureSnackBar(
        'Bu şəxs son imtahanda iştirak etməyib!'
      );
    } else {
      const user = this.tableData.find((user: any) => {
        return user.id === userId;
      });

      this.userAnswers = user.answers.toString();
    }
  }

  getExamQuestions() {
    if (this.questions.length === 0) {
      this.quizService.getQuizView().subscribe((questions: any) => {
        this.questions = questions;
      });
    }
  }

  public get questionAnswers(): typeof questionAnswers {
    return questionAnswers;
  }
}
