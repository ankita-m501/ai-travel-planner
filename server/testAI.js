// import fetch from "node-fetch";
// import dotenv from "dotenv";
// dotenv.config();

// async function testAI() {
//   const response = await fetch("http://localhost:5000/api/plan-trip", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       city: "Goa",
//       days: 3,
//       budget: "low",
//       interests: "beaches, food, nightlife"
//     }),
//   });

//   const data = await response.json();
//   console.log("AI Response:", data.itinerary);
// }

// testAI();

import dotenv from "dotenv";
dotenv.config();

async function testAI() {
  console.log("Sending request to server...");

  try {
    const response = await fetch("http://127.0.0.1:5000/api/plan-trip", { // Using 127.0.0.1 instead of localhost
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        city: "Goa",
        days: 3,
        budget: "low",
        interests: "beaches, food, nightlife"
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("--- SUCCESS! ITINERARY BELOW ---");
      console.log(data.itinerary);
    } else {
      console.log("Server Error:", data.error || "Unknown error");
    }
  } catch (error) {
    console.error("Connection Error:", error.message);
  }
}

testAI();
