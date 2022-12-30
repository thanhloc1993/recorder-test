@cms @learner @learner2
@syllabus @studyplan-item-bulk-edit @studyplan

Feature: Bulk edit study plan items in individual study plan

    Background:
        Given "school admin" logins CMS
        And "student S1" logins Learner App
        And "student S2" logins Learner App
        And school admin has created a new course without any location
        And school admin has added student S1 and student S2 to the course
        And school admin has created a "content without quiz" book
        And school admin has created a matched study plan with active and archived items

    #TCID:syl-1050
    Scenario Outline: School admin selects all study plan topics in individual study plan and bulk edits them
        Given school admin is at the individual study plan details page of "student S1"
        When school admin edits the study plan content
        And school admin selects "all" topics in "individual" study plan
        And school admin selects "<action>" in bulk edit menu
        And school admin updates study plan items with "<date>" and "<time>" which are available for studying
        And school admin saves the editing study plan content process
        Then school admin sees the values of "all" study plan items in individual study plan of "student S1" changed correctly
        And school admin sees values of these study plan items in individual study plan of "student S2" unchanged

        Examples:
            | action                                      | date       | time       |
            | 1 of [Edit Available Until, Edit Due Date]  | end date   | end time   |
            | 1 of [Edit Available From, Edit Start Date] | start date | start time |

    #TCID:syl-1049
    Scenario Outline: School admin selects many study plan items in multiple topics in individual study plan and bulk edits them
        Given school admin is at the individual study plan details page of "student S1"
        When school admin edits the study plan content
        And school admin selects 2 study plan items in 1 topics in "individual" study plan to update
        And school admin selects "<action>" in bulk edit menu
        And school admin updates study plan items with "<date>" and "<time>" which are available for studying
        And school admin saves the editing study plan content process
        Then school admin sees the values of "many" study plan items in individual study plan of "student S1" changed correctly
        And school admin sees values of these study plan items in individual study plan of "student S2" unchanged

        Examples:
            | action                                      | date       | time       |
            | 1 of [Edit Available From, Edit Start Date] | start date | start time |
            | 1 of [Edit Available Until, Edit Due Date]  | end date   | end time   |