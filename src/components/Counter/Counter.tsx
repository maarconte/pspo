import "./style.scss";
import "./style-mobile.scss";

import { FC, useEffect, useRef, useState } from "react";

import { CounterProps } from "./Counter.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../Modal";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";

// Constants
const INITIAL_COUNTDOWN_SECONDS = 60 * 60; // 60 minutes in seconds
const INITIAL_TIMER = "1:00:00";

// Helper functions
const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

const formatTimer = (hours: number, minutes: number, seconds: number): string => {
  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${hours}:${paddedMinutes}:${paddedSeconds}`;
};

const parseTime = (timeString: string): [number, number] => {
  const [minutes, seconds] = timeString.split(":").map(Number);
  return [minutes, seconds];
};

const parseTimer = (timerString: string): [number, number, number] => {
  const [hours, minutes, seconds] = timerString.split(":").map(Number);
  return [hours, minutes, seconds];
};

const Counter: FC<CounterProps> = ({ isPaused, setIsPaused, finishQuizz }) => {
  const [countdownSeconds, setCountdownSeconds] = useState(INITIAL_COUNTDOWN_SECONDS);
  const [openModal, setOpenModal] = useState(false);
  const [timer, setTimer] = useState(INITIAL_TIMER);
  const [startTimer, setStartTimer] = useState(false);

  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const continueQuizz = () => {
    setOpenModal(false);
    setIsPaused(false);
    setStartTimer(true);
  };

  // Countdown timer effect
  useEffect(() => {
    if (!isPaused && !startTimer) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdownSeconds((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [isPaused, startTimer]);

  // Show modal when countdown reaches zero
  useEffect(() => {
    if (countdownSeconds === 0 && !startTimer) {
      setOpenModal(true);
      setIsPaused(true);
    }
  }, [countdownSeconds, startTimer, setIsPaused]);

  // Elapsed timer effect
  useEffect(() => {
    if (startTimer && !isPaused) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          const [hours, minutes, seconds] = parseTimer(prevTimer);

          let newSeconds = seconds + 1;
          let newMinutes = minutes;
          let newHours = hours;

          if (newSeconds === 60) {
            newSeconds = 0;
            newMinutes += 1;
          }

          if (newMinutes === 60) {
            newMinutes = 0;
            newHours += 1;
          }

          return formatTimer(newHours, newMinutes, newSeconds);
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [startTimer, isPaused]);

  const counterStyle = {
    "--value": countdownSeconds / 60,
    "--max": "60",
  } as React.CSSProperties;

  return (
    <div className="Counter">
      <div
        id="countdown-wrapper"
        className="countdown"
        style={counterStyle}
      >
        <div className="countdown__content">
          <span id="countdown">
            {startTimer ? timer : formatTime(countdownSeconds)}
          </span>
          <FontAwesomeIcon
            onClick={handlePauseResume}
            icon={isPaused ? faPlay : faPause}
          />
        </div>
      </div>

      <Modal
        isOpen={openModal}
        setIsClosed={() => setOpenModal(false)}
        type="warning"
        title="Time's up!"
        onClose={finishQuizz}
        onConfirm={continueQuizz}
        labelOnConfirm="Continue"
        labelOnCancel="Finish"
        closeOnBackdropClick={false}
      >
        <p>
          Your time is up! Do you want to finish and see the result or do you
          want to continue?
        </p>
      </Modal>
    </div>
  );
};

export default Counter;
