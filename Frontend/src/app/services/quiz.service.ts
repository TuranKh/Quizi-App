import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private http: HttpClient, private userService: UserService) {}

  baseUrl = 'http://65.108.246.46:8000/';
  // baseUrl = 'http://localhost:8000/';

  getQuestions(userId: number) {
    return this.http.get(`${this.baseUrl}get-quiz?id=${userId}`);
  }
  getExamDuration() {
    return this.http.get(`${this.baseUrl}duration`);
  }

  submitUserAnswers(answers: any) {
    // Submit user answers and get correct ones
    return this.http.post(`${this.baseUrl}submit-answers`, answers);
  }

  getQuizView() {
    return this.http.get(`${this.baseUrl}get-quiz-view`);
  }
}
