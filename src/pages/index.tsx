/** @format */

interface HomeProps {
  betTotal: number;
  guessTotal: number;
  userTotal: number;
}

import Image from "next/image";
import { GetStaticProps } from "next";

import phonePreviewAppImage from "../assets/phones-app-preview.png";
import logoNlwImage from "../assets/logo.svg";
import userAvatarsImage from "../assets/users-avatars-example.png";
import iconCheckImage from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

export default function Home({ betTotal, guessTotal, userTotal }: HomeProps) {
  const [betTitle, setBetTitle] = useState("");

  async function createBet(event: FormEvent) {
    event.preventDefault();

    try {
      const createBetResponse = await api.post("/bet", {
        title: betTitle,
      });

      const { code } = createBetResponse.data;

      await navigator.clipboard.writeText(code);

      alert(
        "Bolão criado com sucesso, o código foi copiado para área de tranferência!"
      );

      setBetTitle("");
    } catch (err) {
      console.log(err);
      alert("Houve um erro ao criar o bolão, tente novamente.");
    }
  }

  function handleBetTitle(event: any) {
    setBetTitle(event.target.value);
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoNlwImage} alt="Nlw copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={userAvatarsImage} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">
              +{userTotal ? userTotal : 0}
            </span>{" "}
            pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createBet} className="mt-10 flex gap-2">
          <input
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            onChange={handleBetTitle}
            value={betTitle}
          />
          <button
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImage} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">
                +{betTotal ? betTotal : 0}
              </span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconCheckImage} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">
                +{guessTotal ? guessTotal : 0}
              </span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={phonePreviewAppImage}
        alt="Dois celulares exibindo uma previa do aplicativo do bolão um ao lado do outro"
      />
    </div>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const [betTotalResponse, guessTotalResponse, userTotalResponse] =
    await Promise.all([
      api.get("/bet/total"),
      api.get("/guess/total"),
      api.get("/user/total"),
    ]);

  return {
    props: {
      betTotal: betTotalResponse.data.total,
      guessTotal: guessTotalResponse.data.total,
      userTotal: userTotalResponse.data.total,
    },
    revalidate: 10,
  };
};
