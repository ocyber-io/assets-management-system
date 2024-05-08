import React from "react";
import cardImage from "../assets/images/images-card.svg";

const ImagesCard: React.FC = () => {
  return (
    <div className="flex w-full justify-around opacity-45">
      <div>
        <img src={cardImage} alt="card" />
      </div>
      <div>
        <img src={cardImage} alt="card" />
      </div>
      <div>
        <img src={cardImage} alt="card" />
      </div>
      <div>
        <img src={cardImage} alt="card" />
      </div>
    </div>
  );
};

export default ImagesCard;
