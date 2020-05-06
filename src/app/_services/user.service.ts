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

  getAll() {
    return this.http.get<User[]>(this.url + `users`);
  }

  setActive(userId) {
    return this.http.get<User[]>(this.url + `active/` + userId);
  }

}
