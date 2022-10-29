import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { QuizService } from '../services/quiz.service';
import { SnackbarService } from '../services/snackbar.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit, AfterViewInit {
  questionsFormArray: FormArray<FormGroup> | null = null;
  examEnd = false;
  timeLeft: any;
  interval: any;
  message = '';
  image: any;
  hasPermission = true;
  currentTime = Date.now();
  userId: number = 0;
  submitButton = true;

  countdown: number | null = null;
  correctAnswers = [];
  scorePercent: number | null = null;

  constructor(
    private fb: FormBuilder,
    private quiz: QuizService,
    private snackBar: SnackbarService,
    private router: Router,
    private userCredentials: UserService
  ) {}

  ngAfterViewInit(): void {}
  ngOnDestroy() {
    clearInterval(this.interval);
  }

  ngOnInit(): void {
    this.currentTime = Date.now();
    this.getAllQuestions();
    this.userId = this.userCredentials.getUserId();
  }

  startCountdown() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.message = new Date(this.timeLeft * 1000)
          .toISOString()
          .substring(11, 19);
        this.timeLeft--;
      } else {
        this.snackBar.openFailureSnackBar('İmtahan müddəti bitdi!', 'Oldu');
        this.submitAnswers();
      }
    }, 1000);
  }

  submitAnswers() {
    this.examEnd = true;
    let userAnswers = '';
    this.questionsFormArray?.value.forEach((question) => {
      if (question.selectedAnswerId) {
        userAnswers += question.selectedAnswerId + '';
      } else {
        userAnswers += '9';
      }
    });

    clearInterval(this.interval);
    const submitAnswers = {
      id: this.userId,
      userAnswers: userAnswers,
    };

    this.quiz.submitUserAnswers(submitAnswers).subscribe((res: any) => {
      this.correctAnswers = res.answers;
      this.scorePercent = res.scorePercent;
      clearInterval(this.interval);
      this.submitButton = false;
    });
  }

  getAllQuestions() {
    const userId = this.userCredentials.getUserId();
    if (userId) {
      this.quiz.getQuestions(userId)?.subscribe(
        (res: any) => {
          if (res.status !== 401 || res.status !== 406) {
            if (res.length !== 0) {
              this.initForm(res);
            } else {
              this.snackBar.openFailureSnackBar(
                'Hal-hazırda aktiv imtahan yoxdur!'
              );
              this.router.navigateByUrl('/login');
            }
          } else {
            this.snackBar.openFailureSnackBar(res.message);
            this.router.navigateByUrl('/login');
          }
        },
        (err) => {
          this.snackBar.openFailureSnackBar(err.error.message);
          this.router.navigateByUrl('/login');
        }
      );
      this.startCountdown();
    } else {
      this.snackBar.openFailureSnackBar('Hesabınıza daxil olun!');
      this.router.navigateByUrl('/login');
    }
  }

  initForm(questions: Array<any>) {
    this.timeLeft = questions[0].duration * 60;
    const questionForms = questions.map((obj, index) => {
      return this.fb.group({
        image: obj.question_image,
        order: index + 1,
        selectedAnswerId: null,
        answerOptions: [['A', 'B', 'C', 'D', 'E']],
      });
    });
    this.questionsFormArray = this.fb.array(questionForms);
  }
}
