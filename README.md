# Trivia Night: The Game!
Trivia Night is a single page application intended to communicate with the [Open Trivia DB API](https://opentdb.com/). The application features a form where users can specify the parameters of their call to the API to customize their quiz.

---

### Quiz options include:
- Difficulty Level
- Question Category
- Type of Question (*True/False or Multiple Choice*)
- Number of Questions Desired

##### Please note if your quiz does not immediately start after submission, it is likely because you requested more questions than the database has available for your parameters.

---
## Quick-Start Functionality
Trivia Night also features a **Quick-Start** button that allows more *time-constrained* users to jump right into a random quiz of 10 questions. For this API call, the default parameters of Any are invoked for the category, difficulty, and question type. 

## Quality of Life Enhancements
When you select your answer in Trivia Night and submit to lock it in, a color-coded response is given to indicate the status of the answer you picked. Additionally, if you failed to select an answer, an alert will appear to let you know so.

When you reach the end of your quiz, you are presented with a special button that will both display your final score *and* reintroduce the quiz menu if you wish to play again. Depending on the score you attain, one of ***three*** possible end messages will appear either informing you, congratulating you or *really* congratulating you on your efforts.

### Final Note
Big thanks to the Open Trivia DB API for making this project possible and I hope you enjoy Trivia Night. Additional features may come in the future.  