import { Pokemon, Pokemons } from "@common/types/pokemon";
import pokemon from "@server/models/pokemon";
import axios from "axios";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";

type Props = {
  pokemon: Pokemon;
};

const PokemonDetail: NextPage<Props> = ({ pokemon }) => {
  return (
    <div className="p-8 flex flex-col border-2 mx-8 mt-4">
      <h3 className="text-lg">{pokemon.name}</h3>
      <p>{`Element : ${pokemon.elements.map((element) => element.name)}`}</p>
      <p>{`Height : ${pokemon.height}`}</p>
      <p>{`Weight : ${pokemon.weight}`}</p>
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
