"use client";

import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";

import { issueCoupleCodeAction } from "@actions/coupleCodeAction";

import styles from "./Home.module.css";

import IconClipboard from "@public/svgs/common/icon_clipboard.svg";
import Container from "@components/common/Container";
import UpcomingSchedule from "@components/home/UpcomingSchedule";

/** 메인 홈 */
export default function Home() {
  /** Dispatch */
  const dispatch = useDispatch<AppDispatch>();

  /** 사용자 정보 */
  const { identification } = useSelector((state: RootState) => state.authSlice);

  const { coupleCode } = useSelector(
    (state: RootState) => state.coupleCodeSlice
  );

  return (
    <div>
      <div className={styles.coupleCodeBox}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            paddingLeft: 120,
            width: "100%",
          }}
        >
          <div
            style={{
              paddingBottom: 10,
            }}
          >
            <h2 style={{ color: "white" }}>
              함께한 순간을 기록하고,
              <br />
              다시 꺼내보는 밤
            </h2>
          </div>

          <div
            style={{
              borderTop: "2px solid var(--white-700a)",
              paddingTop: 10,
            }}
          >
            <h4 style={{ color: "var(--white-700a)" }}>
              {coupleCode
                ? "COUPLE CODE를 연인과 공유하세요."
                : "COUPLE CODE를 발급하여 연인과 일상을 공유해보세요."}
            </h4>
          </div>

          <div style={{ marginTop: 20 }}>
            {coupleCode ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h5
                  style={{
                    background:
                      "linear-gradient(120deg, var(--primary-color), #e0a3a7)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    borderBottom: "3px solid",
                    borderImage:
                      "linear-gradient(120deg, var(--primary-color), #e0a3a7) 1",
                  }}
                >
                  {coupleCode}
                </h5>

                <button
                  type="button"
                  className={styles.clipboardBtn}
                  style={{
                    width: 40,
                    height: 40,
                    padding: 5,
                    borderRadius: 10,
                  }}
                >
                  <IconClipboard width={20} height={20} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={`outlineBtn ${styles.issueBtn}`}
                onClick={() =>
                  dispatch(issueCoupleCodeAction({ userId: identification }))
                }
              >
                <h5>발급하기</h5>
              </button>
            )}
          </div>
        </div>
      </div>

      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <UpcomingSchedule />
        </div>
      </Container>
    </div>
  );
}
