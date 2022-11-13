import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { questionAnswers } from 'src/app/models/enums/questionAnswer.enum';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit, AfterViewInit {
  @Input() question!: FormGroup<any>;
  @Input() isExamEnd!: boolean;
  @Input() correctAnswer!: number;

  correction = 'none';
  constructor(private _authService: AuthService) {}
  environment = this._authService.environment;
  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  public get questionAnswers(): typeof questionAnswers {
    return questionAnswers;
  }
}
