import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { createApi } from "unsplash-js";
import { animals } from "../../data/animals";
import { searchResults } from "../../data/splashSearch";
import styles from "./Spelling.module.css";
import right from "../../audio/correct.mp3";
import wrong from "../../audio/wrong.mp3";
const unSplashAccessKey = "WwQoe_p8T_CLABx_Ay32MvDbK-FOc9vG-j43s2WpIdU";
const unSplashSecretKey = "6kySiTH4Fqe2KUlMQhAJ9d-fQUmOczykiXtUoLtQbqU";

// const unsplash = new Unsplash({
//   accessKey: unSplashAccessKey,
// });

// const unsplash = createApi({ accessKey: unSplashAccessKey });

function SearchPhotos({ updateRes, answerEnabled }) {
  console.log("SearchPhotos");

  const [data, setData] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [results, setResults] = useState([]);
  const [randomAnimal, setRandomAnimal] = useState("");
  const answerRef = useRef();
  const indexRef = useRef(1);
  const reAlph = new RegExp(/^[a-z]+$/);

  console.log(updateRes);

  useEffect(() => {
    console.log("Spelling UE");

    console.log(new Date());
    const rand = Math.round(Math.random() * animals.length);
    const someAnimal = animals[rand];
    console.log(someAnimal);

    // unsplash.search
    //   .getPhotos({
    //     query: someAnimal,
    //   })
    //   .then((result) => {
    //     console.log(result.response.results);
    //     setData(result.response.results);
    //     setRandomAnimal(someAnimal);
    //     setAnswer(someAnimal.substring(0, 1));
    //   });
    console.log(searchResults);
    setData(searchResults);
    setRandomAnimal(someAnimal);
    setAnswer(someAnimal.substring(0, 1));
  }, [results]);

  useEffect(() => {
    if (answerRef.current && answerRef.current.children[indexRef.current])
      answerRef.current.children[indexRef.current].focus();
  }, [answer, results, answerEnabled]);

  const onChange = (e, index) => {
    console.log("onChange");
    const value = e.target.value;
    // console.log(value);
    // console.log(index);
    // console.log(randomAnimal.length);

    // emualte tab press if value present and not last input box
    if (reAlph.test(value) && randomAnimal.length !== index + 1) {
      indexRef.current = index + 1;
    }

    handleEnableAnswers(value, index);
  };

  const onKeyUp = (e, index) => {
    if (e.keyCode === 8) {
      indexRef.current = index - 1;
      handleEnableAnswers("", indexRef.current);
    }
  };

  const handleEnableAnswers = (val, index) => {
    const newAnswer = [...answer];
    newAnswer[index] = val;
    setAnswer(newAnswer);
  };

  const onClick = (index) => {
    console.log(index);
    indexRef.current = index;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    indexRef.current = 1;
    const appropriateSound = new Audio(
      randomAnimal === answer.join("") ? right : wrong
    );
    appropriateSound.play();
    userResults();
    setResults([...results, [randomAnimal, answer.join("")]]);
  };

  const userResults = () => {
    if (results.length > 0) {
      console.log("UserResults");
      console.log(results);
      const userResults = results.reduce(
        (acc, val) => {
          acc.total = [...acc.total, val[0] === val[1]];
          acc.correct += val[0] === val[1] ? 1 : 0;
          return acc;
        },
        { total: [], correct: 0 }
      );
      console.log(userResults);
      const { total, correct } = userResults;
      updateRes(total, results);
    }
  };

  const AnswerInput = () => {
    console.log("AnswerInput");
    console.log(answer);
    console.log(randomAnimal.split(""));

    const result = randomAnimal.split("").map((val, index) => {
      console.log(val);
      return (
        <>
          {index === 0 ? (
            <span className={styles.answerInitial} key={index}>
              {val}
            </span>
          ) : (
            <input
              className={styles.answerInput}
              onChange={(e) => onChange(e, index)}
              onKeyUp={(e) => onKeyUp(e, index)}
              onClick={() => onClick(index)}
              type="text"
              id={`input-${index}`}
              value={answer[index]}
              key={index}
              maxLength="1"
            />
          )}
        </>
      );
    });
    return (
      <>
        {answerEnabled && (
          <>
            <hr />
            <span className={styles.answerCont} ref={answerRef}>
              {result}
            </span>
            <button className={styles.btn} onClick={onSubmit}>
              Answer
            </button>
          </>
        )}
      </>
    );
  };

  const Images = () => {
    console.log("Images");
    return (
      <ul>
        {data.map((val) => {
          return (
            <li className={styles.listItem} key={val.id}>
              <img src={val.urls.thumb} alt={val.alt_description} />
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
      <Images />
      <form onSubmit={onSubmit}>
        <AnswerInput />
      </form>
    </>
  );
}

const Spelling = ({ updateRes, answerEnabled }) => {
  return (
    <section className={styles.container}>
      <SearchPhotos updateRes={updateRes} answerEnabled={answerEnabled} />
    </section>
  );
};

export default Spelling;
