import { Pokemon, Pokemons } from "@common/types/pokemon";
import Image from "next/image";
import axios from "axios";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { probability } from "@common/utils/probability";

type Props = {
  pokemon: Pokemon;
};

const PokemonDetail: NextPage<Props> = ({ pokemon }) => {
  const handleCatch = () => {
    if (probability(0.25)) {
      console.log(pokemon.name);
    }
  };

  return (
    <div className="p-8 flex border-2 mx-8 mt-4">
      <div className="mr-8">
        <Image
          src={pokemon.image}
          alt={pokemon.name}
          width={300}
          height={300}
        />
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg">{pokemon.name}</h3>
        <p>{`Element : ${pokemon.elements.map((element) => element.name)}`}</p>
        <p>{`Height : ${pokemon.height}`}</p>
        <p>{`Weight : ${pokemon.weight}`}</p>

        <div className="flex">
          <button onClick={handleCatch}>Catch!</button>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await axios.get("http://localhost:3000/api/v1/pokemon");
  const pokemons: Pokemons = res.data.pokemons;

  const paths = pokemons.map((pokemon: Pokemon) => `/pokemon/${pokemon._id}`);

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await axios.get(
    `http://localhost:3000/api/v1/pokemon/${params?.id}`
  );
  const pokemon: Pokemon = res.data.pokemon;

  return {
    props: { pokemon },
  };
};
