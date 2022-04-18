const QUESTIONS_API = "./question.json";
const SUBMISSIONS_API = "./submissions.json";

function fetchQuestions() {
  return fetch(QUESTIONS_API).then((res) => res.json());
}
function fetchSubmissions() {
  return fetch(SUBMISSIONS_API).then((res) => res.json());
}

function statusToKebabCase(status) {
  return status.toLowerCase().replace("_", "-");
}

function generateSubmissionsMap(submissions) {
  return submissions.reduce((map, { status, questionId }) => {
    map[questionId] = statusToKebabCase(status);
    return map;
  }, {});
}

async function generateCategoryMap(questions, submissionsMap) {
  return questions.reduce((map, question) => {
    if (!map[question.category]) map[question.category] = [];
    map[question.category].push({
      ...question,
      status: submissionsMap[question.id],
    });
    return map;
  }, {});
}

function createQuestion(question) {
  return `
    <div class="question" id="${question.id}">
        <div class="status ${question.status}"></div>
        <h3>${question.name}</h3>
    </div>`;
}

function createQuestions(questions) {
  return questions.map(createQuestion).join("");
}

function createCategory(category, questions) {
  return `
    <div class="category">
        <h2>${category}</h2>
        ${createQuestions(questions)}
    </div>
    `;
}

function createCategories(categoryMap) {
  return Object.entries(categoryMap)
    .map((entries) => createCategory(...entries))
    .join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  const questions = await fetchQuestions();
  const submissions = await fetchSubmissions();
  const submissionsMap = generateSubmissionsMap(submissions);

  const categoryMap = await generateCategoryMap(questions, submissionsMap);
  const innerHTML = createCategories(categoryMap);

  document.querySelector("#wrapper").innerHTML = innerHTML;
});
