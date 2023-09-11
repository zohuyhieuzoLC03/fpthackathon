import { useState } from "react";
import { data } from "../data/userData";

const Leaderboard = () => {
  const [players, setPlayers] = useState(data);
  players.sort((a, b) => {
    return b.score - a.score;
  });

  return (
    <div className="border-3 px-3">
      {players.map(({ userID, displayName, score, picture }, index) => {
        return (
          <div
            className="flex items-center justify-between border-b-2 border-gray-300 py-2 max-w-87 mx-auto"
            key={userID}
          >
            <div className="w-90 flex items-center text-gray-700">
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full border-1 text-white ${
                  index === 0
                    ? "bg-pink-500"
                    : index === 1
                    ? "bg-yellow-500"
                    : index === 2
                    ? "bg-orange-500"
                    : "bg-[#06325E]"
                }`}
              >
                {index + 1}
              </span>
              <img
                className="h-10 w-10 object-cover rounded-full border-1 border-white mx-4"
                src={picture}
                alt="player"
              />
              <p className="name">{displayName}</p>
            </div>
            <p className="text-[#06325E] pl-4">
              {score}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Leaderboard;