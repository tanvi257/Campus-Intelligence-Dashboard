const McpServer = require('./mcp-helper');

const server = new McpServer("events-server", "1.0.0");

// Mock Database
const events = [
  { id: "ev-101", title: "Annual Hackathon 2026 (Hack-a-Campus)", category: "Tech", date: "2026-06-25", time: "09:00 AM - 09:00 PM", location: "Main Auditorium & CS Lab 4", organizer: "Computer Science Club", description: "A 12-hour hackathon to build tools for campus improvement. Cash prizes, swag, and internships!", seats: 45 },
  { id: "ev-102", title: "Jazz Night & Music Fest", category: "Cultural", date: "2026-06-18", time: "06:30 PM - 09:30 PM", location: "Open Air Theater", organizer: "Music & Fine Arts Society", description: "An evening of smooth jazz, acoustic sessions, and student band performances. Free entry!", seats: 150 },
  { id: "ev-103", title: "Robotics Workshop: Build Your Own Drone", category: "Tech", date: "2026-06-21", time: "02:00 PM - 05:00 PM", location: "Robotics Lab, Block E", organizer: "Robotics Club", description: "Learn drone aerodynamics, motor controllers, and assemble a mini-quadcopter. Kits provided.", seats: 4 },
  { id: "ev-104", title: "Inter-College Basketball Championship", category: "Sports", date: "2026-06-23", time: "04:00 PM - 07:00 PM", location: "Indoor Sports Arena", organizer: "Sports Committee", description: "The finals of the tournament. Support our home team as they go head-to-head with City Tech!", seats: 200 },
  { id: "ev-105", title: "Resume Building & Interview Prep Seminar", category: "Academic", date: "2026-06-19", time: "11:00 AM - 01:00 PM", location: "Seminar Hall 2", organizer: "Placement & Career Cell", description: "A workshops covering resume writing tips, cover letters, and behavioral mock interviews.", seats: 0 }
];

// 1. Get upcoming events tool
server.registerTool(
  "get_upcoming_events",
  "Retrieve list of upcoming campus events. Optional filter by category: 'Tech', 'Cultural', 'Sports', or 'Academic'.",
  {
    category: { type: "string", description: "Optional filter category: 'Tech', 'Cultural', 'Sports', or 'Academic'." }
  },
  [],
  async (args) => {
    let results = events;
    if (args.category) {
      const cat = args.category.toLowerCase();
      results = events.filter(e => e.category.toLowerCase() === cat);
    }
    
    if (results.length === 0) {
      return `No upcoming events found in category "${args.category}".`;
    }
    
    return results.map(e => ({
      id: e.id,
      title: e.title,
      category: e.category,
      date: e.date,
      time: e.time,
      location: e.location,
      seatsLeft: e.seats > 0 ? e.seats : "Sold Out"
    }));
  }
);

// 2. Search events tool
server.registerTool(
  "search_events",
  "Search events by keywords in the title, organizer name, or description.",
  {
    query: { type: "string", description: "Text to search in event title, organizer, or description." }
  },
  ["query"],
  async (args) => {
    const q = args.query.toLowerCase();
    const results = events.filter(e => 
      e.title.toLowerCase().includes(q) ||
      e.organizer.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
    );
    
    if (results.length === 0) {
      return `No events match search term "${args.query}".`;
    }
    
    return results;
  }
);

// 3. Register for event tool
server.registerTool(
  "register_for_event",
  "Register a student for a specific campus event. Decrements seat availability and issues a ticket code.",
  {
    eventId: { type: "string", description: "The unique event ID (e.g., ev-101)." },
    studentName: { type: "string", description: "Full name of the student registering." },
    studentId: { type: "string", description: "Student Enrollment/ID Number." }
  },
  ["eventId", "studentName", "studentId"],
  async (args) => {
    const event = events.find(e => e.id.toLowerCase() === args.eventId.toLowerCase());
    
    if (!event) {
      throw new Error(`Event with ID "${args.eventId}" not found.`);
    }
    
    if (event.seats <= 0) {
      return {
        status: "Waitlisted",
        message: `Sorry, "${event.title}" is currently fully booked. You have been added to the waitlist.`,
        waitlistNumber: Math.floor(Math.random() * 15) + 1
      };
    }
    
    // Decrement seats
    event.seats--;
    const ticketCode = `TKT-${event.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    return {
      status: "Confirmed",
      ticketCode: ticketCode,
      message: `Congratulations! ${args.studentName} is registered for "${event.title}".`,
      eventDetails: {
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location
      },
      instructions: `Please display this ticket code (${ticketCode}) at the entrance. Doors open 15 minutes before start.`
    };
  }
);

server.start();
console.error("Events MCP server started");
