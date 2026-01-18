/**
 * GEOLOGY QUIZ ENGINE
 * Interactive quiz with instant feedback
 * 100% Vanilla JS - No dependencies
 */

class GeologyQuiz {
    constructor(containerId, questions) {
        this.container = document.getElementById(containerId);
        this.questions = questions;
        this.answers = {};
        this.submitted = false;
        this.render();
    }

    render() {
        let html = '';

        this.questions.forEach((q, index) => {
            html += this.renderQuestion(q, index);
        });

        html += `
            <div class="quiz-actions" style="text-align: center; margin-top: 2rem;">
                <button id="submitQuiz" class="btn btn-primary" onclick="quiz.submit()">
                    📝 Submit Answers
                </button>
            </div>
            <div id="scoreDisplay" class="score-display" style="display: none;">
                <div class="score-number" id="scoreNumber">0/0</div>
                <div class="score-text">Your Score</div>
                <div style="margin-top: 1rem;">
                    <a href="../index.html" class="btn btn-secondary">← Back to Home</a>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    renderQuestion(q, index) {
        const qNum = index + 1;
        const source = q.source ? `<span class="question-source">${q.source}</span>` : '';

        let optionsHtml = '';

        if (q.type === 'mcq') {
            optionsHtml = this.renderMCQ(q, index);
        } else if (q.type === 'tf') {
            optionsHtml = this.renderTF(q, index);
        }

        return `
            <div class="question" id="q${index}">
                <div class="question-header">
                    <span class="question-number">Q${qNum}</span>
                    ${source}
                </div>
                <div class="question-text">${q.text}</div>
                ${optionsHtml}
                <div class="feedback" id="feedback${index}"></div>
            </div>
        `;
    }

    renderMCQ(q, index) {
        const letters = ['a', 'b', 'c', 'd'];
        let html = '<div class="options">';

        q.options.forEach((opt, optIndex) => {
            const letter = letters[optIndex];
            html += `
                <div class="option" onclick="quiz.selectOption(${index}, '${letter}')">
                    <label class="option-label">
                        <input type="radio" name="q${index}" value="${letter}">
                        <span class="option-letter">${letter.toUpperCase()}</span>
                        <span class="option-text">${opt}</span>
                    </label>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    renderTF(q, index) {
        return `
            <div class="tf-options">
                <button class="tf-btn" onclick="quiz.selectTF(${index}, true)">✓ True</button>
                <button class="tf-btn" onclick="quiz.selectTF(${index}, false)">✗ False</button>
            </div>
        `;
    }

    selectOption(qIndex, letter) {
        if (this.submitted) return;

        this.answers[qIndex] = letter;

        // Update UI
        const questionEl = document.getElementById(`q${qIndex}`);
        const options = questionEl.querySelectorAll('.option');
        options.forEach(opt => opt.classList.remove('selected'));

        const selectedOpt = questionEl.querySelector(`input[value="${letter}"]`);
        if (selectedOpt) {
            selectedOpt.closest('.option').classList.add('selected');
        }
    }

    selectTF(qIndex, value) {
        if (this.submitted) return;

        this.answers[qIndex] = value;

        // Update UI
        const questionEl = document.getElementById(`q${qIndex}`);
        const buttons = questionEl.querySelectorAll('.tf-btn');
        buttons.forEach(btn => btn.classList.remove('selected'));

        const btnIndex = value ? 0 : 1;
        buttons[btnIndex].classList.add('selected');
    }

    submit() {
        if (this.submitted) return;
        this.submitted = true;

        let correct = 0;
        const total = this.questions.length;

        this.questions.forEach((q, index) => {
            const userAnswer = this.answers[index];
            const correctAnswer = q.answer;
            const isCorrect = userAnswer === correctAnswer;

            if (isCorrect) correct++;

            // Show feedback
            const feedbackEl = document.getElementById(`feedback${index}`);
            feedbackEl.classList.add('show');

            if (isCorrect) {
                feedbackEl.classList.add('correct');
                feedbackEl.innerHTML = '✓ Correct!';
            } else {
                feedbackEl.classList.add('incorrect');
                let correctText = '';
                if (q.type === 'mcq') {
                    correctText = correctAnswer.toUpperCase();
                } else {
                    correctText = correctAnswer ? 'True' : 'False';
                }
                feedbackEl.innerHTML = `✗ Incorrect. Correct answer: <strong>${correctText}</strong>`;
                if (q.explanation) {
                    feedbackEl.innerHTML += `<br><em>${q.explanation}</em>`;
                }
            }

            // Style options
            const questionEl = document.getElementById(`q${index}`);

            if (q.type === 'mcq') {
                const options = questionEl.querySelectorAll('.option');
                options.forEach(opt => {
                    const input = opt.querySelector('input');
                    if (input.value === correctAnswer) {
                        opt.classList.add('correct');
                    } else if (input.value === userAnswer && !isCorrect) {
                        opt.classList.add('incorrect');
                    }
                });
            } else {
                const buttons = questionEl.querySelectorAll('.tf-btn');
                const correctBtnIndex = correctAnswer ? 0 : 1;
                buttons[correctBtnIndex].classList.add('correct');

                if (!isCorrect && userAnswer !== undefined) {
                    const userBtnIndex = userAnswer ? 0 : 1;
                    buttons[userBtnIndex].classList.add('incorrect');
                }
            }
        });

        // Show score
        document.getElementById('submitQuiz').style.display = 'none';
        const scoreDisplay = document.getElementById('scoreDisplay');
        scoreDisplay.style.display = 'block';
        document.getElementById('scoreNumber').textContent = `${correct}/${total}`;

        // Scroll to score
        scoreDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Global instance
let quiz;
