import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";

import { query } from "@/lib/dbConnect";

import { ACCESS_LEVEL } from "@/constants";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 14 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log(
        "[...nextauth] > handler() > callbacks :",
        `'${user.id}'(으)로 Social SignIn 시도했습니다.`
      );

      // 사용자의 프로필 정보를 받아오는 부분
      const userExists = await checkUserExists(user.id);

      // 가입된 사용자가 아닐 시
      if (!userExists)
        await createUser({
          identification: user.id,
          profile_img_url: user.image || null,
          nickname: user.name || null,
          email: user.email || null,
          platform: "web",
          access_level: ACCESS_LEVEL.USER,
          provider: account?.provider!,
        });

      return true;
    },
    async jwt({ token }) {
      /** 현재 시간 (초 단위) */
      const currentTime = Math.floor(Date.now() / 1000);
      /** 토큰 만료 시간 */
      const tokenExpiration = Number(token.exp);

      // 만료 10분 전이면 토큰 재발급
      /** 재발급 임계점 (10분) */
      const refreshThreshold = 10 * 60;

      // 재발급 과정
      if (tokenExpiration && currentTime > tokenExpiration - refreshThreshold) {
        console.log("토큰이 만료되기 10분 전입니다. 새로 발급합니다.");

        // 토큰 갱신 로직 (API 호출 등으로 새로운 토큰 발급)
        const refreshedToken = {
          ...token,
          exp: currentTime + 14 * 24 * 60 * 60, // 새 만료 시간 설정 (14일)
        };

        return refreshedToken;
      }

      console.log("토큰이 유효합니다.");

      return token;
    },
    async session({ session, token }) {
      // user.id를 session에 저장
      if (session.user) session.user.id = token.sub;

      return session;
    },
  },
});

/**
 * 가입된 사용자인지 확인
 * @param identification 확인할 사용자 id
 * @returns 가입된 사용자인지
 */
const checkUserExists = async (identification: string) => {
  /** 색인 결과 */
  const result = await query(
    `
    SELECT
      identification
    FROM
      users
    WHERE
      identification = ?
    `,
    [identification]
  );

  // 색인 결과가 없을 시
  if (result.length === 0) {
    console.log(
      "[...nextauth] > checkUserExists() :",
      `'${identification}'(은)는 가입된 사용자가 아닙니다.`
    );

    return false;
  }

  console.log(
    "[...nextauth] > checkUserExists() :",
    `'${identification}'(은)는 가입된 사용자입니다.`
  );

  return true;
};

/**
 * 사용자 가입
 * @param data 사용자 정보
 */
const createUser = async (data: {
  identification: string;
  profile_img_url: string | null;
  nickname: string | null;
  email: string | null;
  platform: string;
  access_level: number;
  provider: string;
}) => {
  try {
    await query(
      `
      INSERT INTO
        users (
          identification,
          profile_img_url,
          nickname,
          email,
          platform,
          access_level,
          provider,
          seq
        ) 
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, 0
      )
      `,
      [
        data.identification,
        data.profile_img_url,
        data.nickname,
        data.email,
        data.platform,
        data.access_level,
        data.provider,
      ]
    );

    console.log(
      "[...nextauth] > createUser() :",
      `'${data.identification}'(으)로 사용자 생성 성공했습니다.`
    );
  } catch (err) {
    console.error("[...nextauth] > createUser() :", err);
  }
};

export { handler as GET, handler as POST };
