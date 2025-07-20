import React from "react";
import Image from "next/image";

interface ProfileImageProps {
  size?: number;
  style?: React.CSSProperties;
  profileImgUrl?: string;
  nickname?: string;
  identification: string;
}

export default function ProfileImage({
  size = 120,
  style,
  profileImgUrl,
  nickname,
  identification,
}: ProfileImageProps) {
  return (
    <div style={{ flexShrink: 0, borderRadius: "50%", ...style }}>
      {profileImgUrl ? (
        <Image
          src={profileImgUrl}
          alt="프로필 이미지"
          width={size}
          height={size}
          style={{
            objectFit: "cover",
            border: "4px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "50%",
            width: size,
            height: size,
          }}
        />
      ) : (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            border: "4px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "50%",
            width: size,
            height: size,
          }}
        >
          <p
            style={{
              margin: 0,
              fontWeight: "bold",
              fontSize: size * 0.4,
            }}
          >
            {nickname?.[0] || identification[0]}
          </p>
        </div>
      )}
    </div>
  );
}
