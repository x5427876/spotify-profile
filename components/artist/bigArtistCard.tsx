import Link from "next/link";
import { FC, useState } from "react";

interface Props {
  image: string;
  name: string;
  link: string;
  followers: number;
}

const BigArtistCard: FC<Props> = ({ image, name, link, followers }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <Link href={link}>
      <div
        className="flex flex-col items-center p-4 cursor-pointer hover:bg-white/10 transition rounded-md"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className="flex justify-center items-center mb-3">
          <img
            className="rounded-full w-full h-auto aspect-square object-cover"
            src={image}
            alt={name}
          />
        </div>
        <div className="text-white text-lg font-medium text-center">{name}</div>
        <div className="text-gray-400 text-sm text-center">
          {followers.toLocaleString()} followers
        </div>
      </div>
    </Link>
  );
};

export default BigArtistCard;
