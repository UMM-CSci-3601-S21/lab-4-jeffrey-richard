import { Todo } from 'src/app/todos/todo';
import { AddTodoPage } from '../support/add-todo.po';

describe('Add Todo', () => {
  const page = new AddTodoPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('should have the correct title', () => {
    page.getTitle().should('have.text', 'New Todo');
  });

  it('should enable and disable the add button based on completeness of fields', () => {
    page.addTodoButton().should('be.disabled');

    page.getFormField('owner').type('John');
    page.getFormField('category').type('homework');

    page.addTodoButton().should('be.disabled');

    page.getFormField('body').type('this is a body');

    page.addTodoButton().should('be.enabled');

    page.getFormField('owner').clear();

    page.addTodoButton().should('be.disabled');
  });

  it('should display an error for invalid inputs', () => {
    cy.get('[data-test=ownerError]').should('not.exist');
    page.getFormField('owner').click().blur();
    cy.get('[data-test=ownerError]').should('exist').and('be.visible');

    page.getFormField('owner').type('Joe');
    cy.get('[data-test=ownerError]').should('not.exist');

    cy.get('[data-test=categoryError]').should('not.exist');
    page.getFormField('category').type('this is longer than the allowed 50 characters for category').blur();
    cy.get('[data-test=categoryError]').should('exist').and('be.visible');
    page.getFormField('category').clear();
    cy.get('[data-test=categoryError]').should('exist').and('be.visible');
    page.getFormField('category').type('reasonable category length');
    cy.get('[data-test=categoryError]').should('not.exist');

    page.getFormField('body').type('this is a body');
    cy.get('[data-test=bodyError]').should('not.exist');
    page.getFormField('body').type(' more words'.repeat(14)).blur();
    cy.get('[data-test=bodyError]').should('exist').and('be.visible');
    page.getFormField('body').clear();
    cy.get('[data-test=bodyError]').should('exist').and('be.visible');
    page.getFormField('body').type('acceptable body length');
    cy.get('[data-test=bodyError]').should('not.exist');
  });

  describe('Adding a new todo', () => {

    beforeEach(() => {
      cy.task('seed:database');
    });

    it('should go to the right page and have correct information', () => {
      const todo: Todo = {
        _id: null,
        owner: 'Josh',
        category: 'movie',
        body: 'watch a movie',
        status: true
      };

      page.addTodo(todo);

      cy.url()
      .should('match', /\/todos\/[0-9a-fA-F]{24}$/)
      .should('not.match', /\/todos\/new$/);

      cy.get('.todo-card-name').should('contain.text', todo.owner);
      cy.get('.category').should('contain.text', todo.category);
      cy.get('.body').should('contain.text', todo.body);
      // The string equivalent to a status of "true" is "Complete"
      cy.get('.completed').should('contain.html', 'Complete');

      cy.get('.mat-simple-snackbar').should('contain', 'Added Todo Successfully');
    });
  });
});
