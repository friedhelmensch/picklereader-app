import Head from "next/head";
import amount from "../../lib/heinz";

export async function getServerSideProps(context) {
  const { address } = context.params;

  const response = await fetch(
    `https://pickle-zeta.vercel.app/api/address/${address}`
  );

  const rawData = await response.json();
  const sortedRawData = rawData.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const data = sortedRawData.map((entry) => {
    return {
      amount: Math.round(entry.amount * 100) / 100,
      date: new Date(entry.date).toLocaleTimeString("de-DE", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  });

  const today = new Date(Date.now());
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(Date.now());
  tomorrow.setDate(tomorrow.getDate() + 1);

  const amountOfToday = amount(rawData, today, tomorrow);

  const yesterday = new Date(Date.now());
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  console.log(yesterday);
  console.log(today);

  const amountOfYesterday = amount(rawData, yesterday, today);

  const totalBalance = data.length > 0 ? data[0].amount : 0;

  return {
    props: {
      history: data,
      today: Math.round(amountOfToday * 100) / 100,
      yesterday: Math.round(amountOfYesterday * 100) / 100,
      totalBalance,
    },
  };
}

const columns = [
  { id: 1, title: "DAI", accessor: "amount" },
  { id: 2, title: "Date", accessor: "date" },
];

export default function Home(props) {
  return (
    <div className="container">
      <Head>
        <title>Pickle Reader</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Look at your beautiful history</h1>
        <div className="grid">
          <div className="card">
            <h3>Today</h3>
            <p>{props.today} DAI</p>
          </div>
          <div className="card">
            <h3>Yesterday</h3>
            <p>{props.yesterday} DAI</p>
          </div>
          <div className="card">
            <h3>Last Week</h3>
            <p>(tbd)</p>
          </div>
          <div className="card">
            <h3>Balance</h3>
            <p>{props.totalBalance} DAI</p>
          </div>
        </div>
      </main>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.id}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.history.map((entry, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col.id}>{entry[col.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <img src="/vercel.svg" alt="Vercel" className="logo" />
        </a>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
