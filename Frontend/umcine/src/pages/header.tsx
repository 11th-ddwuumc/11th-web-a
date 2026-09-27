import movieIcon from "../assets/movie-icons/UMCine.svg";
import search from "../assets/movie-icons/search.svg"
import { useState, type CSSProperties } from "react";

const menuStyle: CSSProperties = {
  color: "var(--color-text-secondary)",
  textAlign: "center",
  fontFamily: "Pretendard",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "normal",
  cursor: "pointer",
};

const activeMenuStyle: CSSProperties = {
  color: "var(--color-text-primary)",
  textDecorationLine: "underline",
  textDecorationStyle: "solid",
};

export default function Header() {
    const [activeMenu, setActiveMenu] = useState("영화");

    return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        padding: "24px 80px",
        gap: "24px",
      }}
    >
      <div> <img src={movieIcon} alt="로고" /> </div>

      <div
        style={{
            ...menuStyle,
            ...(activeMenu === "영화" ? activeMenuStyle : {}),
        }}
        onClick={() => setActiveMenu("영화")}
        >
        영화
    </div>

    <div
    style={{
        ...menuStyle,
        ...(activeMenu === "검색" ? activeMenuStyle : {}),
    }}
    onClick={() => setActiveMenu("검색")}
    >
    검색
    </div>

    <div
    style={{
        ...menuStyle,
        ...(activeMenu === "내정보" ? activeMenuStyle : {}),
    }}
    onClick={() => setActiveMenu("내정보")}
    >
    내정보
    </div>
      
    <div
        style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginLeft: "auto"
        }}>
            
            <button
                style={{
                    borderRadius: "var(--corner-radius-8, 8px)",
                    border:
                    "var(--stroke-weight-1, 1px) solid var(--color-border-default)",
                    background: "var(--color-bg-surface)",
                }}
            >
                <img src={search} alt="검색" />
            </button>
            
            <button style={{
                borderRadius: "var(--corner-radius-8, 8px)",
                border: " var(--stroke-weight-1, 1px) solid var(--color-bg-surface)",
                background: " var(--color-action-primary)",
                color: " var(--color-bg-surface)",
                textAlign: "center",
                fontFamily:"Pretendard",
                fontSize:"14px",
                fontWeight:"800",
                display:"flex",
                height: "42px",
                padding: "0 16px",
                justifyContent: "center",
                alignItems: "center",
            }}>
                마이페이지
            </button>
            
        </div>
    </header>
  );
}
