const McpServer = require('./mcp-helper');

const server = new McpServer("library-server", "1.0.0");

// Mock Database
const books = [
  { id: "cs-101", title: "Introduction to Algorithms", author: "Thomas H. Cormen, Charles E. Leiserson", category: "Computer Science", available: true, copies: 3, location: "Floor 2, Shelf A4" },
  { id: "cs-102", title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell, Peter Norvig", category: "Computer Science", available: false, copies: 0, location: "Floor 2, Shelf B1", dueDate: "2026-06-18" },
  { id: "cs-103", title: "The C Programming Language", author: "Brian W. Kernighan, Dennis M. Ritchie", category: "Computer Science", available: true, copies: 1, location: "Floor 2, Shelf A1" },
  { id: "cs-104", title: "Clean Code", author: "Robert C. Martin", category: "Computer Science", available: true, copies: 2, location: "Floor 2, Shelf A5" },
  { id: "cs-105", title: "Design Patterns: Elements of Reusable Object-Oriented Software", author: "Erich Gamma, Richard Helm", category: "Computer Science", available: true, copies: 4, location: "Floor 2, Shelf B3" },
  { id: "math-201", title: "Calculus", author: "James Stewart", category: "Mathematics", available: true, copies: 5, location: "Floor 1, Shelf C2" },
  { id: "phys-301", title: "Physics for Scientists and Engineers", author: "Raymond A. Serway", category: "Physics", available: false, copies: 0, location: "Floor 1, Shelf D5", dueDate: "2026-06-20" },
  { id: "phys-302", title: "A Brief History of Time", author: "Stephen Hawking", category: "Physics", available: true, copies: 2, location: "Floor 1, Shelf D1" }
];

// 1. Search books tool
server.registerTool(
  "search_books",
  "Search books in the campus library by title, author, or category.",
  {
    query: { type: "string", description: "Search query matching book title, author, or category." }
  },
  ["query"],
  async (args) => {
    const query = args.query.toLowerCase();
    const results = books.filter(b => 
      b.title.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query) ||
      b.category.toLowerCase().includes(query)
    );
    
    if (results.length === 0) {
      return `No books found matching "${args.query}" in the campus library catalog.`;
    }
    
    return results.map(b => ({
      id: b.id,
      title: b.title,
      author: b.author,
      category: b.category,
      available: b.available ? "Yes" : "No (Checked Out)"
    }));
  }
);

// 2. Get book details tool
server.registerTool(
  "get_book_details",
  "Retrieve detailed information, availability, and physical shelf location for a specific book by ID.",
  {
    bookId: { type: "string", description: "The unique catalog ID of the book (e.g. cs-101)." }
  },
  ["bookId"],
  async (args) => {
    const book = books.find(b => b.id.toLowerCase() === args.bookId.toLowerCase());
    if (!book) {
      throw new Error(`Book with ID "${args.bookId}" not found in the catalog.`);
    }
    
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category,
      available: book.available,
      copiesAvailable: book.copies,
      location: book.location,
      dueDate: book.available ? null : book.dueDate,
      summary: `This is a standard reference textbook for ${book.category} studies, available for short-term student borrowing.`
    };
  }
);

// 3. Checkout book tool
server.registerTool(
  "checkout_book",
  "Borrow/checkout a book from the library for 14 days. Updates availability status.",
  {
    bookId: { type: "string", description: "The unique catalog ID of the book to checkout." },
    studentId: { type: "string", description: "Student Enrollment/ID Number." }
  },
  ["bookId", "studentId"],
  async (args) => {
    const book = books.find(b => b.id.toLowerCase() === args.bookId.toLowerCase());
    if (!book) {
      throw new Error(`Book with ID "${args.bookId}" not found in the library.`);
    }
    
    if (!book.available) {
      return `Sorry, "${book.title}" is currently checked out. It is expected back by ${book.dueDate || 'soon'}. You can place a hold.`;
    }
    
    // Perform checkout (simulate status change)
    book.copies--;
    if (book.copies === 0) {
      book.available = false;
    }
    const today = new Date();
    const returnDate = new Date();
    returnDate.setDate(today.getDate() + 14);
    const dueDateStr = returnDate.toISOString().split('T')[0];
    book.dueDate = dueDateStr;
    
    return {
      status: "Success",
      message: `Successfully checked out "${book.title}" for Student ${args.studentId}.`,
      dueDate: dueDateStr,
      instructions: `Please collect the physical book from ${book.location}. Show this checkout slip to the library counter.`
    };
  }
);

server.start();
console.error("Library MCP server started");
