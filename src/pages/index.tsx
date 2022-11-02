/** @format */

interface HomeProps {
  total: number;
}

export default function Home(props: HomeProps) {
  return <h1>Total: {props.total}</h1>;
}

export const getServerSideProps = async () => {
  const response = await fetch("http://localhost:3333/bet/total");
  const data = await response.json();

  return {
    props: {
      total: data.total,
    },
  };
};
