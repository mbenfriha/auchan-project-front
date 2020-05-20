import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService, AuthenticationService, AlertService} from '../../_services';
import {Subscription} from 'rxjs';
import {User} from '../../_models';
import {first} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {ActivatedRoute, Router} from '@angular/router';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  currentUser: User;
  selectUser: User;
  currentUserSubscription: Subscription;
  users: [User];
  countHad: number;
  countCat: number;
  returnUrl: string;
  returnU = 'returnUrl';
  typeCoursList=[
    {_id:1, nomCours:'Mathématiques'},
    {_id:2, nomCours:'Français'},
    {_id:3, nomCours:'Histoire-Géographie'},
    {_id:4, nomCours:'Physique-Chimie'},
    {_id:5, nomCours:'Anglais'},
    {_id:6, nomCours:'Espagnol'},
    {_id:7, nomCours:'SVT'},
    {_id:8, nomCours:'Philosophie'},
    {_id:9, nomCours:'Primaire'}
  ];

  dropdownSettings1:IDropdownSettings = {
    singleSelection: true,
    idField: '_id',
    textField: 'nomCours',
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  constructor(
    private form1Builder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.searchForm = this.form1Builder.group({
      typeCours:[{}],
      joursEtheure:[''],
      
    });

  }
  ngOnDestroy(): void {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  get f() { return this.searchForm.controls; }

  onSubmit() {
    console.log(this.f.typeCours.value[0]);

    // stop here if form is invalid
    if (!this.f.typeCours.value) {
      return;
    }
    
    //Compare the school and the mail
    
    this.userService.getTypeCours(this.f.typeCours.value[0].nomCours).subscribe(users => this.users =users);
    console.log(this.users);  
  }

  contactStudent(_index){
    this.selectUser = this.users[_index];
    this.userService.mailSender(this.selectUser.email, this.currentUser.email);

  }
  
}
