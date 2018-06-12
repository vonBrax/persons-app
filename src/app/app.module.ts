import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialComponentsModule } from './shared/modules/material-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { PersonService, SnackbarService, PersonBEService } from './shared/services';

import { ToArrayPipe } from './shared/pipes/toArray.pipe';
import { ElementInViewDirective } from './shared/directives/element-in-view.directive';

import { AppComponent } from './app.component';
import { ContainerComponent, PersonsComponent } from './components/';

const routes: Routes = [
  { path: 'persons', component: ContainerComponent },
  { path: 'persons/:filterBy', component: ContainerComponent },
  { path: 'personsBE', component: ContainerComponent },
  { path: 'personsBE/:filterBy', component: ContainerComponent },
  { path: '', redirectTo: 'persons', pathMatch: 'full' }
];

@NgModule({
  declarations: [AppComponent, ContainerComponent, PersonsComponent, ToArrayPipe, ElementInViewDirective],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialComponentsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [PersonService, PersonBEService, SnackbarService],
  bootstrap: [AppComponent]
})
export class AppModule {}
