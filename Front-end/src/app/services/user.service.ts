import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  baseUrl = 'http://localhost:8000/user';
  userId: number = 0;

  logInUser(loginData: any) {
    return this.http.post(`${this.baseUrl}/login`, loginData);
  }

  signUpUser(signUpData: any) {
    return this.http.post(`${this.baseUrl}/signUp`, signUpData);
  }

  updateUserStatus(data: { id: number; status: number }) {
    return this.http.post(`${this.baseUrl}/update-user`, data);
  }

  showStatistics() {
    return this.http.get(this.baseUrl + '/statistics');
  }

  setUserId(userId: number) {
    this.userId = userId;
  }
  getUserId() {
    return this.userId;
  }
  getUserAnswers(userId: number) {
    return this.http.get(this.baseUrl + `/statistics?id=${userId}`)
  }
}
