document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("start");
    const quizContainer = document.getElementById("quiz-container");
    const quiz = document.getElementById("quiz");
    const nextButton = document.getElementById("next");
    const submitButton = document.getElementById("submit");
    const resultContainer = document.getElementById("result");

    let currentQuestionIndex = 0;
    let answers = [];
    let correctAnswers = [];
    
    const quizData = [
        { 
            question: "What is self-care?", 
            options: [
                "Self-care is taking time for oneself to maintain and improve mental well-being", 
                "Self-care is a waste of time", 
                "Self-care is only for certain people"
            ], 
            answer: 0 
        },
        { 
            question: "How can you reduce stress?", 
            options: [
                "Increase caffeine intake", 
                "Ignore stress and it will go away", 
                "Practice relaxation techniques such as deep breathing and meditation"
            ], 
            answer: 2 
        },
        { 
            question: "Why is work-life balance important?", 
            options: [
                "Work is more important than personal life", 
                "It helps prevent burnout and reduces stress", 
                "Work-life balance is a myth"
            ], 
            answer: 1 
        },
        { 
            question: "How to support someone with mental health issues?", 
            options: [
                "Listen, offer empathy, and encourage them to seek professional help", 
                "Tell them to toughen up and deal with it", 
                "Ignore their issues"
            ], 
            answer: 0 
        }
    ];

    function loadQuestion() {
        const questionData = quizData[currentQuestionIndex];
        quiz.innerHTML = `
            <div class="question">${currentQuestionIndex + 1}. ${questionData.question}</div>
            <div class="options">
                ${questionData.options.map((option, i) => `
                    <label>
                        <input type="radio" name="question" value="${i}"> ${option}
                    </label>
                `).join("")}
            </div>
            <p id="feedback" class="feedback"></p>
        `;

        // Reset feedback message
        document.getElementById("feedback").innerHTML = '';

        // Hide the "Next" button at the start of each question, and show it only after the user selects an option.
        nextButton.style.display = "none";
        // Hide the "Submit" button initially for all questions
        submitButton.style.display = "none";
    }

    function nextQuestion() {
        const selectedOption = document.querySelector('input[name="question"]:checked');
        if (!selectedOption) return alert("Please select an option!");

        const userAnswer = parseInt(selectedOption.value);
        answers[currentQuestionIndex] = userAnswer;

        const correctAnswerIndex = quizData[currentQuestionIndex].answer;
        correctAnswers[currentQuestionIndex] = correctAnswerIndex;

        // Provide feedback on the answer
        if (userAnswer !== correctAnswerIndex) {
            document.getElementById("feedback").innerHTML = 
                `<span style="color: red;">❌ Wrong! The correct answer is: <b>${quizData[currentQuestionIndex].options[correctAnswerIndex]}</b></span>`;
        } else {
            document.getElementById("feedback").innerHTML = 
                `<span style="color: green;">✅ Correct!</span>`;
        }

        // Show the "Next" button only after the user selects an option.
        nextButton.style.display = "block";

        // Show the "Submit" button only when the last question is answered and Next is clicked
        if (currentQuestionIndex === quizData.length - 1) {
            submitButton.style.display = "block";
            nextButton.style.display = "none";  // Hide the "Next" button after the last question
        }
    }

    function calculateScore() {
        const score = answers.filter((answer, i) => answer === quizData[i].answer).length;
        quizContainer.innerHTML = `<h2>✅ Your Score: ${score} / ${quizData.length}</h2>`;
        nextButton.style.display = "none";  // Hide Next button after submission
        submitButton.style.display = "none";  // Hide Submit button after submission
    }

    // Start the quiz when the start button is clicked
    startButton.addEventListener("click", () => { 
        startButton.style.display = "none"; 
        quizContainer.style.display = "block"; 
        loadQuestion();
    });

    // Move to next question when the "Next" button is clicked
    nextButton.addEventListener("click", () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadQuestion(); // Load the next question
        } else {
            calculateScore(); // Calculate and show the score
        }
    });

    // Submit the quiz when the "Submit" button is clicked
    submitButton.addEventListener("click", calculateScore);

    // Listen for a change (selection of an option) to show the "Next" button
    quiz.addEventListener("change", nextQuestion);
});
