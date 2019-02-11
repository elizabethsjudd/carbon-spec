## user stories
Feature: Accordion follows best practices
  As a user
  I want accordions to follow best practices for web applications
  So that I have a consistent expereince for navigating to and from (`TAB`, `hover`, `focus`)
    and triggering (`click`, `SPACE`, `RETURN`) accordion headers in said application

  Scenario: Accordion header behaves as a button
   When I interact with an accordion header using my keyboard
   Then said section header behaves as a button

Feature: Opening an individual accordion section
  As a user
  I want to be able to expand an accordion section
  So that I can access the content within said sections panel

  Scenario: Open an accordion panel as a mouse user
    Given an accordion section is in a closed state
     When I click anywhere on the accordion header
     Then said section's panel will be opened

  Scenario: Open an accordion panel as a screen reader user
    Given an accordion section is in a closed state
     When I trigger the accordion header
     Then said section's panel will be opened
      And I am informed of the panels current visibility state
      And contents of said panel are accessible
