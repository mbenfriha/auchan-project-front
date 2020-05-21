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
    updateForm: FormGroup;
    passwordForm: FormGroup;
    currentUser: User;
    selectUser: User;
    submittedP =  false;
    currentUserSubscription: Subscription;
    users: User[];
    countHad: number;
    countCat: number;
    returnUrl: string;
    returnU = 'returnUrl';
    loading = false;
    count = {student: 0, parent: 0, contact: 9};

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

    dropdownSettingsCours:IDropdownSettings = {
        singleSelection: false,
        idField: '_id',
        textField: 'nomCours',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
    };

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
        private formBuilder: FormBuilder,
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
        this.searchForm = this.formBuilder.group({
            typeCours:[{}],
            joursEtheure:[''],

        });

        this.updateForm = this.formBuilder.group({
            selectedItems:[this.currentUser.cours,Validators.required],
        });

        this.passwordForm = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            password2: ['', [Validators.required, Validators.minLength(6)]],
        });

        // si parent connecté on charge tout les étudiants
        if(this.currentUser.role == "parent") {
            this.loadAllStuend();
        }

        // si admin connecté on charge tout les utilisateurs
        if(this.currentUser.role == "admin") {
            this.loadAllUsers();
            this.loadCount();
            console.log('admin');
        }
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => this.users = users);
    }

    private loadAllStuend() {
        this.userService.getAllStudent().subscribe(users => this.users = users);
    }

    private loadCount() {
      this.userService.getCount().subscribe(count => this.count = count)
    }
    ngOnDestroy(): void {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    get f() { return this.searchForm.controls; }
    get formS() { return this.updateForm.controls; }
    get formP() { return this.passwordForm.controls; }

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

    contactStudent(user){
        this.loading = true;

        console.log("send mail" + user.email);
        this.userService.mailSender(user.email, this.currentUser.email)
            .subscribe(
                data => {
                    this.alertService.success('Votre prise de contacte a bien été envoyé !')
                    this.loading = false;
                },
                error => {
                    this.alertService.error('Une erreur est survenue : ' + error);
                    this.loading = false;
                });
    }


    updateCourStudent() {
        this.loading = true;

      this.userService.update({cours: this.formS.selectedItems.value}).subscribe(
          (user : User) => {
            this.currentUser.cours = user.cours;
              localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
              this.alertService.success('Cours mis à jours')
              this.loading = false;

          },
              err => {
                  this.alertService.error('Une erreur est survenue : ' + err);
                  this.loading = false;
              });
    }


    updatePassword() {
        this.loading = true;
        this.submittedP = true;

        if(this.formP.password.value !== this.formP.password2.value) {
            this.alertService.error('Les mots de passe ne correspondent pas');
            this.loading = false;
        } else {
          this.userService.update({password: this.formP.password.value}).subscribe(
              (user: User) => {
                  this.alertService.success('Mot de passe mis à jours')
                  this.loading = false;
              })
        }
    }

    setActiveUser(userId) {
        this.userService.setActive(userId).pipe(first()).subscribe(users => {
            this.loadAllUsers();
        });
    }
}
