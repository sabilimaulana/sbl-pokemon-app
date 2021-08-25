import { Pokemon } from "@common/types/pokemon";
import axios from "axios";

import Link from "next/link";
import Image from "next/image";

import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

type Props = {
  pokemons: Pokemon[];
};

const Home: NextPage<Props> = ({ pokemons }) => {
  return (
    <div className="p-8 flex">
      {pokemons.map((pokemon) => {
        return (
          <Link
            href="/pokemon/[id]"
            as={`/pokemon/${pokemon._id}`}
            key={pokemon._id}
            passHref
          >
            <div className="p-4 rounded border-2 mx-4 transform transition duration-300 cursor-pointer hover:scale-110 hover:border-gray-700">
              <Image
                src={pokemon.image}
                alt={pokemon.name}
                width={200}
                height={200}
              />
              <h3 className="text-lg">{pokemon.name}</h3>
              <p>
                {`Element : ${pokemon.elements.map((element) => element.name)}`}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get("http://localhost:3000/api/v1/pokemon");

  const pokemons = res.data.pokemons;

  return {
    props: {
      pokemons,
    },
  };
};

export default Home;
