import "./style.scss";
import "./style-mobile.scss";

import React, { FC, useEffect, useRef, useState } from "react";

import { CounterProps } from "./Counter.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../Modal";
import { faPause } from "@fortawesome/free-solid-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const Counter: FC<CounterProps> = ({ isPaused, setIsPaused, finishQuizz }) => {
  const [countdown, setCountdown] = useState("60:00");
  const [remaingMinutes, setRemainingMinutes] = useState(60);
  const [openModal, setOpenModal] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const intervalRefTimer = useRef<NodeJS.Timeout>();
  const [timer, setTimer] = useState("1:00:00");
  const [startTimer, setStartTimer] = useState(false);
  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const continueQuizz = () => {
    setOpenModal(false);
    setIsPaused(false);
    setStartTimer(true);
  };

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        const [minutes, seconds] = countdown.split(":").map(Number);
        setRemainingMinutes(minutes);
        if (minutes === 0 && seconds === 0) {
          clearInterval(intervalRef?.current);
        } else {
          if (seconds === 0) {
            setCountdown(`${minutes - 1}:59`);
          } else {
            setCountdown(
              `${minutes}:${seconds < 10 ? `0${seconds - 1}` : seconds - 1}`
            );
          }
        }
      }, 1000);
    } else {
      clearInterval(intervalRef?.current);
    }

    return () => clearInterval(intervalRef?.current);
  }, [countdown, isPaused]);

  useEffect(() => {
    if (remaingMinutes === 0 && !startTimer) {
      console.log(remaingMinutes, startTimer);
      setOpenModal(true);
      setIsPaused(true);
    }
  }, [remaingMinutes]);

  useEffect(() => {
    if (startTimer) {
      if (!isPaused) {
        intervalRefTimer.current = setInterval(() => {
          const [hours, minutes, seconds] = timer.split(":").map(Number);
          if (seconds === 59) {
            setTimer(
              `${hours}:${minutes < 9 ? `0${minutes + 1}` : minutes + 1}:00`
            );
          } else if (minutes === 59) {
            setTimer(
              `${hours + 1}:${minutes < 9 ? `0${minutes}` : minutes}:${seconds}`
            );
          } else {
            setTimer(
              `${hours}:${minutes < 9 ? `0${minutes}` : minutes}:${
                seconds < 9 ? `0${seconds + 1}` : seconds + 1
              }`
            );
          }
        }, 1000);
      } else {
        clearInterval(intervalRefTimer?.current);
      }

      return () => clearInterval(intervalRefTimer?.current);
    }
  }, [startTimer, timer, remaingMinutes, isPaused]);

  return (
    <div className="Counter">
      <div
        id="countdown-wrapper"
        className="countdown"
        style={
          {
            "--value": remaingMinutes.toString(),
            "--max": "60",
          } as React.CSSProperties
        }
      >
        <div className="countdown__content">
          <span id="countdown">{!startTimer ? countdown : timer}</span>
          <FontAwesomeIcon
            onClick={handlePauseResume}
            icon={!isPaused ? faPause : faPlay}
          />
        </div>
      </div>

      <Modal
        isOpen={openModal}
        setIsClosed={() => setOpenModal(false)}
        type="warning"
        title="Time's up!"
        onClose={() => finishQuizz()}
        onConfirm={() => continueQuizz()}
        labelOnConfirm="Continue"
        labelOnCancel="Finish"
        closeOnBackdropClick={false}
      >
        <p>
          Your time is up ! Do you want to finish and see the result or do you
          want to continu ?
        </p>
      </Modal>
    </div>
  );
};

export default Counter;
