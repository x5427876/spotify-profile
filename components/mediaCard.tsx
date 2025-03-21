import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

// 常量定義
const THEME = {
  colors: {
    primary: "#1DB954",
    textPrimary: "#FFFFFF",
    textSecondary: "#9B9B9B",
  },
  transition: {
    default: "all 150ms ease-in-out",
    hover: "all 300ms ease-in-out",
  },
  spacing: {
    card: "10px",
    image: "4px",
    content: "4",
  },
} as const;

// 類型定義
type TextAlign = "text-left" | "text-center";
type BorderRadius = "rounded-full" | "rounded-none";

interface MediaCardProps {
  image?: string;
  title: string;
  subtitle?: string;
  href: string;
  textAlign?: TextAlign;
  borderRadius?: BorderRadius;
}

interface MediaCardImageProps {
  image?: string;
  borderRadius: BorderRadius;
}

interface MediaCardContentProps {
  title: string;
  subtitle?: string;
  textAlign: TextAlign;
}

// 圖片組件
const MediaCardImage: FC<MediaCardImageProps> = ({
  image,
  borderRadius = "rounded-full",
}) => {
  const getBorderRadiusValue = (radius: BorderRadius) =>
    radius === "rounded-full" ? "9999px" : "0px";

  return (
    <div
      className={`overflow-hidden aspect-square ${borderRadius} transition-all duration-300 group-hover:bg-[${THEME.colors.primary}] p-[${THEME.spacing.image}]`}
    >
      <Image
        src={image || ""}
        alt="artist image"
        width={300}
        height={300}
        priority
        style={{
          borderRadius: getBorderRadiusValue(borderRadius),
        }}
      />
    </div>
  );
};

// 內容組件
const MediaCardContent: FC<MediaCardContentProps> = ({
  title,
  subtitle,
  textAlign = "text-center",
}) => (
  <div
    className={`text-[${THEME.colors.textPrimary}] mt-${THEME.spacing.content} w-full flex flex-col ${textAlign}`}
  >
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      {title}
    </div>
    {subtitle && (
      <div className={`text-[${THEME.colors.textSecondary}] text-sm`}>
        {subtitle}
      </div>
    )}
  </div>
);

// 主卡片組件
const MediaCard: FC<MediaCardProps> = ({
  image,
  title,
  subtitle,
  href,
  textAlign = "text-center",
  borderRadius = "rounded-full",
}) => {
  return (
    <Link href={href}>
      <div
        className={`
          group 
          flex flex-col 
          justify-center 
          items-center 
          w-full 
          cursor-pointer 
          p-[${THEME.spacing.card}] 
          transition-all 
          duration-150 
          ease-in-out
        `}
      >
        <MediaCardImage image={image} borderRadius={borderRadius} />
        <MediaCardContent
          title={title}
          subtitle={subtitle}
          textAlign={textAlign}
        />
      </div>
    </Link>
  );
};

export default MediaCard;
