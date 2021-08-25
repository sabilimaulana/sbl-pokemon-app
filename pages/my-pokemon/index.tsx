import { Pokemon } from "@common/types/pokemon";
import Image from "next/image";
import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import Navbar from "@common/components/Navbar";
import { useAuth } from "context/AuthContext";
import cookies from "next-cookies";
import { User } from "@common/types/user";
import Link from "next/link";

type Props = {
  pokemons: Pokemon[];
  user: User;
};

const MyPokemon: NextPage<Props> = ({ pokemons, user }) => {
  const { login } = useAuth();

  if (user.username !== "") {
    login(user);
  }

  return (
    <>
      <Navbar />
      <div className="p-8 flex flex-col border-2 mx-8 mt-4">
        <p className="text-3xl">My Pokemon</p>
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

export default MyPokemon;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const allCookies = cookies(ctx);

  const pokemons = await axios
    .get(`http://localhost:3000/api/v1/user/pokemon`, {
      headers: { Authorization: `Bearer ${allCookies.token}` },
    })
    .then((res) => {
      return res.data.pokemons;
    })
    .catch((error) => {
      console.log(error.response.status);
    });
  // const pokemons: Pokemon[] = res.data.pokemons;

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
      redirect: {
        permanent: false,
        destination: "/",
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
