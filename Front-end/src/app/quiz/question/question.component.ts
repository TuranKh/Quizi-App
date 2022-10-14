import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { questionAnswers } from 'src/app/models/enums/questionAnswer.enum';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit, AfterViewInit {
  @Input() question!: FormGroup<any>;
  @Input() isExamEnd!: boolean;

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  public get questionAnswers(): typeof questionAnswers {
    return questionAnswers;
  }
}
