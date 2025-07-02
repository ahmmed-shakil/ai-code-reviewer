// Demo/sample data for testing the application without API keys

export const sampleCode = {
  javascript: `function calculateTotal(items) {
    var total = 0;
    for (var i = 0; i < items.length; i++) {
        total += items[i].price * items[i].quantity;
    }
    return total;
}

// Usage
const cartItems = [
    { name: "Apple", price: 1.50, quantity: 5 },
    { name: "Banana", price: 0.75, quantity: 3 }
];

console.log("Total: $" + calculateTotal(cartItems));`,

  python: `def find_duplicates(arr):
    seen = []
    duplicates = []
    
    for item in arr:
        if item in seen:
            if item not in duplicates:
                duplicates.append(item)
        else:
            seen.append(item)
    
    return duplicates

# Test the function
numbers = [1, 2, 3, 2, 4, 5, 3, 6]
print("Duplicates:", find_duplicates(numbers))`,

  typescript: `interface User {
    id: number;
    name: string;
    email: string;
    age?: number;
}

class UserService {
    private users: User[] = [];
    
    addUser(user: User): void {
        // Missing validation
        this.users.push(user);
    }
    
    findUser(id: number): User | undefined {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id === id) {
                return this.users[i];
            }
        }
        return undefined;
    }
    
    deleteUser(id: number): boolean {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }
}`,
};

export const sampleReview = {
  overall_score: 72,
  summary:
    "The code shows good structure but has several areas for improvement including performance optimization, error handling, and modern syntax usage.",
  issues: [
    {
      type: "warning",
      category: "performance",
      line: 3,
      message: "Using var instead of const/let in modern JavaScript",
      suggestion:
        "Replace 'var' with 'const' or 'let' for better scoping and performance",
      code_example: "for (let i = 0; i < items.length; i++) {",
    },
    {
      type: "suggestion",
      category: "style",
      line: 2,
      message: "Consider using array methods like reduce() for cleaner code",
      suggestion: "Use functional programming approach with reduce()",
      code_example:
        "return items.reduce((total, item) => total + (item.price * item.quantity), 0);",
    },
    {
      type: "error",
      category: "bugs",
      line: 1,
      message: "No input validation for the items parameter",
      suggestion:
        "Add validation to check if items is an array and handle edge cases",
      code_example:
        "if (!Array.isArray(items) || items.length === 0) return 0;",
    },
    {
      type: "warning",
      category: "performance",
      line: 4,
      message: "Accessing array length in loop condition is inefficient",
      suggestion: "Cache the array length in a variable",
      code_example: "for (let i = 0, len = items.length; i < len; i++) {",
    },
  ],
  strengths: [
    "Function has a clear, descriptive name",
    "Logic is straightforward and easy to understand",
    "Proper return statement",
    "Good example usage provided",
  ],
  recommendations: [
    "Add input validation and error handling",
    "Use modern JavaScript features (const/let, arrow functions)",
    "Consider using array methods for functional programming style",
    "Add JSDoc comments for better documentation",
    "Consider edge cases like empty arrays or invalid data types",
  ],
};

export const demoFiles = [
  {
    name: "shopping-cart.js",
    content: sampleCode.javascript,
    size: sampleCode.javascript.length,
    type: "text/javascript",
    lastModified: Date.now(),
  },
  {
    name: "find-duplicates.py",
    content: sampleCode.python,
    size: sampleCode.python.length,
    type: "text/x-python",
    lastModified: Date.now(),
  },
  {
    name: "user-service.ts",
    content: sampleCode.typescript,
    size: sampleCode.typescript.length,
    type: "text/typescript",
    lastModified: Date.now(),
  },
];
