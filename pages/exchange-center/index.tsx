import { Pokemon } from "@common/types/pokemon";
import Image from "next/image";
import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import Navbar from "@common/components/Navbar";
import { useAuth } from "context/AuthContext";
import cookies from "next-cookies";
import { User } from "@common/types/user";
import Link from "next/link";
import Router from "next/router";

import { useState } from "react";

type Props = {
  pokemons: Pokemon[];
  myPokemon: Pokemon[];
  user: User;
};

const ExchangeCenter: NextPage<Props> = ({ pokemons, user, myPokemon }) => {
  const { login } = useAuth();

  if (user) {
    login(user);
  }

  const [warning, setWarning] = useState("");
  const handleExchange = async () => {
    try {
      if (myExchangePokemon === "select" || strangerPokemon === "select") {
        setWarning("Please select the pokemon first!");
        return;
      }

      setWarning("");
      const data = {
        firstPokemon: myExchangePokemon,
        secondPokemon: strangerPokemon,
      };

      const res = await axios.post(
        "http://localhost:3000/api/v1/pokemon/exchange",
        data
      );

      if (res.status === 200) {
        Router.push("my-pokemon");
      }
      console.log(myExchangePokemon, strangerPokemon);
    } catch (error) {
      console.log(error);
    }
  };

  const [myExchangePokemon, setMyExchangePokemon] = useState("select");
  const [strangerPokemon, setStrangerPokeom] = useState("select");

  return (
    <>
      <Navbar />
      <div className="p-8 flex flex-col border-2 mx-8 mt-4">
        <p className="text-3xl">Exchange Center</p>
        <div className="flex flex-col mt-4">
          <p className="pr-4">Your pokemon that you want to exchange:</p>
          <select
            name="myPokemon"
            id="my-pokemon"
            className="w-32 p-2 cursor-pointer "
            onChange={(e) => setMyExchangePokemon(e.target.value)}
          >
            <option value="select">Select</option>
            {myPokemon.map((pokemon) => {
              return (
                <option key={pokemon._id} value={pokemon._id}>
                  {pokemon.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex flex-col mt-4">
          <p className="pr-4">
            Stranger pokemon that you want to exchange with your pokemon:
          </p>
          <select
            name="myPokemon"
            id="my-pokemon"
            className="w-32 p-2 cursor-pointer "
            onChange={(e) => setStrangerPokeom(e.target.value)}
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

        <div>
          <p>{warning}</p>
          <button
            onClick={handleExchange}
            className="py-2 px-4 mt-4 rounded text-white bg-blue-500 hover:bg-blue-800"
          >
            Exchange
          </button>
        </div>

        <div className="p-8 flex">
          {pokemons.length > 0 &&
            pokemons.map((pokemon) => {
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
                      {`Element : ${pokemon.elements.map(
                        (element) => element.name
                      )}`}
                    </p>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ExchangeCenter;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await axios.get("http://localhost:3000/api/v1/pokemon");
  const pokemons = res.data.pokemons;
  const pokemonsThatReadyToExchange = pokemons.filter((pokemon: Pokemon) => {
    if (pokemon.isExchange) {
      return true;
    }
    return false;
  });

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

  const myPokemon = await axios
    .get(`http://localhost:3000/api/v1/user/pokemon`, {
      headers: { Authorization: `Bearer ${allCookies.token}` },
    })
    .then((res) => {
      return res.data.pokemons;
    })
    .catch((error) => {
      console.log(error.response.status);
    });

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {
      pokemons: pokemonsThatReadyToExchange,
      myPokemon,
      user,
    },
  };
};
