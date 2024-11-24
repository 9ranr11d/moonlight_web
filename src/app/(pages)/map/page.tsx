"use client";

import React from "react";

import KakaoMap from "@components/map/KakaoMap";

export default function Map() {
  return (
    <main style={{ padding: 0 }}>
      {/* <div style={{ background: "#fff", padding: 10, borderRadius: 10 }}> */}
      {/* <NaverMap /> */}
      <KakaoMap />
      {/* </div> */}
    </main>
  );
}
