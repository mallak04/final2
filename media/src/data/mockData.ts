export const mockCodeSample = `function calculateTotal(items) {
  let total = 0
  for (let i = 0; i < items.length i++) {
    if items[i].price > 0) {
      total += items[i].price
    }
  }
  Return total;
}

const myArray = [1, 2, 3,]
const user = {
  name: "John"
  age: 25
}`;

export const mockCorrectedCode = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].price > 0) {
      total += items[i].price;
    }
  }
  return total;
}

const myArray = [1, 2, 3];
const user = {
  name: "John",
  age: 25
}`;

export const mockErrors = [
  {
    category: "Brackets",
    count: 2,
    description: "Missing or mismatched brackets in control structures",
    icon: "{ }",
    details: [
      {
        line: 3,
        message: "Missing semicolon after 'i++' in for loop - should be 'i < items.length; i++'",
        codeSnippet: "for (let i = 0; i < items.length i++) {",
        correction: "for (let i = 0; i < items.length; i++) {",
        explanation: "In JavaScript for loops, the three parts (initialization, condition, increment) must be separated by semicolons. The missing semicolon after 'items.length' causes a syntax error."
      },
      {
        line: 4,
        message: "Missing opening parenthesis before 'items[i].price' in if statement",
        codeSnippet: "if items[i].price > 0) {",
        correction: "if (items[i].price > 0) {",
        explanation: "If statements in JavaScript require the condition to be enclosed in parentheses. The missing opening parenthesis causes a syntax error."
      }
    ]
  },
  {
    category: "Commas",
    count: 1,
    description: "Trailing comma detected in array declaration",
    icon: ",",
    details: [
      {
        line: 11,
        message: "Trailing comma after '3' in array [1, 2, 3,] - remove the comma after the last element",
        codeSnippet: "const myArray = [1, 2, 3,]",
        correction: "const myArray = [1, 2, 3];",
        explanation: "While modern JavaScript allows trailing commas in arrays, it's best practice to avoid them for better compatibility and cleaner code. The trailing comma after the last element should be removed."
      }
    ]
  },
  {
    category: "Indentation",
    count: 0,
    description: "No indentation issues found",
    icon: "⇥",
    details: []
  },
  {
    category: "Case & Spelling",
    count: 1,
    description: "Incorrect capitalization in return statement",
    icon: "Aa",
    details: [
      {
        line: 8,
        message: "'Return' should be lowercase 'return' - JavaScript keywords are case-sensitive",
        codeSnippet: "Return total;",
        correction: "return total;",
        explanation: "JavaScript is case-sensitive, and all keywords must be in lowercase. 'Return' with a capital 'R' is not recognized as the return keyword and will cause a syntax error."
      }
    ]
  },
  {
    category: "Missing/Wrong Colon",
    count: 1,
    description: "Missing colon in object property declaration",
    icon: ":",
    details: [
      {
        line: 14,
        message: "Missing comma after 'name: \"John\"' in object declaration - object properties must be separated by commas",
        codeSnippet: `name: "John"
  age: 25`,
        correction: `name: "John",
  age: 25`,
        explanation: "In JavaScript object literals, properties must be separated by commas. The missing comma between 'name' and 'age' properties causes a syntax error."
      }
    ]
  },
  {
    category: "Other Errors",
    count: 0,
    description: "Other errors detected in the code",
    icon: "⇄",
    details: []
  },
];

export const mockRecommendations = [
  "Always use semicolons consistently throughout your code",
  "Add proper error handling with try-catch blocks",
  "Consider using const instead of let when variables are not reassigned",
  "Use strict equality (===) instead of loose equality (==)",
  "Add JSDoc comments to document function parameters and return types",
];

export const mockHistory = [
  {
    id: "1",
    date: "2025-10-18T14:30:00",
    language: "JavaScript",
    total_errors: 5,
    code_preview: "function calculateTotal(items) {...",
  },
  {
    id: "2",
    date: "2025-10-17T10:15:00",
    language: "Python",
    total_errors: 3,
    code_preview: "def process_data(data):...",
  },
  {
    id: "3",
    date: "2025-10-16T16:45:00",
    language: "JavaScript",
    total_errors: 8,
    code_preview: "const fetchUsers = async () => {...",
  },
  {
    id: "4",
    date: "2025-10-15T09:20:00",
    language: "TypeScript",
    total_errors: 2,
    code_preview: "interface User { name: string;...",
  },
  {
    id: "5",
    date: "2025-10-14T13:00:00",
    language: "JavaScript",
    total_errors: 6,
    code_preview: "class DataManager { constructor()...",
  },
];

export const mockProgressData = [
  { date: "2025-07-01", errors: 12 },
  { date: "2025-08-01", errors: 9 },
  { date: "2025-09-01", errors: 7 },
  { date: "2025-10-01", errors: 5 },
  { date: "2025-11-01", errors: 3 },
];

export const mockMonthlyErrorBreakdown = [
  {
    month: "July 2025",
    categories: {
      "Brackets": 4,
      "Commas": 2,
      "Indentation": 1,
      "Case & Spelling": 3,
      "Missing/Wrong Colon": 2,
      "Other Errors": 0,
    },
    total: 12,
  },
  {
    month: "August 2025",
    categories: {
      "Brackets": 3,
      "Commas": 2,
      "Indentation": 0,
      "Case & Spelling": 2,
      "Missing/Wrong Colon": 2,
      "Other Errors": 0,
    },
    total: 9,
  },
  {
    month: "September 2025",
    categories: {
      "Brackets": 2,
      "Commas": 1,
      "Indentation": 0,
      "Case & Spelling": 2,
      "Missing/Wrong Colon": 2,
      "Other Errors": 0,
    },
    total: 7,
  },
  {
    month: "October 2025",
    categories: {
      "Brackets": 2,
      "Commas": 0,
      "Indentation": 0,
      "Case & Spelling": 1,
      "Missing/Wrong Colon": 2,
      "Other Errors": 0,
    },
    total: 5,
  },
  {
    month: "November 2025",
    categories: {
      "Brackets": 1,
      "Commas": 0,
      "Indentation": 0,
      "Case & Spelling": 1,
      "Missing/Wrong Colon": 1,
      "Other Errors": 0,
    },
    total: 3,
  },
];
