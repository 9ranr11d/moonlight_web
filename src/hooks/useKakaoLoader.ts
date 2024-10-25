import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk";

const KAKAO_KEY: string = process.env.NEXT_PUBLIC_KAKAO_KEY!;

export default function useKakaoLoader() {
  useKakaoLoaderOrigin({
    appkey: KAKAO_KEY,
    libraries: ["clusterer", "drawing", "services"],
  });
}
