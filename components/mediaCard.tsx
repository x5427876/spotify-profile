import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

/**
 * 主題常量
 */
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
    border: "4px",
  },
} as const;

/**
 * 類型定義
 */
type TextAlign = "text-left" | "text-center";
type BorderRadius = "rounded-full" | "rounded-none" | "rounded-lg";

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

/**
 * 將邊界半徑轉換為CSS值
 */
const getBorderRadiusValue = (radius: BorderRadius): string =>
  radius === "rounded-full" ? "9999px" : "0px";

/**
 * 媒體卡片圖片組件
 */
const MediaCardImage: FC<MediaCardImageProps> = ({
  image,
  borderRadius = "rounded-full",
}) => {
  // 使用客戶端渲染來避免水合不匹配
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 緩存邊界半徑值
  const radiusValue = getBorderRadiusValue(borderRadius);

  // 圖片容器類名
  const imageContainerClassName = `
    overflow-hidden 
    aspect-square 
    ${borderRadius} 
    transition-all 
    duration-300
    p-[${THEME.spacing.image}]
  `;

  // 邊框效果類名
  const borderEffectClassName = `
    absolute 
    inset-0 
    ${borderRadius} 
    opacity-0 
    group-hover:opacity-100 
    pointer-events-none
    transition-all
    duration-300
  `;

  return (
    <div className="relative">
      {/* 圖片容器 */}
      <div className={imageContainerClassName}>
        {isMounted ? (
          <Image
            src={image || ""}
            alt="artist image"
            width={300}
            height={300}
            priority
            className="h-full w-full object-cover"
            style={{
              borderRadius: radiusValue,
              transition: THEME.transition.hover,
            }}
          />
        ) : (
          <div
            className="h-full w-full bg-gray-800"
            style={{ borderRadius: radiusValue }}
          />
        )}
      </div>

      {/* Hover 邊框效果 */}
      <div
        className={borderEffectClassName}
        style={{
          boxShadow: `0 0 0 ${THEME.spacing.border} ${THEME.colors.primary}`,
          transform: "scale(1.02)",
        }}
      />
    </div>
  );
};

/**
 * 媒體卡片內容組件
 */
const MediaCardContent: FC<MediaCardContentProps> = ({
  title,
  subtitle,
  textAlign = "text-center",
}) => {
  const contentClassName = `
    w-full 
    flex 
    flex-col 
    ${textAlign} 
    mt-${THEME.spacing.content}
  `;

  const titleClassName = "overflow-hidden text-ellipsis whitespace-nowrap";
  const subtitleClassName = `text-[${THEME.colors.textSecondary}] text-sm`;

  return (
    <div
      className={contentClassName}
      style={{ color: THEME.colors.textPrimary }}
    >
      <div className={titleClassName}>{title}</div>
      {subtitle && <div className={subtitleClassName}>{subtitle}</div>}
    </div>
  );
};

/**
 * 主媒體卡片組件
 */
const MediaCard: FC<MediaCardProps> = ({
  image,
  title,
  subtitle,
  href,
  textAlign = "text-center",
  borderRadius = "rounded-full",
}) => {
  const cardClassName = `
    flex 
    flex-col 
    justify-center 
    items-center 
    w-full 
    cursor-pointer 
    p-[${THEME.spacing.card}] 
    transition-all 
    duration-150 
    ease-in-out
    group
  `;

  return (
    <Link href={href}>
      <div className={cardClassName}>
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
