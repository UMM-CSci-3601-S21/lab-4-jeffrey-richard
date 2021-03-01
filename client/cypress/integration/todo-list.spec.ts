import { TodoListPage } from '../support/todo-list.po';

const page = new TodoListPage();

describe('Todo list', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should show all todos', () => {
    page.getTodoCards().should('have.length', 300);
  });

  it('Should type something in the owner filter and check that it returned correct elements', () => {
    // Filter for user 'Lynn Ferguson'
    cy.get('[data-test=ownerInput]').type('Barry');

    // All of the user cards should have the name we are filtering by
    page.getTodoCards().each(e => {
      cy.wrap(e).find('.todo-card-owner').should('have.text', 'Barry');
    });

    // (We check this two ways to show multiple ways to check this)
    page.getTodoCards().find('.todo-card-owner').each(el =>
      expect(el.text()).to.equal('Barry')
    );
  });


});
