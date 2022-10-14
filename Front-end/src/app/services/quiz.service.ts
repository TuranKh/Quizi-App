import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private http: HttpClient, private userService: UserService) {}

  baseUrl = 'http://localhost:8000/';

  getQuestions() {
    const userId = this.userService.getUserId();
    return this.http.get(`${this.baseUrl}get-quiz?id=${userId}`);
  }
  getExamDuration() {
    return this.http.get(`${this.baseUrl}duration`);
  }

  submitUserAnswers(answers: any) {
    return this.http.post(`${this.baseUrl}submit-answers`, answers);
  }

  getAnswers() {}
}
