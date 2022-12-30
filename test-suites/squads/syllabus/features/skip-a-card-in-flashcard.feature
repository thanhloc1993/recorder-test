@cms @teacher @learner
@syllabus @flashcard @flashcard-common

Feature: Skip a Card in Flashcard Learn

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content have 5 card" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0269
    Scenario Outline: Skip a card in Flashcard Learn screen after learning <number> card
        Given student goes to Flashcard Learn screen
        And student stands at card's position <number>
        When student swipes left the card
        Then student sees next card in Flashcard Learn screen
        And student sees the number of skipped cards increase 1

        Examples:
            | number |
            | 0      |
            | 1      |

    #TCID:syl-0270
    #multiple is n-1 card
    Scenario: Skip a card in Flashcard Learn screen after learning multiple card
        Given student goes to Flashcard Learn screen
        And student stands at the final card
        When student swipes left the card
        Then student sees nice work card in Flashcard Learn screen
        And student sees the number of skipped cards increase 1