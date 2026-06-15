const McpServer = require('./mcp-helper');

const server = new McpServer("cafeteria-server", "1.0.0");

// Mock Database
const menus = {
  monday: {
    breakfast: [
      { name: "Pancakes with Maple Syrup", price: "$4.50", vegetarian: true, calories: 350 },
      { name: "Scrambled Eggs & Toast", price: "$3.75", vegetarian: false, calories: 280 },
      { name: "Fresh Brewed Coffee", price: "$2.00", vegetarian: true, calories: 5 }
    ],
    lunch: [
      { name: "Chicken Tikka Masala with Basmati Rice", price: "$8.50", vegetarian: false, calories: 650 },
      { name: "Paneer Butter Masala with Butter Naan", price: "$7.99", vegetarian: true, calories: 600 },
      { name: "Garden Fresh Greek Salad", price: "$5.50", vegetarian: true, calories: 180 }
    ],
    dinner: [
      { name: "Classic Beef Burger & French Fries", price: "$7.50", vegetarian: false, calories: 720 },
      { name: "Pasta Primavera in Garlic Herb Sauce", price: "$6.99", vegetarian: true, calories: 480 },
      { name: "Fountain Soda (Large)", price: "$1.75", vegetarian: true, calories: 150 }
    ]
  },
  tuesday: {
    breakfast: [
      { name: "Belgian Waffles with Strawberries", price: "$4.75", vegetarian: true, calories: 380 },
      { name: "Assorted Fresh Fruit Bowl", price: "$3.50", vegetarian: true, calories: 120 },
      { name: "Hot English Breakfast Tea", price: "$1.75", vegetarian: true, calories: 2 }
    ],
    lunch: [
      { name: "Crispy Beef/Veg Tacos (3 Pcs)", price: "$7.25", vegetarian: false, calories: 540 },
      { name: "Cheesy Chicken Quesadilla", price: "$7.99", vegetarian: false, calories: 610 },
      { name: "Tortilla Chips & Fresh Guacamole", price: "$4.00", vegetarian: true, calories: 320 }
    ],
    dinner: [
      { name: "10\" Margherita Pizza", price: "$8.00", vegetarian: true, calories: 650 },
      { name: "Loaded Pepperoni Pizza Slice", price: "$3.00", vegetarian: false, calories: 350 },
      { name: "Cheesy Garlic Breadsticks", price: "$3.50", vegetarian: true, calories: 280 }
    ]
  },
  wednesday: {
    breakfast: [
      { name: "Loaded Breakfast Burrito", price: "$5.00", vegetarian: false, calories: 420 },
      { name: "Organic Honey Oatmeal", price: "$3.00", vegetarian: true, calories: 180 },
      { name: "Fresh Squeezed Orange Juice", price: "$2.50", vegetarian: true, calories: 110 }
    ],
    lunch: [
      { name: "Teriyaki Chicken Rice Bowl", price: "$8.25", vegetarian: false, calories: 580 },
      { name: "Vegetable Fried Rice & Spring Rolls", price: "$7.25", vegetarian: true, calories: 450 },
      { name: "Miso Soup", price: "$2.00", vegetarian: true, calories: 80 }
    ],
    dinner: [
      { name: "Grilled Salmon with Roasted Asparagus", price: "$9.99", vegetarian: false, calories: 510 },
      { name: "Quinoa and Sweet Potato Power Bowl", price: "$7.99", vegetarian: true, calories: 420 },
      { name: "Iced Peach Tea", price: "$1.75", vegetarian: true, calories: 80 }
    ]
  },
  thursday: {
    breakfast: [
      { name: "Idli (3 Pcs) & Medu Vada (1 Pc) with Sambar", price: "$4.00", vegetarian: true, calories: 290 },
      { name: "Masala Dosa with Coconut Chutney", price: "$4.50", vegetarian: true, calories: 350 },
      { name: "South Indian Filter Coffee", price: "$2.00", vegetarian: true, calories: 45 }
    ],
    lunch: [
      { name: "Hyderabadi Chicken Biryani with Raita", price: "$8.99", vegetarian: false, calories: 750 },
      { name: "Vegetable Dum Biryani with Salan", price: "$7.99", vegetarian: true, calories: 620 },
      { name: "Double ka Meetha (Dessert)", price: "$2.50", vegetarian: true, calories: 310 }
    ],
    dinner: [
      { name: "Schezwan Hakka Noodles", price: "$6.99", vegetarian: true, calories: 480 },
      { name: "Gobi Manchurian (Dry/Gravy)", price: "$6.50", vegetarian: true, calories: 380 },
      { name: "Chili Chicken with Steamed Rice", price: "$7.99", vegetarian: false, calories: 590 }
    ]
  },
  friday: {
    breakfast: [
      { name: "Avocado Toast with Poached Egg", price: "$5.25", vegetarian: false, calories: 310 },
      { name: "Berry Protein Smoothie", price: "$4.50", vegetarian: true, calories: 220 },
      { name: "Croissant with Butter & Jam", price: "$2.50", vegetarian: true, calories: 240 }
    ],
    lunch: [
      { name: "Gourmet Beef Burger & Curly Fries", price: "$8.99", vegetarian: false, calories: 810 },
      { name: "Crispy Falafel Wrap with Hummus", price: "$7.25", vegetarian: true, calories: 430 },
      { name: "Chilled Vanilla/Chocolate Milkshake", price: "$3.50", vegetarian: true, calories: 380 }
    ],
    dinner: [
      { name: "Sizzling Fajitas (Chicken/Veg)", price: "$9.25", vegetarian: false, calories: 670 },
      { name: "Bean & Cheese Chimichanga", price: "$7.50", vegetarian: true, calories: 580 },
      { name: "Churros with Chocolate Dipping Sauce", price: "$3.00", vegetarian: true, calories: 290 }
    ]
  }
};

