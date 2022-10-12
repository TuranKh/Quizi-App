import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  baseUrl = 'http://localhost:8000/admin';

  sendQuestions(params: any, formData: FormData) {
    return this.http.post(`${this.baseUrl}/send-quiz`, formData, {
      params,
    });
  }
  getWaitingList() {
    return this.http.get(`${this.baseUrl}/waiting-list`);
  }
  updateUserStatus(data: { id: number; status: number }) {
    return this.http.post(`${this.baseUrl}/update-user`, data);
  }
}
