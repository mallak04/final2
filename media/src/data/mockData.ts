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

export const mockErrors = [
  {
    category: "Brackets",
    count: 2,
    description: "Missing or mismatched brackets in control structures",
    icon: "{ }",
  },
  {
    category: "Commas",
    count: 1,
    description: "Trailing comma detected in array declaration",
    icon: ",",
  },
  {
    category: "Indentation",
    count: 0,
    description: "No indentation issues found",
    icon: "⇥",
  },
  {
    category: "Case & Spelling",
    count: 1,
    description: "Incorrect capitalization in return statement",
    icon: "Aa",
  },
  {
    category: "Missing/Wrong Colon",
    count: 1,
    description: "Missing colon in object property declaration",
    icon: ":",
  },
  {
    category: "Reversed Words",
    count: 0,
    description: "No reversed word declarations found",
    icon: "⇄",
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
  { date: "2025-10-14", errors: 6 },
  { date: "2025-10-15", errors: 2 },
  { date: "2025-10-16", errors: 8 },
  { date: "2025-10-17", errors: 3 },
  { date: "2025-10-18", errors: 5 },
];
