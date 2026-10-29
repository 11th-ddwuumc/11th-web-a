
import { useState } from "react";
import {
    checkNickname,
    checkEmail,
    getMemberRatings,
} from "./api/memberApi";

export default function BackendApiTest() {
    const [nickname, setNickname] = useState("수현");
    const [email, setEmail] = useState("new@umc.com");
    const [memberId, setMemberId] = useState(1);
    const [result, setResult] = useState<unknown>(null);
    const [error, setError] = useState("");

    async function run(request: () => Promise<unknown>) {
        setError("");
        setResult(null);

        try {
            setResult(await request());
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "알 수 없는 오류"
            );
        }
    }

    return (
        <main style={{ padding: 32, maxWidth: 700, margin: "auto" }}>
            <h1>Spring Boot API 연동 테스트</h1>

            <section style={{ marginTop: 24 }}>
                <h2>1. 닉네임 중복 확인</h2>
                <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
                <button onClick={() => run(() => checkNickname(nickname))}>
                    확인
                </button>
            </section>

            <section style={{ marginTop: 24 }}>
                <h2>2. 이메일 중복 확인</h2>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={() => run(() => checkEmail(email))}>
                    확인
                </button>
            </section>

            <section style={{ marginTop: 24 }}>
                <h2>3. 회원 평점 조회</h2>
                <input
                    type="number"
                    value={memberId}
                    onChange={(e) => setMemberId(Number(e.target.value))}
                />
                <button onClick={() => run(() => getMemberRatings(memberId))}>
                    조회
                </button>
            </section>

            <section style={{ marginTop: 32 }}>
                <h2>API 응답</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <pre
                    style={{
                        background: "#222",
                        color: "#fff",
                        padding: 16,
                        borderRadius: 8,
                        whiteSpace: "pre-wrap",
                    }}
                >
          {result === null
              ? "버튼을 눌러 API를 호출해 보세요."
              : JSON.stringify(result, null, 2)}
        </pre>
            </section>
        </main>
    );
}
