# Cubetribution

A companion app for Magic The Gathering in cube format, used to track draft scores and assist in crowdsourcing cube creation.
Powered by Angular and Supabase with Scryfall as the source for card data.

## Technologies used

- [Angular](https://angular.dev)
- [TypeScript](https://www.typescriptlang.org)
- [RxJs](https://rxjs.dev)
- [PrimeNG](https://primeng.org)
- [Supabase](https://supabase.com)
- [Karma](https://karma-runner.github.io)
- [Scryfall API](https://scryfall.com/docs/api)

## Project overview

This application is meant to help local Magic communities jumpstart the process of building a library of playable cubes and keep
track of event results all in one place.

Available functionalities 
1. Fuzzy search card browser
2. Creation and management of following card list types:
    - cubes
    - user collections
    - donations
3. Detailed statistics for played draft events, including:
    - winning decklist
    - player placements
    - win/draw/loss ratios


## Finished tasks

- Configure Supabase
- Define row level access rules for database tables
- Define models for data used in the project
- Move access permission verification to the backend with the use of postgres functions and triggers
- Create authentication service and pages
- Create a service for dynamically linking PrimeNG theme styles at runtime
- Create a toggle for controlling theme settings
- Create a Scryfall API service
- Create a dynamic menu which reacts to authentication changes
- Define the routing configuration supporting using breadcrumb navigation
- Create a breadcrumb component which recursively generates its nodes
- Create a custom observable operator used to measure performance
- Create activation guards for select routes
- Create services used for managing data related to each type of card list
- Create component used for presenting data related to each type of card list
- Create the browser component with a throttled searchbar
- Create reusable components used to present card data to the user
- Create dialog components encapsulating reusable logic
- Rewrite all data services to a strictly observable based approach for easier implementation of reactivity
- Move components to OnPush based change detection for performance reasons
- Implement more robust error handling through the use of:
  - error confirmation dialogs on critical errors
  - error messages on less severe errors
  - applying the 'retry' operator to request observables
- Rewrite templates to the new @if/@for syntax
- Simplify observable subscription management through the view model pattern

## TODO

- Create a dedicated data service for draft statistics
- Finish implementing the statistics page
- Create a component for editing collection metadata
- Link the winning decklist in draft statistics
- Implement a reward system for donation makers (credits towards draft entry fees)
- Create an admin panel (consider separate application)
- Start using Supabase Realtime for instant user notifications on database changes
- Configure Postgres Views to simplify performing complex database queries
