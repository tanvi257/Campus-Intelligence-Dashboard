const McpServer = require('./mcp-helper');

const server = new McpServer("academics-server", "1.0.0");

// Mock Database
const courses = [
  { code: "CS-301", name: "Design and Analysis of Algorithms", instructor: "Dr. Alok Verma", syllabus: "Asymptotic notation, divide-and-conquer, greedy algorithms, dynamic programming, graph search (BFS, DFS), shortest paths, and NP-completeness.", schedule: "Monday & Wednesday, 10:00 AM - 11:30 AM", room: "Block A, Room 302", credits: 4 },
  { code: "CS-302", name: "Database Management Systems", instructor: "Dr. Priya Sen", syllabus: "Relational algebra, SQL, normalization (1NF-3NF/BCNF), transaction ACID properties, concurrency control, indexing, and introduction to NoSQL.", schedule: "Tuesday & Thursday, 11:40 AM - 01:10 PM", room: "Block B, Room 105", credits: 4 },
  { code: "CS-405", name: "Artificial Intelligence", instructor: "Dr. Sanjay Gupta", syllabus: "Uninformed & informed search (A*), adversary search (Minimax), constraint satisfaction, logic programming, neural networks, and NLP.", schedule: "Tuesday & Thursday, 09:30 AM - 11:00 AM", room: "Block A, Room 204", credits: 3 },
  { code: "MATH-102", name: "Linear Algebra & Calculus", instructor: "Prof. Rajesh Kumar", syllabus: "Vector spaces, linear maps, eigenvalues, multiple integrals, Green/Stokes theorems, Fourier series, and differential equations.", schedule: "Monday & Wednesday, 02:00 PM - 03:30 PM", room: "Block A, Room 101", credits: 4 }
];

const exams = [
  { courseCode: "CS-301", examType: "Midterm Exam", date: "2026-06-22", time: "10:00 AM - 12:00 PM", venue: "Exams Hall A, Block C" },
  { courseCode: "CS-302", examType: "Midterm Exam", date: "2026-06-23", time: "02:00 PM - 04:00 PM", venue: "Exams Hall B, Block C" },
  { courseCode: "CS-405", examType: "Midterm Exam", date: "2026-06-26", time: "09:30 AM - 11:30 AM", venue: "Seminar Hall 1, Block A" },
  { courseCode: "MATH-102", examType: "Midterm Exam", date: "2026-06-24", time: "10:00 AM - 12:00 PM", venue: "Exams Hall A, Block C" }
];

const calendar = [
  { event: "Tech Fest Preparation Day", dateRange: "2026-06-20", type: "Activity", notes: "No formal lectures. Club workshops open all day." },
  { event: "Midterm Exams Week", dateRange: "2026-06-22 to 2026-06-27", type: "Exam Period", notes: "No classes. Examinations conducted according to exam schedule." },
  { event: "Summer Recess", dateRange: "2026-07-01 to 2026-08-15", type: "Vacation", notes: "Campus academic functions closed. Hostels closed from July 5." },
  { event: "Independence Day Holiday", dateRange: "2026-07-04", type: "Holiday", notes: "National holiday. Campus fully closed." }
];

// 1. Get course details tool
server.registerTool(
  "get_course_details",
  "Retrieve instructor, syllabus description, timings, credits, and classroom location for a course by its code (e.g. CS-301).",
  {
    courseCode: { type: "string", description: "Course catalog code, e.g., CS-301 or CS-302." }
  },
  ["courseCode"],
  async (args) => {
    const code = args.courseCode.toUpperCase();
    const course = courses.find(c => c.code === code);
    if (!course) {
      throw new Error(`Course with code "${args.courseCode}" not found.`);
    }
    return course;
  }
);

// 2. Get exam schedule tool
server.registerTool(
  "get_exam_schedule",
  "Retrieve the midterm or final exam date, time, and exam hall location for a course by its course code.",
  {
    courseCode: { type: "string", description: "Course catalog code, e.g. CS-301." }
  },
  ["courseCode"],
  async (args) => {
    const code = args.courseCode.toUpperCase();
    const exam = exams.find(e => e.courseCode === code);
    if (!exam) {
      return `No exam schedule found for course code "${args.courseCode}".`;
    }
    return exam;
  }
);

// 3. Search academic calendar tool
server.registerTool(
  "search_academic_calendar",
  "Find upcoming campus calendar events, academic recess periods, preparation days, or holidays by keyword.",
  {
    query: { type: "string", description: "Keyword to search in the academic calendar (e.g. holiday, midterm, vacation)." }
  },
  ["query"],
  async (args) => {
    const q = args.query.toLowerCase();
    const results = calendar.filter(c => 
      c.event.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q) ||
      c.notes.toLowerCase().includes(q)
    );
    
    if (results.length === 0) {
      return `No calendar events found matching "${args.query}".`;
    }
    
    return results;
  }
);

server.start();
console.error("Academics MCP server started");
