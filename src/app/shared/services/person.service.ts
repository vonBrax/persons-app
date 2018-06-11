import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Person } from '../classes/person.class';
import { SnackbarService } from './snack-bar.service';

@Injectable()
export class PersonService {
  public data: BehaviorSubject<Person[] | null>;
  public storage = window['localStorage'];
  private _STORAGE_NAME = 'lf_data';
  private _persons: Person[];

  constructor(private snackbar: SnackbarService) {
    this.data = new BehaviorSubject<Person[] | null>(null);
    this.loadPersons();
    window.addEventListener('storage', this.onLocalStorageChanges.bind(this));
  }

  /**
   * Checks if person already exists, add it to
   * the view and store it in localstorage.
   * Also sends flash messages confirming success
   * of the operation
   *
   * @param person: Person
   */
  add(person: Person): boolean | undefined {
    if (!this.contains(person)) {
      this._persons.push(person);
      this.storePersons();
      this.snackbar.show(`Person "${person.name}" added succesfully!`, null, 2000);
      return true;
    } else {
      this.snackbar.show(`Error: Person "${person.name}" already exists`);
    }
  }

  /**
   * Simple check to see if determinate person already
   * exists. Currently it only uses the "name" property
   * for the check (probably would be replaced by a unique
   * identifier on the Person object)
   *
   * @param person: Person
   */
  contains(person: Person): boolean {
    return !!this._persons.find(el => el.name.toLowerCase() === person.name.toLowerCase());
  }

  /**
   * Check if person exists and delete it from the view
   * and from local storage. Shows a flash message indicating
   * success of the operation
   *
   * @param person: Person
   */
  delete(person: Person): void {
    if (this.contains(person)) {
      this._persons.splice(this._persons.indexOf(person), 1);
      this.storePersons();
      this.snackbar.show(`Person "${person.name}" deleted succesfully!`, null, 2000);
    } else {
      this.snackbar.show(`Error: Person "${person.name}" not found`);
    }
  }

  /**
   * Checks local storage for data and push it to
   * the BehaviorSubject
   */
  loadPersons(): void {
    try {
      const persons = JSON.parse(this.storage.getItem(this._STORAGE_NAME)) as Person[];
      this._persons = persons ? persons : [];
      this.data.next(persons);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Called when local storage changes.
   * The function parses the new value and feed
   * it to the BehaviorSubject
   *
   * @param evt: StorageEvent
   */
  onLocalStorageChanges(evt: StorageEvent) {
    this._persons = JSON.parse(evt.newValue);
    this.data.next(this._persons);
  }

  /**
   * Saves the data to local storage and feeds it into the
   * BehaviorSubject
   */
  storePersons(): void {
    this.storage.setItem(this._STORAGE_NAME, JSON.stringify(this._persons));
    this.data.next(this._persons);
  }

  /**
   * Update an existing person, store the changes
   * in local storage and show a flash message
   * indicating the success of the operation
   *
   * @param person
   * @param property
   */
  update(person: Person, property: { [key: string]: any }): void {
    if (this.contains(person)) {
      const personIndex = this._persons.indexOf(person);
      this._persons[personIndex][property.name] = property.value;
      this.storePersons();
      this.snackbar.show(`Person "${person.name}" updated succesfully!`, null, 2000);
    } else {
      this.snackbar.show(`Error: Person "${person.name}" not found!`);
    }
  }
}
