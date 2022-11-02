import Image from "next/image";
import preview from "../assets/preview.png";
import logo from "../assets/logo.svg";
import avatarsExample from "../assets/avatarsExample.png";
import check from "../assets/check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

import { loadCounts } from "../lib/load-counts";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = response.data;
      await navigator.clipboard.writeText(code);

      alert("Bolão criado com sucesso. Código copiado: " + code);
      setPoolTitle("");
    } catch (err) {
      alert("Falha ao criar o bolão!" + err);
    }
  }

  return (
    <div className="max-w-[1200px] px-20 h-screen mx-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-28 items-center">
      <main>
        <Image src={logo} alt="Logo da NLW Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={avatarsExample} alt="Exemplo de avatares dos usuários" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            placeholder="Qual o nome do seu bolão?"
            required
            onChange={(event) => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-600"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={check} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={check} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={preview}
        alt="Dois celulares mostrando o aplicativo"
        quality={100}
        className="hidden lg:block"
      />
    </div>
  );
}

export async function getStaticProps() {
  const { poolCountResponse, guessCountResponse, userCountResponse } =
    await loadCounts();

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
}
