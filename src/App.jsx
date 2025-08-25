import React, { useState, useEffect } from "react";

export default function App() {
  const [time, setTime] = useState(25 * 60); // 25 min focus timer
  const [isRunning, setIsRunning] = useState(false);
  const [streak, setStreak] = useState(
    parseInt(localStorage.getItem("streak") || "0")
  );
  const [quote, setQuote] = useState("");

  // ⏰ Timer logic
  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => setTime((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  // 🌸 Daily Quote
  useEffect(() => {
    const quotes = [
      "Bloom where you are planted 🌸",
      "Small steps every day 🪷",
      "Breathe. Focus. Grow 🌿",
      "Consistency creates miracles ✨",
      "Be calm like the lotus in muddy water 🌊"
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // Streak save
  useEffect(() => {
    localStorage.setItem("streak", streak);
  }, [streak]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="w-80 p-5 bg-gradient-to-b from-green-50 to-white rounded-2xl shadow-xl flex flex-col items-center">
      {/* Title */}
      <h1 className="text-2xl font-bold text-green-700 mb-2">🌸 Mindful Lotus</h1>

      {/* Daily Quote */}
      <p className="text-sm text-gray-600 italic text-center mb-4">{quote}</p>

      {/* Timer */}
      <div className="text-4xl font-mono text-green-800 mb-4">
        {formatTime(time)}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mb-4">
        {!isRunning ? (
          <button
            onClick={() => setIsRunning(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700"
          >
            ▶ Start
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(false)}
            className="px-4 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600"
          >
            ⏸ Pause
          </button>
        )}
        <button
          onClick={() => {
            setIsRunning(false);
            setTime(25 * 60);
            setStreak(streak + 1);
          }}
          className="px-4 py-2 bg-pink-500 text-white rounded-xl shadow hover:bg-pink-600"
        >
          🔄 Reset
        </button>
      </div>

      {/* Streak Counter */}
      <div className="text-sm text-gray-700">
        🔥 Focus Streak: <span className="font-bold text-green-700">{streak}</span> days
      </div>
    </div>
  );
}

