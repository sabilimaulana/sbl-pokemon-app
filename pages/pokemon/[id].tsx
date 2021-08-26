import { Pokemon } from "@common/types/pokemon";
import Image from "next/image";
import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { probability } from "@common/utils/probability";
import Navbar from "@common/components/Navbar";
import { useAuth } from "context/AuthContext";
import cookies from "next-cookies";
import { User } from "@common/types/user";
import Router from "next/router";
import { useState } from "react";

type Props = {
  pokemon: Pokemon;
  pokemons: Pokemon[];
  user: User;
};

const PokemonDetail: NextPage<Props> = ({ pokemon, user, pokemons }) => {
  const { login, user: userContext } = useAuth();
  const [warning, setWarning] = useState("");
  const [wantedPokemon, setWantedPokemon] = useState("select");
  const [wantedPokemonNameState, setWantedPokemonNameState] = useState("");

  const [warningWanted, setWarningWanted] = useState("");

  if (user) {
    login(user);
  }

  const handleWantedPokemon = (pokemonId: any) => {
    setWantedPokemon(pokemonId);

    const wantedPokemonName = pokemons.map((pokemon) => {
      if (pokemon._id === pokemonId) {
        setWantedPokemonNameState(pokemon.name);
      }
    });
  };

  const handleCatch = async () => {
    if (probability(0.25)) {
      try {
        setWarning("");

        const elements = pokemon.elements.map((element) => {
          return element._id;
        });

        const data = {
          name: pokemon.name,
          elements,
          isCatched: true,
          isExchange: false,
          owner: userContext._id,
          wantedPokemonId: "0",
          wantedPokemonName: "0",
          height: pokemon.height,
          weight: pokemon.weight,
          image: pokemon.image,
        };

        const res = await axios.patch(
          `http://localhost:3000/api/v1/pokemon/${pokemon._id}`,
          data
        );

        if (res.data.status === "Success") {
          window.location.reload();
        }
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    } else {
      setWarning("Failed catch pokemon, try again!");
    }
  };

  const handleRelease = async () => {
    try {
      const elements = pokemon.elements.map((element) => {
        return element._id;
      });

      const data = {
        name: pokemon.name,
        elements,
        // Reset the owner to the admin id
        owner: "6126440d6357cd4669a3251f",
        // Reset
        wantedPokemonId: "0",
        wantedPokemonName: "0",
        isCatched: false,
        isExchange: false,
        height: pokemon.height,
        weight: pokemon.weight,
        image: pokemon.image,
      };

      const res = await axios.patch(
        `http://localhost:3000/api/v1/pokemon/${pokemon._id}`,
        data
      );

      if (res.data.status === "Success") {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostExchange = async (type: string) => {
    try {
      const elements = pokemon.elements.map((element) => {
        return element._id;
      });

      if (type === "in" && wantedPokemon === "select") {
        setWarningWanted("Please select the wanted pokemon first!");
        return;
      }

      setWarningWanted("");

      const data = {
        name: pokemon.name,
        elements,
        owner: pokemon.owner._id,
        wantedPokemonId: type === "in" ? wantedPokemon : "0",
        wantedPokemonName: type === "in" ? wantedPokemonNameState : "0",
        isCatched: true,
        isExchange: type === "in" ? true : false,
        height: pokemon.height,
        weight: pokemon.weight,
        image: pokemon.image,
      };

      console.log(data);

      const res = await axios.patch(
        `http://localhost:3000/api/v1/pokemon/${pokemon._id}`,
        data
      );

      if (res.data.status === "Success") {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-8 flex flex-col border-2 mx-8 mt-4">
        <h1 className="text-3xl p-8">Pokemon Detail</h1>

        <div className="flex flex-row ">
          <div className="mr-8 border-2">
            <Image
              src={pokemon.image}
              alt={pokemon.name}
              width={300}
              height={300}
            />
          </div>
          <div className="flex flex-col flex-1 p-4 border-2">
            <h3 className="text-lg">{pokemon.name}</h3>
            <p>{`Element : ${pokemon.elements.map(
              (element) => element.name
            )}`}</p>
            <p>{`Height : ${pokemon.height}`}</p>
            <p>{`Weight : ${pokemon.weight}`}</p>

            <div className="flex flex-col">
              {userContext._id === pokemon.owner._id ? (
                <>
                  <p>This pokemon is already belongs to you</p>

                  {!pokemon.isExchange ? (
                    <div className="flex flex-col border-2 p-4">
                      <p className="text-lg font-bold">Exchange</p>
                      <p className="text-red-500">{warningWanted}</p>
                      <div className="flex flex-row">
                        <p>Pokemon that you wanted</p>
                        <select
                          onChange={(e) => handleWantedPokemon(e.target.value)}
                          name="wanted"
                          id="wanted"
                          className="ml-4 w-40"
                        >
                          <option value="select">Select</option>
                          {pokemons.map((pokemon) => {
                            return (
                              <option key={pokemon._id} value={pokemon._id}>
                                {pokemon.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <button
                        onClick={() => handlePostExchange("in")}
                        className="py-2 px-4 rounded mt-2  w-40 bg-yellow-500 text-white hover:bg-yellow-800"
                      >
                        Send To Exchange Center
                      </button>
                    </div>
                  ) : (
                    <>
                      <p>This pokemon is already at exchange center</p>
                      <button
                        onClick={() => handlePostExchange("out")}
                        className="py-2 px-4 rounded mt-2  w-40 bg-yellow-500 text-white hover:bg-yellow-800"
                      >
                        Take From Exchange Center
                      </button>
                    </>
                  )}

                  <button
                    onClick={handleRelease}
                    className="py-2 px-4 rounded mt-2  w-24 bg-red-500 text-white hover:bg-red-800"
                  >
                    Release
                  </button>
                </>
              ) : pokemon.isCatched ? (
                <>
                  <p>
                    {"This pokemon is already belongs to "}
                    <span className="font-bold">{pokemon.owner.username}</span>
                  </p>
                  {pokemon.isExchange && (
                    <p>This pokemon is ready to exchange at exchange center</p>
                  )}
                </>
              ) : userContext.username === "" ? (
                <>
                  <p>
                    If you want to catch this pokemon, please register or login
                    first!
                  </p>
                  <button className="py-2 px-4 w-24 rounded mt-2 bg-gray-500 text-white cursor-not-allowed">
                    Catch!
                  </button>
                </>
              ) : (
                <>
                  <p>Your chance is 25%</p>
                  <button
                    onClick={handleCatch}
                    className="py-2 px-4 rounded mt-2  w-24 bg-blue-500 text-white hover:bg-blue-800"
                  >
                    Catch!
                  </button>
                  <p>{warning}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PokemonDetail;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;

  const res = await axios.get(`http://localhost:3000/api/v1/pokemon/${id}`);
  const pokemon: Pokemon = res.data.pokemon;

  const resPokemons = await axios.get("http://localhost:3000/api/v1/pokemon");

  const pokemons = resPokemons.data.pokemons;

  const allCookies = cookies(ctx);

  const user = await axios
    .get("http://localhost:3000/api/v1/user/profile", {
      headers: { Authorization: `Bearer ${allCookies.token}` },
    })
    .then((res) => {
      return res.data.user;
    })
    .catch((error) => {
      console.log(error.response.status);
    });

  if (!user) {
    return {
      props: {
        pokemons,
        pokemon,
      },
    };
  }

  return {
    props: {
      pokemons,
      pokemon,
      user,
    },
  };
};

// export const getStaticPaths: GetStaticPaths = async () => {
//   const res = await axios.get("http://localhost:3000/api/v1/pokemon");
//   const pokemons: Pokemons = res.data.pokemons;

//   const paths = pokemons.map((pokemon: Pokemon) => `/pokemon/${pokemon._id}`);

//   return { paths, fallback: false };
// };

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   const res = await axios.get(
//     `http://localhost:3000/api/v1/pokemon/${params?.id}`
//   );
//   const pokemon: Pokemon = res.data.pokemon;

//   return {
//     props: { pokemon },
//   };
// };
