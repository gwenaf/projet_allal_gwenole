import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserData {
  id?: number;
  gender?: string;
  lastname?: string;
  firstname: string;
  address?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = '/auth';
  private localUser: UserData | null = null;

  constructor(private http: HttpClient) {}

  loadUserFromLocalStorage(): void {
    const userString = localStorage.getItem('user');
  
    if (userString) {
      try {
        this.localUser = JSON.parse(userString);
      } catch (error) {
        console.error('Error while parsing user details in the localstorage :', error);
        this.localUser = null;
      }
    } else {
      console.warn('No userdata in the localstorage');
      this.localUser = null;
    }
  }

  getLocalUser(): UserData | null {
    return this.localUser;
  }

  saveUserToLocalStorage(user: UserData): void {
    this.localUser = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserFromBackend(): Observable<UserData> {
    return this.http.get<UserData>(`${this.apiUrl}/me`);
  }

  updateUserById(userId: number, data: Partial<UserData>): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put(`${this.apiUrl}/update`, data, { headers });
  }
}
