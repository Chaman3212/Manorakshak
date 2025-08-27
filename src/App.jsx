import React, { useState, useEffect } from "react";

export default function App() {
  const [time, setTime] = useState(25 * 60); // 25 min focus timer
  const [isRunning, setIsRunning] = useState(false);
  const [streak, setStreak] = useState(
    parseInt(localStorage.getItem("streak") || "0")
  );
  const [quote, setQuote] = useState("");
  const [calmMode, setCalmMode] = useState(false);

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

  // Calm Mode: load from chrome.storage.local
  useEffect(() => {
    try {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(["calmModeEnabled"], (result) => {
          if (typeof result?.calmModeEnabled === "boolean") {
            setCalmMode(result.calmModeEnabled);
          }
        });
      }
    } catch (_) {}
  }, []);

  const handleToggleCalmMode = () => {
    const next = !calmMode;
    setCalmMode(next);
    try {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ calmModeEnabled: next });
      }
    } catch (_) {}
  };

  const openUserDashboard = () => {
    try {
      const url = chrome?.runtime?.getURL ? chrome.runtime.getURL("userDashboard.html") : "userDashboard.html";
      if (chrome?.tabs?.create) {
        chrome.tabs.create({ url });
      } else {
        window.open(url, "_blank");
      }
    } catch (_) {
      window.open("userDashboard.html", "_blank");
    }
  };

  const handleToxic = () => {
    // Placeholder action for Toxic button; extend later as needed
    try { console.log('Toxic button clicked'); } catch (_) {}
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="mrk-popup w-80 p-5 bg-gradient-to-b from-green-50 to-white rounded-2xl shadow-xl">
     <div>
       {/* Title */}
      <h1 className="mrk-title text-2xl font-bold text-green-700 mb-2">🌸Manorakshak</h1>

      {/* Daily Quote */}
      <p className="mrk-quote text-sm text-gray-600 italic text-center mb-4">{quote}</p>

      {/* Timer */}
      <div className="mrk-timer text-4xl font-mono text-green-800 mb-4">
        {formatTime(time)}
      </div>

      {/* Buttons */}
      <div className="mrk-controls flex gap-2 mb-4 justify-center items-center">
        {!isRunning ? (
          <button
            onClick={() => setIsRunning(true)}
            className="mrk-btn mrk-btn--start px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700"
          >
            ▶ Start
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(false)}
            className="mrk-btn mrk-btn--pause px-4 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600"
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
          className="mrk-btn mrk-btn--reset px-4 py-2 bg-pink-500 text-white rounded-xl shadow hover:bg-pink-600"
        >
          🔄 Reset
        </button>
        <button
          onClick={handleToxic}
          className="mrk-btn mrk-btn--toxic px-4 py-2 text-white rounded-xl shadow"
          title="Toxic"
        >
          ☣ Toxic
        </button>
      </div>

      {/* Streak Counter */}
      <div className="mrk-streak text-sm text-gray-700 mb-4">
        🔥 Focus Streak: <span className="font-bold text-green-700">{streak}</span> days
      </div>

      {/* Calm Mode Toggle */}
      <div className="mrk-calm-card w-full mb-4 p-3 rounded-xl border border-green-100 bg-white shadow-sm flex items-center justify-between">
        <div className="text-sm text-gray-800 font-medium">Calm Mode: <span className={calmMode ? "text-green-700" : "text-gray-500"}>{calmMode ? "ON" : "OFF"}</span></div>
        <button
          onClick={handleToggleCalmMode}
          className={`mrk-calm-toggle px-3 py-1 rounded-full text-white text-sm shadow ${calmMode ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 hover:bg-gray-500"}`}
          aria-pressed={calmMode}
        >
          {calmMode ? "Turn Off" : "Turn On"}
        </button>
      </div>

      {/* View Dashboard */}
      <button
        onClick={openUserDashboard}
        className="mrk-dashboard-btn w-full px-4 py-2 bg-white border border-green-200 rounded-xl shadow hover:bg-green-50 text-green-700 font-medium"
      >
        View User Dashboard
      </button>
     </div>
    </div>
  );
}

