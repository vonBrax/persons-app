import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

import { Person, PersonEvent, PersonStats } from '../../shared/classes/person.class';
import { SnackbarService, PersonService } from '../../shared/services';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerComponent implements OnInit {
  persons: Person[] = [];
  filteredPersons: Person[] = [];
  dataSource: MatTableDataSource<Person>;
  columnsToDisplay: string[];
  filter: string;
  confirmDialogPerson: Person;
  stats: PersonStats;

  constructor(
    private personService: PersonService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    // Calculate the columns to display based on the properties available
    // in a Person object plus the delete column (this makes it easier to
    // to add more traits in the future - just need to change the Person class)
    this.columnsToDisplay = this.calculateTraits(new Person({})).concat('delete');

    // Retrieve available Person data and calculate stats
    this.personService.data.subscribe(data => {
      if (data) {
        this.persons = data;
        this.filteredPersons = this.filter ? this.persons.filter(person => person[this.filter]) : this.persons;
        if (this.dataSource) {
          this.dataSource.data = this.filteredPersons;
        }
        this.stats = this.calculateStats();
      }
    });

    // Subscribe to route params changes
    this.route.paramMap.subscribe(params => {
      this.filteredPersons = this.persons;
      if (params.has('filterBy')) {
        this.filter = params.get('filterBy');
        this.filteredPersons = this.persons.filter(person => person[this.filter]);
      }
      if (this.dataSource) {
        this.dataSource.data = this.filteredPersons;
      } else {
        this.dataSource = new MatTableDataSource(this.filteredPersons);
      }
      this.stats = this.calculateStats();
    });
  }

  /**
   * Calculate total number of persons and person attributes
   * present in the view (filteredPersons)
   * @returns newStats: PersonStats
   */
  calculateStats(): PersonStats {
    const newStats: PersonStats = {} as PersonStats;
    newStats.total = 0;
    this.filteredPersons.forEach(person => {
      newStats.total = ++newStats.total;
      Object.keys(person).forEach(prop => {
        if (!person[prop] || prop === 'name' || prop === 'confirm') {
          return;
        }
        // prop = prop.replace(/has|is/g, '');
        // prop = prop.charAt(0).toLowerCase() + prop.substr(1);
        // tslint:disable-next-line:no-unused-expression
        newStats[prop] = ++newStats[prop] || 1;
      });
    });
    return newStats;
  }

  /**
   * Returns the available properties/"traits" of
   * a new object inheriting from Person
   * @param person: Person
   */
  calculateTraits(person: Person): string[] {
    return Object.keys(person);
  }

  /**
   * Check if recently created person passed in should be displayed in the
   * view (simple check based on the current route parameter - filter).
   * If new person not in view, displays a warning message with the option
   * to reset the filters.
   *
   * @param person
   */
  checkIfInView(person: Person): void {
    if (this.filter) {
      if (!person[this.filter]) {
        const snackbarRef = this.snackbarService.show(
          `Person "${person.name}" created but not in view due to current filters`,
          'Clear filters',
          5000
        );
        snackbarRef.onAction().subscribe(data => {
          this.router.navigate(['/persons']);
        });
      }
    }
  }

  /**
   * Function called by child component (persons) via output
   * EventEmitter when user interaction occurs.
   *
   * @param args: PersonEvent
   */
  handlePersonEvent(args: PersonEvent): void {
    const { action, person, propertyChanged } = args;
    switch (action) {
      case 'add':
        const added = this.personService.add(person);
        if (added) {
          this.checkIfInView(person);
        }
        break;
      case 'delete':
        this.personService.delete(person);
        break;
      case 'update':
        this.personService.update(person, propertyChanged);
        break;
    }
  }

  /**
   * Top level click listener that makes use of event delegation
   * and html elements data attributes to find out if click intention
   * is to add a new user, delete user (and confirm delete), cancel a delete
   * operation, or if click location was outside of the relevant table cell.
   *
   * @param evt: MouseEvent
   */
  handleClick(evt: MouseEvent): void {
    const target = evt.target as HTMLElement;
    const targetButton = target.closest('button');
    let td = target.closest('td.mat-column-delete') as HTMLElement;
    const personIndex = td && td.dataset && +td.dataset.personindex;
    const action = targetButton && targetButton.dataset && targetButton.dataset.action;
    const person = this.filteredPersons[personIndex];
    switch (action) {
      case 'confirmAction':
        if (this.confirmDialogPerson) {
          this.confirmDialogPerson['confirm'] = false;
        }
        this.filteredPersons[personIndex]['confirm'] = true;
        this.confirmDialogPerson = this.filteredPersons[personIndex];
        break;
      case 'deleteUser':
        this.handlePersonEvent({
          action: 'delete',
          person
        });
      // tslint:disable-next-line:no-switch-case-fall-through
      case 'cancelDelete':
        // Small hack to do the confirm delete dialog clean-up (check below)
        // after cancelling a delete operation
        td = null;
    }

    // If there is a confirmation dialog and the click was on the cancel button,
    // outside the "delete" column or in the "delete" column but in a different row,
    // then remove the confirmation dialog
    if (this.confirmDialogPerson && (!td || this.confirmDialogPerson !== this.filteredPersons[personIndex])) {
      this.confirmDialogPerson['confirm'] = false;
      this.confirmDialogPerson = null;
    }
  }
}
