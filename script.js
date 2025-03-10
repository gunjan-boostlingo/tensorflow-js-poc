const passageE = document.getElementById('passage');
const questionE = document.getElementById('question');
const button = document.getElementById('button');
const answerE = document.getElementById('answer');
const loading = document.querySelector('.loading');
const highlightDiv = document.querySelector('.answer-highlight');
const highlightText = document.getElementById('highlight-text');

// Make sure TensorFlow and QnA are loaded before proceeding
const checkIfModelsLoaded = () => {
  if (typeof tf === 'undefined') {
    console.error("TensorFlow.js is not loaded!");
    return false;
  }
  
  if (typeof qna === 'undefined') {
    console.error("TensorFlow QnA model is not loaded!");
    return false;
  }
  
  return true;
};

const answer = async (model, passage, question) => {
    console.log("Finding answer for:", question);
    console.log("In passage:", passage);
    
    try {
        const answers = await model.findAnswers(question, passage);
        console.log("Answers received:", answers);
        
        if (answers && answers.length > 0) {
            return answers[0].text;
        } else {
            return false;
        }
    } catch (e) {
        console.error("Error finding answer:", e);
        return false;
    }
}

const main = async () => {
    // Show loading message while model loads
    loading.style.display = 'block';
    answerE.textContent = 'Loading TensorFlow model...';

    // Check if TensorFlow is available
    if (!checkIfModelsLoaded()) {
        loading.style.display = 'none';
        answerE.textContent = 'Error: TensorFlow or QnA model library not found. Please check your script imports.';
        return;
    }

    try {
        console.log("Loading QnA model...");
        const model = await qna.load();
        console.log("Model loaded successfully:", model);
        
        // Hide loading once model is loaded
        loading.style.display = 'none';
        answerE.textContent = 'Enter your question above to get an answer';

        button.onclick = async () => {
            // Validate inputs
            if (passageE.value.trim() === '' || questionE.value.trim() === '') {
                answerE.textContent = 'Please enter both a passage and a question.';
                highlightDiv.style.display = 'none';
                return;
            }

            // Show loading while processing question
            loading.style.display = 'block';
            answerE.textContent = '';
            highlightDiv.style.display = 'none';

            try {
                let ans = await answer(model, passageE.value, questionE.value);

                // Hide loading once answer is found
                loading.style.display = 'none';

                if (!ans) {
                    answerE.textContent = 'No answer found in the provided passage.';
                    highlightDiv.style.display = 'none';
                } else {
                    answerE.textContent = ans;
                    
                    // Show the highlight with context
                    const context = passageE.value;
                    if (context.includes(ans)) {
                        const startIndex = Math.max(0, context.indexOf(ans) - 50);
                        const endIndex = Math.min(context.length, context.indexOf(ans) + ans.length + 50);
                        const contextText = context.substring(startIndex, endIndex);
                        highlightText.textContent = contextText;
                        highlightDiv.style.display = 'block';
                    }
                }
            } catch (err) {
                loading.style.display = 'none';
                answerE.textContent = 'Error processing your question. Please try again.';
                console.error("Error during question processing:", err);
            }
        }
    } catch (e) {
        loading.style.display = 'none';
        answerE.textContent = 'Error loading TensorFlow model. Please check your connection and try again.';
        console.error("Error loading model:", e);
    }
}

// Wait for the DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}
