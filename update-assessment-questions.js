const fs = require('fs');
const path = require('path');

// Read the comprehensive assessment file
const filePath = 'src/data/comprehensive-assessment.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Function to add scale configuration to a question
function addScaleConfig(questionText) {
  return questionText.replace(
    /validationCriteria: \{ [^}]+ \}/g,
    (match) => {
      return match + `,
        scaleLabels: {
          1: "Not implemented",
          2: "Partially implemented", 
          3: "Mostly implemented",
          4: "Well implemented",
          5: "Fully implemented"
        },
        scaleConfiguration: {
          min: 1,
          max: 5,
          step: 1,
          defaultLabels: false
        }`;
    }
  );
}

// Update all questions
content = addScaleConfig(content);

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Updated all assessment questions to include scale configuration');
console.log('🔄 All questions now use 1-5 scale format with appropriate labels');
