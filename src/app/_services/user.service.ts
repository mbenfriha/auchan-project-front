import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../_models';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.API_URL;
  constructor(private http: HttpClient) { }
  register(user: User) {
    return this.http.post(this.url + `register`, user);
  }

  mailSender(emailStudent, emailParent) {
    return this.http.post(this.url + `mail`, emailStudent, emailStudent);
  }

  getAll() {
    return this.http.get<User[]>(this.url + `users`);
  }
  getAllStudent() {
    return this.http.get<User[]>(this.url + `users/student`);
  }
  getTypeCours(typeCours) {
    return this.http.get<[User]>(this.url + `users/` + typeCours);
  }

  setActive(userId) {
    return this.http.get<User[]>(this.url + `active/` + userId);
  }

}
