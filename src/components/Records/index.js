import React, { useState, useRef } from "react";
import styles from "./Records.module.css";
import firstPlace from "../../img/first.jpeg";
// import wrong from "../../audio/wrong.mp3";
import cheer from "../../audio/cheer.mp3";
import fail from "../../audio/wah-wah-sad.mp3";

const Records = ({ recordDate, resultLog, spellingLog, pos, complete }) => {
  console.log({ recordDate, resultLog, spellingLog, pos, complete });
  const [showAllRecs, setShowAllRecs] = useState(false);
  const [orderByDate, setOrderByDate] = useState(false);
  const [orderByPos, setOrderByPos] = useState(false);

  const mathObj = {
    addition: "+",
    subtraction: "-",
    multiplication: "x",
    division: "/",
  };

  console.log("Records");
  // console.log(recordDate);
  // console.log(pos);
  // console.log(resultLog);

  let mathRecords = JSON.parse(localStorage.getItem("maths-for-kids"));

  // let test = mathRecords.map((val) => {
  //   if (val.name.length > 20) {
  //     val.name = "Rusty Buns";
  //   }
  //   return val;
  // });

  // console.log(test);

  // localStorage.setItem("maths-for-kids", JSON.stringify(test));

  console.log(mathRecords);

  if (orderByDate) {
    mathRecords = mathRecords.sort((a, b) =>
      Number(new Date(a.date)) - Number(new Date(b.date)) < 0 ? 1 : -1
    );
    // console.log(mathRecords);
  } else {
    mathRecords = mathRecords.sort((a, b) =>
      a.position - b.position < 0 ? -1 : 1
    );
    // console.log(mathRecords);
  }

  const sortByDate = () => {
    setOrderByDate(!orderByDate);
    setShowAllRecs(true);
  };

  const top10Recs = mathRecords.filter((_, ind) => ind < 10);
  const data = showAllRecs ? mathRecords : top10Recs;

  let msg = "";
  // let pos = -1;
  const placeArr = [
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
  ];

  const First = () => {
    return (
      <>
        You are the Champion <br />
        <img src={firstPlace} className={styles.firstPlace} alt="First place" />
      </>
    );
  };

  if (mathRecords?.length && recordDate && pos) {
    switch (pos) {
      case 0:
        msg = <First />;
        break;
      case [1, 2, 3, 4, 5, 6, 7, 8, 9].includes(pos) && pos:
        msg = "Awesome!! ";
        break;
      default:
        msg = `You didn't make the top 10`;
        break;
    }
  }

  const top50 = () => {
    const completeMusic = new Audio(pos < 50 ? cheer : fail);
    completeMusic.play();
    setOrderByDate(false);
    setOrderByPos(true);
    setShowAllRecs(!showAllRecs);
  };

  const FormatDate = ({ date }) => {
    const today = Date().split(" ").slice(1, 4);
    const fmtDate = `${today[1]} ${today[0]} ${today[2]}`;

    const dtArr = date.split(",");
    if (fmtDate === `${dtArr[2]} ${dtArr[1]} ${dtArr[3]}`) {
      return (
        <div className={styles.today}>
          {`${dtArr[2]} ${dtArr[1]} ${dtArr[3]}`}
        </div>
      );
    }
    return `${dtArr[2]} ${dtArr[1]} ${dtArr[3]}`;
  };

  const skill = () => {};

  const isToday = () => {};

  const AnswerReview = () => {
    return (
      <>
        {complete && (
          <div className={styles.ansReview}>
            <hr />
            {console.log(resultLog)}
            {resultLog.length > 0 && (
              <>
                <span className={styles.correct}>
                  Correct: {resultLog.filter((val) => val.correct).length}
                </span>
                <span className={styles.wrong}>
                  Wrong: {resultLog.filter((val) => !val.correct).length}
                </span>
                <div className={styles.resultCont}>
                  {resultLog.map(
                    ({ num1, num2, skill, answer, correct }, ind) => {
                      return (
                        <div className={styles.result} key={ind}>
                          <span className={styles.qn}>Q{ind + 1}:</span>
                          <span className={styles.num}>{num1}</span>
                          <span className={styles.skill}>{mathObj[skill]}</span>
                          <span className={styles.num}>{num2}</span>
                          <span className={styles.equals}>=</span>
                          <span
                            className={correct ? styles.correct : styles.wrong}
                          >
                            {answer}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </>
            )}
            {spellingLog.length > 0 && (
              <>
                <span className={styles.correct}>
                  Correct:{" "}
                  {spellingLog.filter((val) => val[0] === val[1]).length}
                </span>
                <span className={styles.wrong}>
                  Wrong: {spellingLog.filter((val) => val[0] !== val[1]).length}
                </span>
                {spellingLog.map((val, ind) => {
                  return (
                    <div className={styles.result} key={ind}>
                      <span className={styles.qn}>Q{ind + 1}:</span>
                      <span className={styles.num}>{val[0]}</span>
                      <span
                        className={
                          val[0] === val[1] ? styles.correct : styles.wrong
                        }
                      >
                        {val[1]}
                      </span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <section className={styles.mainCont}>
      {/* <h1 className={styles.total}>Total Attempts: {totalAttempts}</h1> */}
      <h1 className={styles.hdr}>
        {!showAllRecs ? "Top 10 Records" : "All Records"}
      </h1>
      <button className={styles.btn} onClick={top50}>
        {!showAllRecs ? "Show All" : "Show Top 10"}
      </button>
      {/* {!showAllRecs && (
        <> */}
      <br /> <span className={styles.allTotal}>({mathRecords.length})</span>
      {/* </>
      )} */}
      <AnswerReview />
      <h2>
        {pos > 0 && pos < 10 && (
          <div className={styles.pyro}>
            <div className={styles.before}></div>
            <div className={styles.after}></div>
          </div>
        )}
        {pos === 0 ? <First /> : msg}
        {pos > 0 && (
          <>
            <br />
            <span className={styles.correct}>
              You placed: {placeArr[pos] || pos + 1} / {mathRecords.length}
            </span>
          </>
        )}
      </h2>
      {/* )} */}
      <div className={styles.recordContainer}>
        <div className={styles.record}>
          <span className={styles.position}>position</span>
          <span className={styles.name}>name</span>
          <span className={styles.challenge}>challenge</span>
          <span className={styles.answered}>answered</span>
          <span className={styles.correct}>correct</span>
          <span className={styles.wrong}>wrong</span>
          <span className={styles.date}>
            <button className={styles.dateBtn} onClick={sortByDate}>
              date
            </button>
          </span>
        </div>
        {data?.map((val, ind) => (
          <div
            key={ind}
            className={`${styles.records} ${ind === 0 && styles.hdrRow} ${
              ind > 0 && ind % 2 && styles.altRow
            }  ${val.position === 1 && styles.champ} ${
              val.date === recordDate && styles.current
            } ${ind === 10 && styles.cutOff} ${ind > 49 && styles.cutOff50}`}
          >
            <span className={styles.position}>{val.position}</span>
            <span className={styles.cap}>{val.name}</span>
            <span className={styles.cap}>{val.challenge}</span>
            <span className={styles.answered}>{val.answered}</span>
            <span className={styles.correct}>{val.correct}</span>
            <span className={styles.wrong}>{val.wrong}</span>
            <span className={styles.date}>
              <FormatDate date={val.date} />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(Records);
