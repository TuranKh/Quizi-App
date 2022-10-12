import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private http: HttpClient) {}

  baseUrl = 'http://localhost:8000/';

  getQuestions() {
    return this.http.get(`${this.baseUrl}get-quiz`);
  }
  getExamDuration() {
    return this.http.get(`${this.baseUrl}duration`);
  }

  submitUserAnswers(answers: any) {
    return this.http.post(`${this.baseUrl}submit-answers`, answers);
  }
}
