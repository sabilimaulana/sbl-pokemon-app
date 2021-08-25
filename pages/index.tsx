import { Pokemon } from "@common/types/pokemon";
import axios from "axios";

import Link from "next/link";
import Image from "next/image";

import type { GetServerSideProps, NextPage } from "next";
import Navbar from "@common/components/Navbar";
import cookies from "next-cookies";
import { User } from "@common/types/user";
import { useAuth } from "context/AuthContext";

type Props = {
  pokemons: Pokemon[];
  user: User;
};

const Home: NextPage<Props> = ({ pokemons, user }) => {
  const { login } = useAuth();

  if (user) {
    login(user);
  }

  return (
    <>
      <Navbar />
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
                  {`Element : ${pokemon.elements.map(
                    (element) => element.name
                  )}`}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await axios.get("http://localhost:3000/api/v1/pokemon");

  const pokemons = res.data.pokemons;

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
      },
    };
  }

  return {
    props: {
      pokemons,
      user,
    },
  };
};

export default Home;
