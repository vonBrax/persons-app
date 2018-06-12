import { Injectable } from '@angular/core';
// import { PersonService, SnackbarService } from './';
import { HttpClient } from '@angular/common/http';

import { Person } from '../classes/person.class';
import { BehaviorSubject } from 'rxjs';

declare interface ServerResponse {
  action: string;
  message: string;
}

@Injectable()
export class PersonBEService {
  _persons: Person[];
  data: BehaviorSubject<Person[] | undefined> = new BehaviorSubject<Person[] | undefined>(undefined);

  constructor(private http: HttpClient) {
    this.loadPersons();
  }

  loadPersons() {
    this.http.get('http://localhost:3000/api/persons').subscribe(data => {
      this._persons = data as Person[];
      this.data.next(this._persons);
    });
  }

  add(person: Person): any {
    return this.http.post('http://localhost:3000/api/persons', { person }).subscribe((res: ServerResponse) => {
      if (res.message === 'success') {
        this._persons.push(person);
        this.data.next(this._persons);
        return true;
      }
    });
  }

  delete(person: Person) {
    this.http
      .delete(`http://localhost:3000/api/persons/${encodeURIComponent(person.name)}`)
      .subscribe((res: ServerResponse) => {
        if (res.message === 'success') {
          this._persons.splice(this._persons.indexOf(person), 1);
          this.data.next(this._persons);
        }
      });
  }

  update(person: Person, property: { name: string; value: boolean }) {
    this.http
      .patch(`http://localhost:3000/api/persons/${encodeURIComponent(person.name)}`, { property })
      .subscribe((res: ServerResponse) => {
        if (res.message === 'success') {
          const oldValue = this._persons[this._persons.indexOf(person)];
          oldValue[property.name] = property.value;
          this.data.next(this._persons);
        }
      });
  }
}
