import type { NextPage } from "next";
import Link from "next/link";
const Home: NextPage = () => {
  return (
    <ul>
      <li>
        <Link href="/blind-writer">
          <a>blind-writer</a>
        </Link>
      </li>
    </ul>
  );
};

export default Home;
