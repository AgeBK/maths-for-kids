import React, { useCallback, useEffect, useState, useRef } from "react";
import Timer from "./components/Timer";
import Records from "./components/Records";
import Spelling from "./components/Spelling";
import styles from "./App.module.css";
import correct from "./audio/correct.mp3";
// import inCorrect from "./audio/incorrect.mp3";
import wrong from "./audio/wrong.mp3";
import cheer from "./audio/cheer.mp3";
import fail from "./audio/wah-wah-sad.mp3";

let res = [];
let currentResults = [];
let resultLog = [];
let spellingLog = [];
let pos = null; // TODO: shouldn't have these globals, refs?

function App() {
  const answerRef = useRef();
  const [randoms, setRandoms] = useState([]);
  const [results, setResults] = useState([]);
  const [complete, setComplete] = useState(false);
  // const [answer, setAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [user, setUser] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [answerEnabled, setAnswerEnabled] = useState(false);
  const [isMaths, setIsMaths] = useState(true);
  // const [toggleChallenge, setToggleChallenge] = useState();
  const [skill, setSkill] = useState("addition");
  const [recordDate, setRecordDate] = useState("");

  let mathRecords = JSON.parse(localStorage.getItem("maths-for-kids")) || [];
  const mathObj = {
    addition: "+",
    subtraction: "-",
    multiplication: "x",
    division: "/",
  };

  const toggleChallenge = () => {
    setIsMaths(!isMaths);
  };

  const onSkillChange = (val) => setSkill(val);

  useEffect(() => {
    // console.log("results");
    // console.log(results);

    const handleTabClosing = () => {
      const a = document.createElement("a");
      const blob = new Blob([JSON.stringify(mathRecords)]);
      a.href = URL.createObjectURL(blob);
      a.download = "mathRecords-" + Date().split(" ").slice(0, 3).toString(); //filename to download
      a.click();
    };

    window.addEventListener("unload", handleTabClosing);

    let arr = [];

    if (skill === "addition" || skill === "subtraction") {
      const min = 3;
      const max = 11;
      const totalNumbers = 2;

      for (var i = 0; i < totalNumbers; i++) {
        arr.push(Math.round(Math.random() * max) + min);
      }

      arr = arr.sort((a, b) => (a - b > 0 ? -1 : 1)); // larger random number first, min number 3
      arr[0] = arr[0] + min; // first number atleast 3 larger than second number
    } else if (skill === "multiplication") {
      let baseNum = Math.round(Math.random()) % 2 === 0 ? 2 : 3;
      let max = baseNum % 2 === 0 ? 30 : 12;
      // console.log([baseNum, max]);

      arr.push(baseNum);
      arr.push(Math.round(Math.random() * max));
    } else {
      // const baseNum = 2;
      // const max = 20;

      let baseNum = Math.round(Math.random()) % 2 === 0 ? 2 : 3;
      let max = baseNum % 2 === 0 ? 30 : 12;

      arr.push(Math.round(Math.random() * max) * baseNum + baseNum);
      arr.push(baseNum);
      console.log(arr);
    }
    setRandoms([...arr]);
    setUserAnswer("");

    return () => window.removeEventListener("unload", handleTabClosing);
  }, [results, skill]); // TODO: test this, do I need user??

  const onNameChange = (e) => {
    const { value } = e.target;
    setUser(value);
    setEnabled(!!value.length); // TODO: better way to do this?
  };

  const onStart = () => {
    res = [];
    resultLog = [];
    spellingLog = [];
    setComplete(false);
  };

  const checkAnswer = (num1, num2) => {
    let result = 0;
    switch (skill) {
      case "addition":
        result = num1 + num2;
        // mathSign = "+"; // TODO: ? mathsign ?
        break;
      case "subtraction":
        result = num1 - num2;
        // mathSign = "-";
        break;
      case "multiplication":
        result = num1 * num2;
        // mathSign = "*";
        break;
      case "division":
        result = num1 / num2;
        // mathSign = "/";
        break;
      default:
        break;
    }
    return result;
  };

  const storeAnswer = (e) => {
    e.preventDefault();
    // console.log("storeAnswer");

    let answer = answerRef.current.value;
    if (answer.length < 1) return;
    // const isCorrect =
    //   Number(userAnswer) === checkAnswer(randoms[0], randoms[1]); // using state
    const resultObj = {
      num1: randoms[0],
      num2: randoms[1],
      skill,
      answer,
      correct: Number(answer) === checkAnswer(randoms[0], randoms[1]),
    };
    resultLog.push(resultObj);
    // console.log(resultLog);

    const isCorrect = Number(answer) === checkAnswer(randoms[0], randoms[1]);

    const appropriateSound = new Audio(isCorrect ? correct : wrong);
    appropriateSound.play();

    res = [...res, isCorrect];
    answerRef.current.value = "";
    setResults([...results, isCorrect]); // TODO: NOT USING, causing rerenders, seems to reset to empty onComplete?
    // console.log(results);
  };

  const updateRes = (results, log) => {
    console.log(results);
    console.log(log);

    res = results; // true/false
    spellingLog = log; // actual answers
  };

  const sortRecords = (arr) => {
    return arr
      .sort((a, b) => (a.correct > b.correct ? -1 : 1))
      .map((val, ind) => {
        val.position = ind + 1;
        return val;
      }); // TODO: 1 liner for map??
  };

  const onComplete = () => {
    setComplete(true);
    const currentDate = Date().split(" ").slice(0, 5).toString();
    currentResults = [
      {
        date: currentDate,
        name: user,
        challenge: isMaths ? skill : "Spelling",
        answered: res.length,
        correct: res.filter((val) => val === true).length,
        wrong: res.filter((val) => val === false).length,
      },
    ]; // TODO: current Results? do I need seperate?

    const arr = sortRecords([...mathRecords, ...currentResults]);

    pos = arr.findIndex((val) => val.date === currentDate);
    // console.log("Postion: " + pos);

    const onCompleteMusic = new Audio(pos < 50 ? cheer : fail);
    onCompleteMusic.play();

    localStorage.setItem("maths-for-kids", JSON.stringify(arr));

    // totalAttempts++;
    // localStorage.setItem(
    //   "maths-for-kids-total",
    //   JSON.stringify(totalAttempts + 1)
    // );

    setAnswerEnabled(false);
    setRecordDate(currentDate);
  };

  const handleEnableAnswers = useCallback((val) => {
    setAnswerEnabled(val);
  }, []);

  const restart = () => setResults([]);

  const rand = () => Math.round(Math.random() * 20); // random colours for questions

  //////////////////////////////////////////////////////////

  const testing = () => {
    console.log("testing");
    res = [];
    for (let i = 0; i < 22; i++) {
      res.push(true);
    }
    onComplete();
  };

  const erase = () => {
    console.log("erase");
    mathRecords = mathRecords.filter((val) => val.name !== "");
    mathRecords = sortRecords(mathRecords);
    localStorage.setItem("maths-for-kids", JSON.stringify(mathRecords));
    setRecordDate(""); // trigger rerender to see update
  };

  //////////////////////////////////////////////////////////

  return (
    <article
      className={`${styles.mainCont} ${!isMaths && styles.mainContSpell}`}
    >
      <div className={styles.mainContInner}>
        {results}
        <div className={styles.subCont}>
          <input
            type="text"
            onChange={onNameChange}
            className={`${styles.hdr} ${styles.enterName} `}
            placeholder="Enter your name here"
            maxLength={10}
            value={user}
            autoFocus
          ></input>
        </div>

        <div className={styles.hdr}>
          <h1 className={styles.ib}>Change Challenge</h1>
          <button onClick={toggleChallenge}>
            {isMaths ? "Spelling" : "Maths"}
          </button>
        </div>

        <Timer
          onStart={onStart}
          onComplete={onComplete}
          setAnswerEnabled={setAnswerEnabled}
          handleEnableAnswers={handleEnableAnswers}
          answerEnabled={answerEnabled}
          enabled={enabled}
          // ref={ref}
        />
        {isMaths ? (
          <>
            {answerEnabled && (
              <div className={styles.mathsContainer}>
                <div className={styles.resultsCont}>
                  <div className={styles.results}>Answered: {res.length}</div>
                  <div className={`${styles.results} ${styles.correct}`}>
                    Correct: {res.filter((val) => val === true).length}
                  </div>
                  <div className={`${styles.results} ${styles.error}`}>
                    Wrong: {res.filter((val) => val !== true).length}
                  </div>
                </div>
                <form className={styles.form} onSubmit={storeAnswer}>
                  <div className={`${styles.num} ${styles[`color${rand()}`]}`}>
                    {randoms[0]}
                  </div>
                  <div className={`${styles.num} ${styles[`color${rand()}`]}`}>
                    {mathObj[skill]}
                  </div>
                  <div className={`${styles.num} ${styles[`color${rand()}`]}`}>
                    {randoms[1]}
                  </div>
                  <div className={`${styles.num} ${styles[`color${rand()}`]}`}>
                    =
                  </div>
                  <input
                    className={`${styles.num} ${styles.input}`}
                    type="text"
                    ref={answerRef}
                    disabled={!user || !answerEnabled}
                    required
                    autoFocus
                  ></input>
                  <button
                    className={`${styles.num} ${styles.btn} ${
                      !enabled && styles.hide
                    }`}
                    onClick={storeAnswer}
                    disabled={!user || !answerEnabled}
                  >
                    Answer
                  </button>
                </form>
              </div>
            )}
            <div className={`${styles.skillCont} ${!enabled && styles.hide}`}>
              {Object.entries(mathObj).map(([name, symbol], ind) => {
                return (
                  <span key={ind}>
                    <button
                      className={`${styles.btn} ${
                        name !== skill && styles.not
                      }`}
                      onClick={() => onSkillChange(name, symbol)}
                    >
                      {name}
                    </button>
                  </span>
                );
              })}
            </div>

            {/* <button onClick={testing}>Testing</button>
            <button onClick={erase}>Erase</button> */}
          </>
        ) : (
          <Spelling updateRes={updateRes} answerEnabled={answerEnabled} />
        )}
        <Records
          recordDate={recordDate}
          // totalAttempts={totalAttempts}
          resultLog={resultLog}
          spellingLog={spellingLog}
          complete={complete}
          currentResults={currentResults}
          pos={pos}
        />
        <div className={styles.mathItemsCont}>
          {Object.keys(mathObj).map((val, ind) => (
            <div className={styles.mathItems} key={val}>
              <img src={require(`./img/maths_${val}.png`)} alt={val} />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default App;
