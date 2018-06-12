# Persons App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

---

## Description

Small application to display a list of "person" objects (name and qualities/traits) in a table. Developed using
Angular + Angular-CLI + Angular Material Design components.

---

## Features

- Add persons (including a message with a "reset filters" option if new person is not in the view due to the filter
  restrictions)
- Edit persons
- Delete persons
- Table can be sorted by any column
- Filter persons by traits (linked to individual routes)
- All changes are persisted in local storage
- Persons traits are easily extendable

---

## Extra features

- "Flash messages" showing operation status after user interactions (not included in the `/personsBE` route; see
  instructions below)
- Changes in sync across multiple tabs (using storage events; not included in the `/personsBE` route)
- Pagination
- Search field
- Minimalist server / REST api to support the frontend application

---

## Instructions

- Clone and install dependencies both in root folder and in `/server` folder (separated packages). The "dist" folder
  including the production build was intentionally left in the repository for simplicity.
- `npm run server` and navigate to `http://localhost:3000` (or _ng serve_ for development server on port 4200)
- Default app (`/persons`) uses local storage to persist data
- App with backend support (need to manually navigate to `/personsBE`) makes api calls to the server for data; server
  store data in the local file system (no database support)

---

## Adding new "traits" to persons

- The qualities/traits can be easily extended by adding new properties to the _Person_ class and to the _PersonStats_
  interface, both located in `src/app/shared/classes/person.class.ts`

---

## General Angular-CLI Instructions

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change
any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag
for a production build.
