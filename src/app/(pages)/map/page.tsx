"use client";

import React from "react";

import CSS from "./Map.module.css";

import NaverMap from "@components/map/NaverMap";

export default function Map() {
  return (
    <main>
      <div style={{ background: "#fff", padding: 10, borderRadius: 10 }}>
        <NaverMap />
      </div>
    </main>
  );
}
