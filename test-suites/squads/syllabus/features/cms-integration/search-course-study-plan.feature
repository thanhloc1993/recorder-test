@cms
@cms-syllabus-integration
@syllabus @studyplan

Feature: [Integration] Search and filters course study plan
    Background:
        Given "school admin" logins CMS
        And school admin has created a new course without any location
        And school admin has created list study plan "random" status to search and filters
        And school admin goes to the "course" study plan in the course detail

    Scenario Outline: User can search then filters and sees all data matches
        When school admin searches study plan "<searchName>" name
        Then school admin filters "<gradeAndBook>" with random status in the course study plan
        And school admin sees all course study plan matches with the above filters
        And school admin resets filters study plan
        And school admin sees all course study plan matches with search

        Examples:
            | searchName | gradeAndBook            |
            | correct    | none                    |
            | correct    | grade and book          |
            | correct    | grade or book           |
            | correct    | multiple grade or book  |
            | correct    | multiple grade and book |
            | none       | grade or book           |
            | none       | grade and book          |
            | none       | multiple grade and book |
            | incorrect  | none                    |

    Scenario Outline: User can filters then search and sees all data matches
        When school admin filters "<gradeAndBook>" with random status in the course study plan
        Then school admin searches study plan "<searchName>" name
        And school admin sees all course study plan matches with the above filters
        And school admin resets filters study plan
        And school admin sees all course study plan matches with search

        Examples:
            | gradeAndBook            | searchName |
            | none                    | correct    |
            | grade and book          | correct    |
            | grade or book           | correct    |
            | multiple grade or book  | correct    |
            | multiple grade and book | correct    |
            | grade or book           | none       |
            | grade and book          | none       |
            | multiple grade and book | none       |