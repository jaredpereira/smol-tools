import { useEffect, useState } from "react";
import Link from "next/link";
import { Item, Layout } from ".";

type Items = { date: string }[];
const App = () => {
  return (
    <Layout>
      <List />
    </Layout>
  );
};

export default App;
const List = () => {
  let [items, setItems] = useState<Items>([]);
  useEffect(() => {
    let streamString = localStorage.getItem("items") || "[]";
    setItems(JSON.parse(streamString));
  }, []);
  return (
    <div
      style={{
        margin: "8px auto",
        padding: "16px",
        paddingLeft: "32px",
        width: "100%",
        maxWidth: "800px",
        height: "100%",
      }}
    >
      <ul>
        {items.map((item) => (
          <li>
            <Link href={`/blind-writer/item/${item.date}`}>{item.date}</Link>{" "}
            <button
              onClick={() => {
                let items: Items = JSON.parse(
                  localStorage.getItem("items") || "[]"
                );
                localStorage.removeItem(item.date);
                let newItems = items.filter((i) => i.date !== item.date);
                localStorage.setItem("items", JSON.stringify(newItems));
                setItems(newItems);
              }}
            >
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Item = (props: { date: string }) => {
  let [data, setData] = useState<null | Item>(null);
  useEffect(() => {
    let storedData = localStorage.getItem(props.date);
    if (storedData) setData(JSON.parse(storedData));
  }, [props.date]);
  return <p>{data?.content}</p> || null;
};
