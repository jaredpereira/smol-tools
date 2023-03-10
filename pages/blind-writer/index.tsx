import Link from "next/link";
import { useEffect, useState } from "react";

export type Item = {
  content: string;
  date: string;
};
const App = () => {
  return (
    <Layout>
      <BlindWriter />
    </Layout>
  );
};
export const Layout = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      <span style={TitleStyle}>BLIND WRITER</span>
      <Nav />
      {props.children}
    </div>
  );
};

const BlindWriter = () => {
  const [text, setText] = useState("");
  let [wordGoal, setWordGoal] = useState(750);
  let words = text.match(/\S+/g)?.length || 0;
  let [time, setTime] = useState(0);
  let [timerActive, setTimerActive] = useState(false);
  let [peeking, setPeeking] = useState(false);
  useEffect(() => {
    if (peeking)
      setTimeout(() => {
        setPeeking(false);
      }, 1000);
  }, [peeking]);

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
    if (words > wordGoal || words === 0) return setTimerActive(false);
    if (!timerActive) setTimerActive(true);
  }, [text, words]);

  return (
    <>
      <textarea
        autoFocus
        spellCheck={false}
        value={text}
        onChange={(e) => {
          setText(e.currentTarget.value);
        }}
        style={{
          ...TextareaStyle,
          fontFamily: words > wordGoal || peeking ? "serif" : "Flow Block",
          fontSize: words > wordGoal || peeking ? "18px" : "16.5px",
        }}
      />
      <Counter completed={words} wordGoal={wordGoal}>
        <div style={StatusBarStyle}>
          <Timer seconds={time} />
          <Words words={words} wordGoal={wordGoal} setWordGoal={setWordGoal} />
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
            onMouseOver={() => {
              setPeeking(true);
            }}
          >
            peek
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
          {words > wordGoal ? (
            <button
              style={ButtonStyle}
              onClick={() => {
                let items = JSON.parse(localStorage.getItem("items") || "[]");
                let date = new Date().toISOString();
                let data = {
                  date,
                  content: text,
                };
                localStorage.setItem(
                  "items",
                  JSON.stringify([...items, { date }])
                );
                localStorage.setItem(date, JSON.stringify(data));
                setText("");
                setTime(0);
                setTimerActive(false);
              }}
            >
              save
            </button>
          ) : null}
        </div>
      </Counter>
    </>
  );
};

const Nav = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        margin: "0 auto",
      }}
    >
      <Link href="/blind-writer">write</Link>
      <Link href="/blind-writer/list">list</Link>
    </div>
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
          width: "96px",
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
  paddingLeft: "32px",
  border: "none",
  width: "100%",
  maxWidth: "800px",
  height: "100%",
  backgroundColor: "inherit",
} as const;

const CounterStyle = {
  backgroundColor: "black",
  color: "grey",
};

const StatusBarStyle = {
  display: "flex",
  flexDirection: "row",
  width: "100vw",
  alignItems: "baseline",
  paddingLeft: "4px",
  gridGap: "8px",
  fontSize: "20px",
} as const;

const ButtonStyle = {
  fontSize: "20px",
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

export default App;
