import { Component, OnInit } from '@angular/core';
import {first} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertService, AuthenticationService, UserService} from '../../_services';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  school = null;
  validSchool = false;
  ecoles = [
    {name: "ESSCA", domaine: "@essca.fr"},
    {name:"ESSEC Business School", domaine:"@essec.fr"},
    {name:"EXCELIA ESC LA ROCHELLE",	domaine:"@excelia-group.com"},
    {name:"Y SCHOOLS (ESC TROYES)", domaine:"@get-mail.fr"},
    {name:"HEC PARIS",domaine:"@hec.fr"},
    {name:"IAE AIX MARSEILLE",	domaine:"@iae-aix.com"},
    {name:"IAE Lille",	domaine:"@iaelille.fr"},
    {name:"ICAM", 	domaine:"@icam.fr"},
    {name:"FACULTE DE GESTION INSTITUT CATHOLIQUE DE LILLE", 	domaine:"@icl-lille.fr"},
    {name:"ICN BUSINESS SCHOOL",	domaine:"@icn-groupe.fr"},
    {name:"IESEG School of Management",	domaine:"@ieseg.fr"},
    {name:"INSEEC School of Business & Economics",	domaine:"@inseec.com"},
    {name:"IPAG",	domaine:"@ipag,fr"},
    {name:"ISARA", 	domaine:"@isara.fr"},
    {name:"ISC PARIS",	domaine:"@iscparis.com"},
    {name:"ISEG",	domaine:"@iseg.fr"},
    {name:"ISEMA", 	domaine:"@isema.fr"},
    {name:"ISEN", 	domaine:"@isen-lille.fr"},
    {name:"ISG",	domaine:"@isg.fr"},
    {name:"ISTC  Lille", 	domaine:"@istc.fr"},
    {name:"ISTEC",	domaine:"@istec.fr"}, 
    {name:"IUT TOULOUSE", 	domaine:"@iut-tlse3.fr"},
    {name:"KEDGE Business School",	domaine:"@kedgebs.com"}, 
    {name:"UniLaSalle",	domaine:"@lasalle-beauvais.fr"},
    {name:"Ecole des mines Nancy",	domaine:"@mines-nancy.univ-lorraine.fr"},
    {name:"MONTPELLIER BUSINESS SCHOOL", domaine: "@montpellier-bs.com"}, 
    {name:"NEOMA BUSINESS SCHOOL EESC", domaine:	"@neoma-bs.fr"},
    {name:"Ecole d'ingénieurs de Purpan", domaine:	"@purpan.fr"},
    {name:"Sciences Po Paris", domaine:	"@sciencespo.fr"},
    {name:"SKEMA BUSINESS SCHOOL", domaine:	"@skema.edu"},
    {name:"Montpellier SupAgro - Institut Agro", domaine:	"@supagro.fr"},
    {name:"SUP DE VENTE", domaine:	"@supdevente.fr"},
    {name:"Toulouse School of Management", domaine:	"@tsm-education.fr"},
    {name:"Polytech Clermont", domaine:	"@uca.fr"},
    {name:"IUT de  Cergy-Pontoise", domaine:	"@u-cergy.fr"},
    {name:"INSTITUT MONTPELLIER MANAGEMENT MOMA", domaine:	"@umontpellier.fr"},
    {name:"IUT du Limousin Distrisup", domaine:	"@unilim.fr"},
    {name:" IUT Aix-Marseille", domaine: "	@univ-amu.fr"},
    {name:"IUT ANGERS ( Distrisup °", domaine:	"@univ-angers.fr"},
    {name:"ESPAS ESTICE", domaine:	"@univ-catholille.fr"},
    {name:"Université Côte d'Azur (ex Université de Nice Sophia Antipolis)", domaine:	"@univ-cotedazur.fr"},
    {name:"FFBC-IMMD", domaine:	"@univ-lille.fr"},
    {name:"IAE Nancy", domaine:	"@univ-lorraine.fr"},
    {name:"ENSAIA Nancy", domaine:	"@univ-lorraine.fr"}, 
    {name:"iaelyon Université Jean Moulin", domaine:	"@univ-lyon3.fr"},
    {name:"Université de Rouen", domaine:	"@univ-rouen.fr"},    
    {name:"IAE TOURS", domaine:	"@univ-tours.fr"},
    {name:"Iut SENART", domaine:	"@u-pec.fr"},
    {name:"IAE Valenciennes", domaine:	"@uphf.fr"},
    {name:"HEI", domaine:	"@yncrea.fr"},
    {name:"IDRAC Business School", domaine:	"@idrac.fr"},
    {name:"ASCENCIA BUSINESS SCHOOL", domaine:	"@ascencia.fr"},
    {name:"ECEMA", domaine:	"@ecema.fr"},
    {name:"IFAG", domaine:	"@ifag.fr"},
    {name:"ISA", domaine:	"@isa.fr"},
    {name:"GRENOBLE EM", domaine: "@grenobleem.fr"},
    {name:"EPSI", domaine: "@epsi.fr"},	
    {name:"Groupe IGS", domaine: "@groupeigs.fr"},	
    {name:"EKLYA School of Business", domaine:	"@eklya.fr"},
    {name:"IAE de DIJON", domaine:	"@iaedijon.fr"},
    {name:"ESG-PSB", domaine: "@esg.fr"},	
    {name:"IAE Paris - Sorbonne Business School", domaine:	"@univ-paris1.fr"},
  ];
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
  
  lesNiveaux=[
    {classe:1, nomClasse:"Primaire"},
    {classe:2, nomClasse:"6ème"},
    {classe:3, nomClasse:"5ème"},
    {classe:4, nomClasse:"4ème"},   
    {classe:5, nomClasse:"3ème"},
    {classe:6, nomClasse:"2nde"},
    {classe:7, nomClasse:"1ère"},
    {classe:8, nomClasse:"Terminale"}
  ];

  dropdownSettings1:IDropdownSettings = {
    singleSelection: false,
    idField: '_id',
    textField: 'nomCours',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  dropdownSettings2:IDropdownSettings = {
    singleSelection: false,
    idField: 'classe',
    textField: 'nomClasse',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }

    console.log(this.ecoles);
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required, Validators.email],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]],
      school: [{}],
      selected: ['parent', Validators.required],
      nbreDenfants:[],
      selectedItems:[[],Validators.required],
      selectedItems1:[[], Validators.required],
      dateHeure:[[], Validators.required]
    });
  }
  checkSchool(){
    console.log(this.f.school.value.domaine, this.f.email.value, this.f.email.value.match('^[A-Za-z0-9._%+-]+' + this.f.school.value.domaine + '$'
    ));
    if (this.f.email.value.match('^[A-Za-z0-9._%+-]+' + this.f.school.value.domaine + '$'
    )) {
      this.validSchool = true;
    } 
    else{
      this.validSchool = false;
    }
  }



  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    console.log(this.f.dateHeure.value);
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    //Compare the school and the mail
    if(this.f.selected.value =='etudiant'){
      if(!this.validSchool){
        return;
      }
    }


    this.loading = true;
    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Registration successful', true);
          this.router.navigate(['/login']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

}
