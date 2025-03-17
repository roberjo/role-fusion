describe('Role Management', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show/hide content based on user role', () => {
    cy.get('[data-testid="role-switcher"]').select('user');
    cy.get('[data-testid="admin-panel"]').should('not.exist');
    
    cy.get('[data-testid="role-switcher"]').select('admin');
    cy.get('[data-testid="admin-panel"]').should('be.visible');
  });
});