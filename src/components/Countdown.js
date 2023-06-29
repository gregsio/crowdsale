import React, { useEffect, useState } from "react";

 const Countdown = ({expireTimestamp}) => {

    const calculateTimeLeft = () => {
    const difference = +expireTimestamp*1000 - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft(expireTimestamp));
    }, 1000);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span key={interval}>
        <strong>
        {timeLeft[interval]} {interval}{" "}
        </strong>
      </span>
    );
  });
  return (
        <div className="text-center">
        {timerComponents.length ? <p>This ICO ends in {timerComponents}! <br/>Hurry up! </p> : <span>Time's up! The Crowdsale has ended.</span>}
        </div>
  );
}

export default Countdown;
