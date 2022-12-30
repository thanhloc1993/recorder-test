@cms @teacher @teacher2 @learner @learner2
@lesson
@lesson-upsert
@ignore

Feature: School admin can edit past lesson which has no lesson report by removing
    Background:
        Given "school admin" logins CMS
        And "teacher T1" logins Teacher App
        And "student S1" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page

    # TODO: Implement when it's possible to create the lesson without students and teachers
    # Scenario: School admin can remove all teachers and students in past lesson
    #     When "school admin" removes all teachers and students in past lesson
    #     Then "school admin" is redirected to detailed lesson info page
    #     And "school admin" does not see any teacher on CMS
    #     And "school admin" does not see any student on CMS
    #     And "student S1" does not see past lesson on Learner App

    Scenario: School admin can remove teacher in past lesson
        Given "teacher T2" logins Teacher App
        #need refactor
        And "school admin" has added "teacher T2" into the lesson
        When "school admin" removes "teacher T1" from the lesson
        And "school admin" saves the changes of the lesson
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" does not see "teacher T1" in detailed lesson info page on CMS
        And "teacher T2" still sees the "past" lesson on Teacher App

    Scenario: School admin can remove student in past lesson
        Given "student S2" with course and enrolled status has logged Learner App
        And "school admin" has added "student S2" into the lesson
        When "school admin" removes "student S1" from the lesson
        And "school admin" saves the changes of the lesson
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" does not see "student S1" in detailed lesson info page on CMS
        And "teacher T1" does not see "student S1" in student list of "past" lesson on Teacher App
        And "student S1" does not see the "past" lesson on Learner App
        And "student S2" still sees the "past" lesson on Learner App