const specials = {
  monday: "Paneer Butter Masala & Garlic Naan (Chef's Choice)",
  tuesday: "Crispy Beef Tacos with Guacamole Fiesta",
  wednesday: "Fresh Teriyaki Salmon Bowl (Healthy Wednesday Special)",
  thursday: "Aromatic Hyderabadi Chicken Biryani (Signature Dish)",
  friday: "Gourmet Beef Burger & Curly Fries (Friday Cheat Meal)"
};

// Helper to get current day name in lowercase
function getDayName() {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayIndex = new Date().getDay();
  // Map weekend (Sunday, Saturday) to Monday/Friday for testing menus
  if (dayIndex === 0) return 'monday';
  if (dayIndex === 6) return 'friday';
  return days[dayIndex];
}

// 1. Get menu tool
server.registerTool(
  "get_menu",
  "Retrieve the cafeteria menu for a specific day of the week and meal time.",
  {
    day: { type: "string", description: "Day of the week (e.g. monday, tuesday, etc.). Defaults to today." },
    meal: { type: "string", description: "Meal session: 'breakfast', 'lunch', or 'dinner'. Defaults to all meals." }
  },
  [],
  async (args) => {
    const day = (args.day || getDayName()).toLowerCase();
    const meal = args.meal ? args.meal.toLowerCase() : null;

    if (!menus[day]) {
      return `The cafeteria is closed or has a limited menu on ${day}. Please select Monday through Friday.`;
    }

    if (meal) {
      if (!menus[day][meal]) {
        return `Invalid meal session "${args.meal}". Use 'breakfast', 'lunch', or 'dinner'.`;
      }
      return {
        day: day.toUpperCase(),
        session: meal.toUpperCase(),
        items: menus[day][meal]
      };
    }

    return {
      day: day.toUpperCase(),
      meals: menus[day]
    };
  }
);

// 2. Get special dishes tool
server.registerTool(
  "get_special_dishes",
  "Retrieve today's special recommendation or student favorites.",
  {},
  [],
  async (args) => {
    const today = getDayName();
    return {
      day: today.toUpperCase(),
      todaysSpecial: specials[today] || "No specials scheduled today.",
      recommendations: [
        { name: "Spicy Garlic Hakka Noodles", rating: "4.8/5", votes: 124 },
        { name: "Avocado Power Toast", rating: "4.7/5", votes: 98 },
        { name: "Hyderabadi Dum Biryani", rating: "4.9/5", votes: 312 }
      ]
    };
  }
);

// 3. Check crowd level tool
server.registerTool(
  "check_crowd_level",
  "Determine the current crowd level, average wait times, and line lengths at the cafeteria based on the current hour.",
  {},
  [],
  async (args) => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    let status = "Low";
    let waitTimeMinutes = "2-5 mins";
    let queueLength = 3;
    let description = "The cafeteria is mostly empty. Great time to visit!";

    // Breakfast Rush: 8:30 AM - 9:30 AM
    if ((hours === 8 && minutes >= 30) || (hours === 9 && minutes <= 30)) {
      status = "High";
      waitTimeMinutes = "12-15 mins";
      queueLength = 18;
      description = "Morning rush hour. Students getting breakfast before the 9:30 AM lectures. Lines are moving but long.";
    }
    // Lunch Rush: 12:15 PM - 1:45 PM
    else if ((hours === 12 && minutes >= 15) || (hours === 13 && minutes <= 45)) {
      status = "High";
      waitTimeMinutes = "15-20 mins";
      queueLength = 25;
      description = "Peak Lunch Rush. High traffic at all counters. Expect longer checkout and food prep delays.";
    }
    // Dinner Rush: 7:15 PM - 8:30 PM
    else if ((hours === 19 && minutes >= 15) || (hours === 20 && minutes <= 30)) {
      status = "Moderate";
      waitTimeMinutes = "8-10 mins";
      queueLength = 12;
      description = "Dinner hour. Steady flow of hostel students. Average wait times at main course counters.";
    }
    // Closed: 9:30 PM - 7:00 AM
    else if (hours >= 21 && minutes >= 30 || hours < 7) {
      status = "Closed";
      waitTimeMinutes = "N/A";
      queueLength = 0;
      description = "The cafeteria is currently closed. Standard operating hours are 7:00 AM to 9:30 PM.";
    }

    return {
      currentTime: timeStr,
      crowdLevel: status,
      estimatedWaitTime: waitTimeMinutes,
      peopleInQueue: queueLength,
      statusDescription: description
    };
  }
);

server.start();
console.error("Cafeteria MCP server started");
