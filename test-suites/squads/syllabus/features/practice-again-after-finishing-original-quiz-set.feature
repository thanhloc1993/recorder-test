@cms @teacher @learner
@syllabus @retry-mode

Feature: Go to Practice Again after finishing Original Quiz Set

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0314
    Scenario: Practice again original quiz set when student completed the original quiz set with 0 incorrect response
        Given school admin creates 3 questions in Quiz LO
        And student has completed Quiz LO with 0 incorrect response
        And student is on retry attempt screen of the lo
        When student selects to practice again
        Then student sees the original quiz set questions

    #TCID:syl-0313
    Scenario: Practice again quiz set when student completed the original quiz set with X incorrect response
        Given school admin creates 3 questions in Quiz LO
        And student has completed Quiz LO with "1 of [1,2,3]" incorrect response
        And student is on retry attempt screen of the lo
        When student selects to practice again
        Then student sees the original quiz set questions