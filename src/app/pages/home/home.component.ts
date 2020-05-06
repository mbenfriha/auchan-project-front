import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService, AuthenticationService} from '../../_services';
import {Subscription} from 'rxjs';
import {User} from '../../_models';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: User;
  currentUserSubscription: Subscription;
  users: User[] = [];
  countHad: number;
  countCat: number;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

}
