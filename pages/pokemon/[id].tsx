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
  user: User;
};

const PokemonDetail: NextPage<Props> = ({ pokemon, user }) => {
  const { login, user: userContext } = useAuth();
  const [warning, setWarning] = useState("");

  if (user) {
    login(user);
  }
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
          owner: userContext._id,
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
      setWarning("");

      const elements = pokemon.elements.map((element) => {
        return element._id;
      });

      const data = {
        name: pokemon.name,
        elements,
        // Reset the owner to the admin id
        owner: "6126440d6357cd4669a3251f",
        isCatched: false,
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
  };

  return (
    <>
      <Navbar />
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
          <p>{`Element : ${pokemon.elements.map(
            (element) => element.name
          )}`}</p>
          <p>{`Height : ${pokemon.height}`}</p>
          <p>{`Weight : ${pokemon.weight}`}</p>

          <div className="flex flex-col">
            {userContext._id === pokemon.owner._id ? (
              <>
                <p>This pokemon is already belongs to you</p>
                <button
                  onClick={handleRelease}
                  className="py-2 px-4 rounded mt-2  w-24 bg-red-500 text-white hover:bg-red-800"
                >
                  Release
                </button>
              </>
            ) : pokemon.isCatched ? (
              <p>
                {"This pokemon is already belongs to "}
                <span className="font-bold">{pokemon.owner.username}</span>
              </p>
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
    </>
  );
};

export default PokemonDetail;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;

  const res = await axios.get(`http://localhost:3000/api/v1/pokemon/${id}`);
  const pokemon: Pokemon = res.data.pokemon;

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
        pokemon,
      },
    };
  }

  return {
    props: {
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
