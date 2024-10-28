"use client";

import React from "react";

// import NaverMap from "@components/map/NaverMap";
import KakaoMap from "@components/map/KakaoMap";

export default function Map() {
  return (
    <main>
      <div style={{ background: "#fff", padding: 10, borderRadius: 10 }}>
        {/* <NaverMap /> */}
        <KakaoMap />
      </div>
    </main>
  );
}
