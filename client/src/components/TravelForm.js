import { useState, useEffect } from "react";
import "./TravelForm.css";

// Background images
import img1 from "../assets/background/1.jpg";
import img2 from "../assets/background/2.jpg";
import img3 from "../assets/background/3.jpg";
import img4 from "../assets/background/4.jpg";
import img5 from "../assets/background/5.jpg";
import img6 from "../assets/background/6.jpg";
import img7 from "../assets/background/7.jpg";
import img8 from "../assets/background/8.jpg";

const images = [img1, img2, img3, img4, img5, img6, img7, img8];

function TravelForm() {
  // Form state
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [travelType, setTravelType] = useState("Friends");

  // UI state
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);

  // Background image state
  const [bgIndex, setBgIndex] = useState(0);

  // Rotate background every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setItinerary("");

    try {
      const response = await fetch("http://localhost:5000/api/plan-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: destination,
          days: Number(days),
          budget,
          interests: travelType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate itinerary");
      }

      setItinerary(data.itinerary);
    } catch (error) {
      setItinerary("❌ Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div
      className="background"
      style={{ backgroundImage: `url(${images[bgIndex]})` }}
    >
      <div className="container glass">
        <h2>🌍 AI Travel Planner</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Destination (e.g. Paris)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Number of days"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            required
          />

          <input
            placeholder="Budget (e.g. 50000)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />

          <select
            value={travelType}
            onChange={(e) => setTravelType(e.target.value)}
          >
            <option>Solo</option>
            <option>Family</option>
            <option>Friends</option>
            <option>Couple</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "✨ Generating..." : "Generate Plan"}
          </button>
        </form>

        {itinerary && (
          <div className="itinerary">
            <h3>🗺️ Your Travel Plan</h3>
            <p>{itinerary}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TravelForm;


