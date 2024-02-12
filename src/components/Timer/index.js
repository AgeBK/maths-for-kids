import React, { useEffect, useState } from "react";
import styles from "./Timer.module.css";
import startBeeps from "../../audio/countdownStart.mp3";
import fiveLeft from "../../audio/5toGo.mp3";

let interval = undefined;
let preInterval = undefined;
let currentTime;

function Timer({
  onStart,
  onComplete,
  handleEnableAnswers,
  answerEnabled,
  enabled,
  ref,
}) {
  const [timer, setTimer] = useState("00:00");
  const [showTimer, setShowTimer] = useState(true);
  const [hideTimer, setHideTimer] = useState(false);
  const [warning, setWarning] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [remove, setRemove] = useState(false);
  const preArr = ["Set", "Go !!!"];
  const startTime = 60;
  let timeDisplay = "00:00";
  let i = 0;

  console.log("Timer");
  // console.log(onComplete);
  // console.log(handleEnableAnswers);
  // console.log("answerEnabled: " + answerEnabled);
  // console.log("enabled:" + enabled);

  // useEffect(() => {});

  const startTimer = () => {
    if (currentTime !== 0) currentTime = currentTime || startTime; // TODO: confusing??

    let minutes = parseInt(currentTime / 60, 10);
    let seconds = parseInt(currentTime % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    timeDisplay = minutes + ":" + seconds;

    setTimer(timeDisplay);

    const fiveToGo = new Audio(fiveLeft);

    currentTime === 15 && setWarning(true);
    if (currentTime === 5) {
      setUrgent(true);
      fiveToGo.play();
    }

    if (--currentTime < 0) {
      setTimer(<span className={styles.correct}>Finished</span>);
      fiveToGo.pause();
      clearInterval(interval);
      interval = undefined;
      currentTime = undefined;
      onComplete();
    }
  };

  const preTimer = () => {
    setTimer(<span className={styles.correct}>{preArr[i]}</span>); // set

    if (++i > preArr.length) {
      i = 0;
      clearInterval(preInterval);
      preInterval = undefined;
      // console.log("finished Pre");

      if (!interval) {
        handleEnableAnswers(true);
        // setTimer(<span className={styles.correct}>{preArr[i]}</span>); // go
        interval = setInterval(startTimer, 1000);
      }
    }
  };

  const start = () => {
    onStart();
    const getReady = new Audio(startBeeps);
    getReady.play();
    if (!preInterval) {
      setTimer(<span className={styles.correct}>Get Ready</span>);
      preInterval = setInterval(preTimer, 1000);
      // ref.current.focus();
    }
  };

  const stop = () => {
    clearInterval(interval);
    interval = undefined;
  };

  const reset = () => {
    setTimer(<span>00:00</span>);
    clearInterval(interval);
    interval = undefined;
    currentTime = undefined;
  };

  // const toggleTimer = () => setHideTimer(!hideTimer);

  // const rand = () => Math.round(Math.random() * 20);

  return (
    <div className={`${styles.timerCont} `}>
      <div
        id="time"
        className={`${styles.time} ${hideTimer && styles.hide} 
        ${warning && styles.warning} ${urgent && styles.urgent} `}
      >
        {timer}
      </div>
      {/* ${!warning && !urgent && styles.standard}  */}
      <div
        className={`${styles.btnCont} ${!enabled && styles.hide} ${
          styles.subCont
        }`}
      >
        {/* // TODO: make buttons array and look at remove functionallity*/}
        <div
          className={`${styles.timerBtnCont} ${answerEnabled && styles.hide}`}
        >
          <span className={remove ? styles.hide : undefined}>
            <button
              id="button-start"
              className={styles.btn}
              onClick={start}
              disabled={!enabled}
            >
              Start
            </button>
          </span>
          <span className={remove ? styles.hide : undefined}>
            <button id="button-stop" className={styles.btn} onClick={stop}>
              Stop
            </button>
          </span>
          <span className={remove ? styles.hide : undefined}>
            <button id="button-reset" className={styles.btn} onClick={reset}>
              {/* className={`${remove && styles.hide} ${styles.btn}`} */}
              Reset
            </button>
          </span>
          <span>
            <button
              onClick={() => {
                setRemove(!remove);
                setHideTimer(!hideTimer);
                reset();
                handleEnableAnswers(true);
              }}
              className={`${styles.btn} ${styles.remove}`}
            >
              {hideTimer ? "Show" : "Remove"}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Timer);
