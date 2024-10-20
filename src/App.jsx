import React, { useState, useEffect } from 'react';
import './App.css'; // Ensure this is correct

const CountdownTimer = ({ targetDate, eventName }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        milliseconds: Math.floor((difference % 1000) / 10), // Update milliseconds
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isEventReached, setIsEventReached] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (Object.keys(newTimeLeft).length === 0) {
        clearInterval(timer);
        setIsEventReached(true); // Event time reached
      }
    }, 1); // Update every millisecond

    return () => clearInterval(timer);
  }, [targetDate]); // Include targetDate as a dependency

  if (isEventReached) {
    return (
      <div className="countdown-container">
        <h1 className="event-title">{eventName}</h1>
        <h2 className="event-message">🎉 Event is Here! 🎉</h2>
      </div>
    );
  }

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval] && interval !== "milliseconds") {
      return;
    }

    timerComponents.push(
      <div key={interval} className="time-box">
        <span className="time">{timeLeft[interval]}</span>
        <span className="interval-label">{interval}</span>
      </div>
    );
  });

  return (
    <div className="countdown-container">
      <h1 className="event-title">{eventName || "Event Countdown"}</h1>
      <div className="calendar-icon">
        <img
          src="https://webstockreview.net/images/calendar-icon-png-transparent-12.png"
          alt="Calendar"
          className="calendar-image"
        />
      </div>
      <div className="timer">
        {timerComponents.length ? timerComponents : <span className="event-here">Event is Here!</span>}
      </div>
    </div>
  );
};

const App = () => {
  const [eventName, setEventName] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [showTimer, setShowTimer] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowTimer(true);
  };

  return (
    <div className="app-container">
      {!showTimer ? (
        <form onSubmit={handleSubmit} className="event-form">
          <h2>Set Your Event</h2>
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            required
          />
          <button type="submit">Start Countdown</button>
        </form>
      ) : (
        <CountdownTimer targetDate={targetDate} eventName={eventName} />
      )}
      <p className="quote">"Life isn’t a matter of milestones but of moments."</p>
    </div>
  );
};

export default App;