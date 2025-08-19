"use client";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { analyzeAudio } from "./lib/audioProcessor";
import { shortenUrl, getClicks } from "./lib/bitly";
import { initAR } from "./lib/arScene";
import confetti from "canvas-confetti";
import './styles/card.css'; // Import the CSS file

export default function Home() {
  const audioRef = useRef(null);
  const [reactions, setReactions] = useState([]);
  const [resume, setResume] = useState(null);
  const [clicks, setClicks] = useState(0);
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    fetch("/resume.json")
      .then((res) => res.json())
      .then((data) => setResume(data));

    shortenUrl(window.location.href).then((shortUrl) => {
      getClicks(shortUrl).then((clickData) => {
        setClicks(clickData.length);
      });
    });

    initAR("ar-container");

    const interval = setInterval(() => {
      setBubbles((prev) => [
        ...prev,
        { id: Date.now(), x: Math.random() * 300, y: -50 },
      ]);
      if (bubbles.length > 5) setBubbles((prev) => prev.slice(1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const playAudio = async () => {
    if (audioRef.current) {
      audioRef.current.play();
      const analysis = await analyzeAudio("/intro.mp3");
      console.log("Audio Analysis:", analysis);
    }
  };

  const logReaction = () => {
    setReactions([...reactions, { type: "smile", timestamp: new Date().toISOString() }]);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    console.log("Reactions:", reactions);
  };

  const popBubble = (id) => {
    setBubbles((prev) => prev.filter((bubble) => bubble.id !== id));
    confetti({
      particleCount: 50,
      spread: 30,
      origin: { y: 0.8, x: Math.random() },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card-container"
      >
        <h1 className="text-3xl font-bold">{resume?.name || "Your Name"}</h1>
        <p className="text-lg">{resume?.title || "Job Title"}</p>
        <p>Email: you@example.com</p>
        <p>Website: yourwebsite.com</p>
        <p>Card Views: {clicks}</p>
        <button onClick={playAudio} className="mt-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
          Play Voice Intro
        </button>
        <button onClick={logReaction} className="mt-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded">
          React (Smile)
        </button>
        <div className="resume-section mt-4">
          <h2 className="text-xl font-semibold">Skills</h2>
          <ul className="list-disc pl-5">
            {resume?.skills?.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
        <div id="ar-container" className="mt-4 h-64 relative">
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              onClick={() => popBubble(bubble.id)}
              className="bubble absolute w-10 h-10 rounded-full cursor-pointer"
              style={{ left: bubble.x, top: bubble.y }}
            ></div>
          ))}
        </div>
        <audio ref={audioRef} src="/intro.mp3" />
      </motion.div>
    </div>
  );
}