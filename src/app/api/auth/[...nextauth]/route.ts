import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";

import { ERR_MSG } from "@constants/msg";

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
  callbacks: {
    async signIn({ user, account, profile }) {
      // 사용자의 프로필 정보를 받아오는 부분
      console.log("SignIn Callback:", { user, account, profile });

      // // 사용자 데이터가 이미 존재하는지 확인 (DB 조회 등)
      // const isExistingUser = await checkUserExists(profile.email);

      // if (!isExistingUser) {
      //   // 회원가입 로직 추가
      //   await createUser({
      //     email: profile.email,
      //     name: profile.name,
      //     avatar: profile.image,
      //   });
      // }

      // true를 반환하면 로그인 계속 진행
      return true;
    },
  },
});

const checkUserExists = async (providerId: string) => {
  fetch("/api/auth/checkProviderId", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ providerId: providerId }),
  })
    .then(res => {
      if (res.ok) return res.json();

      if (res.status === 404) alert("존재하지 않는 회원입니다.");
      else alert(ERR_MSG);

      return res.json().then(data => Promise.reject(data.msg));
    })
    .catch(err => {
      console.error("/src/app/api/auth/[...nextauth] > checkUserExists()에서 오류가 발생했습니다. :", err);
      return false;
    });
  // 여기에 DB 조회 로직을 추가 (예시)
  // 예: Prisma, Mongoose 등을 사용해 확인
  return false; // 임시로 false 반환 (사용자 존재 안 함)
};

async function createUser(data: { email: string; name: string; avatar: string }) {
  // 여기에 회원가입 로직을 추가
  console.log("Creating user:", data);
  // 예: Prisma, Sequelize, Axios 등으로 API 요청
}

export { handler as GET, handler as POST };
