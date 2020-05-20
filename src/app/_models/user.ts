export class User {
  _id: string;
  email: string;
  username: string;
  password: string;
  token: string;
  role: string;
  active: boolean;
  documents: [];
  horaires: [];
  nbreDenfants: Number;
  cours: [];
  niveaux: [];
}
