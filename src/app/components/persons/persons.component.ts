import { Component, OnInit, Input, Output, ViewChild, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatCheckboxChange, MatExpansionPanel } from '@angular/material';
import { Person, PersonEvent } from '../../shared/classes/person.class';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})
export class PersonsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatExpansionPanel) panel: MatExpansionPanel;
  @Input() dataSource: MatTableDataSource<Person>;
  @Input() columnsToDisplay: string[];
  @Output() personEvent: EventEmitter<any> = new EventEmitter<any>();

  formGroup: FormGroup;
  get name(): AbstractControl {
    return this.formGroup.get('name') as AbstractControl;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Form controls to add new persons
    this.formGroup = this.fb.group({
      name: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(3)])),
      hasSuperPowers: this.fb.control(false),
      isRich: this.fb.control(false),
      isGenius: this.fb.control(false)
    });
  }

  ngAfterViewInit() {
    // Set initial state of the "add person" form to open
    // if there person count is 0 on init
    if (this.dataSource.data.length === 0) {
      this.panel.open();
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Function for the search functionality
   * (apply filters according to user keyboard
   * inputs)
   *
   * @param filterValue: string
   */
  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Check if "Add new user" form fields are
   * valid and send event to parent container
   * (keep only presentational logic for this component)
   */
  addNewUser(): void {
    if (this.formGroup.valid) {
      const eventParams = {
        action: 'add',
        person: new Person(this.formGroup.value)
      };
      this.personEvent.emit(eventParams);
      this.formGroup.reset();
    } else {
      this.name.markAsTouched();
    }
  }

  /**
   * Send user intention for deleting a
   * person to parent component
   *
   * @param person: Person
   */
  deleteUser(person: Person): void {
    const eventParams = {
      action: 'delete',
      person
    };
    this.personEvent.emit(eventParams);
  }

  /**
   * Function called when the state of the checkboxes
   * in the persons table changes. Emits the event to
   * the parent container
   *
   * @param evt: MatCheckboxChange
   * @param person: Person
   * @param property: string
   */
  onChange(evt: MatCheckboxChange, person: Person, property: string): void {
    const eventParams: PersonEvent = {
      action: 'update',
      person,
      propertyChanged: {
        name: property,
        value: evt.checked
      }
    };
    this.personEvent.emit(eventParams);
  }
}
