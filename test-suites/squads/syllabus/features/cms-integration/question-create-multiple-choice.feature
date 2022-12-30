@cms
@syllabus
@cms-syllabus-integration
@question
@ignore

Feature: [Integration] Create the multiple choices question integration

    Background:
        Given "school admin" logins CMS
        And school admin has created a "has 1 learning objective" book
        And school admin goes to book detail page
        And school admin goes to create question page

    Scenario Outline: School admin can create multiple choices question with <answerAction> answers
        When school admin creates a multiple choices question with "<answerAction>" answers
        Then school admin sees message "You have created a new question successfully"
        And school admin sees the newly created multiple choices question
        Examples:
            | answerAction |
            | default      |
            | one          |
            | add more     |
            | delete some  |

    Scenario: User cannot create multiple choices question without the answer
        When school admin creates a multiple choices question without the answer
        Then school admin cannot create any question

    Scenario Outline: School admin cannot create a multiple choices question when missing <field>
        When school admin creates a multiple choices question with missing "<field>"
        Then school admin cannot create any question
        Examples:
            | field          |
            | question       |
            | random answers |
            | all answers    |
