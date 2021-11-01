import { useEffect, useState } from "react";

const BlindWriter = () => {
  const [text, setText] = useState("");
  let [title, setTitle] = useState("");
  let [wordGoal, setWordGoal] = useState(750);
  let words = text.match(/\S+/g)?.length || 0;
  let [time, setTime] = useState(0);
  let [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (timerActive) {
      let interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [timerActive]);

  useEffect(() => {
    if (words > wordGoal) return setTimerActive(false);
    if (!timerActive) setTimerActive(true);
  }, [text, words]);

  return (
    <>
      <span style={TitleStyle}>BLIND WRITER</span>
      <textarea
        spellCheck={false}
        value={text}
        onChange={(e) => {
          setText(e.currentTarget.value);
          if (!timerActive) setTimerActive(true);
        }}
        style={{
          ...TextareaStyle,
          fontFamily: words > wordGoal ? "serif" : "Flow Block",
          fontSize: words > wordGoal ? "18px" : "16.5px",
        }}
      />
      <Counter completed={words} wordGoal={wordGoal}>
        <div style={StatusBarStyle}>
          <Timer seconds={time} />
          <Words words={words} wordGoal={wordGoal} setWordGoal={setWordGoal} />
          <input
            style={TitleInputStyle}
            type="text"
            value={title}
            spellCheck={false}
            placeholder="title / prompt"
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
          <button
            style={{
              ...ButtonStyle,
            }}
            onClick={() => setTimerActive(!timerActive)}
          >
            {timerActive ? "pause" : "start"}
          </button>
          <button
            style={ButtonStyle}
            onClick={() => {
              setText("");
              setTime(0);
              setTimerActive(false);
            }}
          >
            reset
          </button>
        </div>
      </Counter>
    </>
  );
};

const Counter: React.FC<{ completed: number; wordGoal: number }> = (props) => {
  let percentage = props.completed / (props.wordGoal / 100);
  return (
    <div
      style={{
        width: `${Math.min(percentage, 100)}%`,
        ...CounterStyle,
      }}
    >
      {props.children}
    </div>
  );
};

const Words = (props: {
  words: number;
  wordGoal: number;
  setWordGoal: (g: number) => void;
}) => {
  let length = props.wordGoal.toString().length;
  return (
    <div>
      {`${("0".repeat(length) + props.words).slice(-1 * length)} / `}{" "}
      <input
        type="number"
        value={props.wordGoal}
        onChange={(e) => {
          props.setWordGoal(parseInt(e.currentTarget.value) || 0);
        }}
        style={{
          fontSize: "inherit",
          fontFamily: "inherit",
          background: "inherit",
          color: "inherit",
          border: "none",
          width: "48px",
        }}
      />
    </div>
  );
};

const Timer = (props: { seconds: number }) => {
  let seconds = (" 0" + (props.seconds % 60)).slice(-2);
  let minutes = ("0" + Math.floor(props.seconds / 60)).slice(-2);
  return <div>{`${minutes}:${seconds}`}</div>;
};

const TextareaStyle = {
  resize: "none",
  margin: "8px auto",
  display: "block",
  padding: "16px",
  border: "none",
  width: "100%",
  maxWidth: "800px",
  backgroundColor: "inherit",
  height: "calc(98vh - 16px)",
} as const;

const CounterStyle = {
  height: "2vh",
  backgroundColor: "black",
  color: "grey",
};

const StatusBarStyle = {
  display: "grid",
  width: "100vw",
  alignItems: "baseline",
  paddingLeft: "4px",
  gridTemplateColumns:
    "max-content max-content 1fr max-content max-content max-content",
  gridGap: "8px",
};

const ButtonStyle = {
  background: "none",
  border: "none",
  color: "grey",
  textDecoration: "underline",
  alignSelf: "baseline",
};

const TitleStyle = {
  transform: "rotate(-90deg)",
  position: "absolute",
  left: "-34px",
  top: "54px",
  fontFamily: "monospace",
} as const;

const TitleInputStyle = {
  color: "inherit",
  border: "none",
  background: "inherit",
  width: "100%",
};
export default BlindWriter;
