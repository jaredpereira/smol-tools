import { useEffect, useState } from "react";
import { Item, Layout } from "..";
import { useRouter } from "next/router";

type Items = { date: string }[];
const App = () => {
  let router = useRouter();
  return (
    <Layout>
      <Item date={router.query.id as string} />
    </Layout>
  );
};

export default App;
const Item = (props: { date: string }) => {
  let [data, setData] = useState<null | Item>(null);
  useEffect(() => {
    let storedData = localStorage.getItem(props.date);
    if (storedData) setData(JSON.parse(storedData));
  }, [props.date]);
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
      <h2>{data && new Date(data.date).toLocaleDateString()}</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{data?.content}</pre>
    </div>
  );
};
