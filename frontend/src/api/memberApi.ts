const BASE_URL = "http://192.168.0.14:8080";

export type AvailabilityResponse = {
    available: boolean;
};

export type RatingResponse = {
    ratingId: number;
    movieId: number;
    score: number;
    comment: string | null;
    createdAt: string;
    updatedAt: string;
};

export type SignupRequest = {
    email: string;
    nickname: string;
    password: string;
};

export type SignupResponse = {
    isSuccess: boolean;
    code: string;
    message: string;
    result: {
        memberId: number;
        email: string;
        nickname: string;
    };
};

async function getJson<T>(path: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`);

    if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
    }

    return response.json() as Promise<T>;
}

export function checkNickname(nickname: string) {
    return getJson<AvailabilityResponse>(
        `/members/nickname/${encodeURIComponent(nickname)}`
    );
}

export function checkEmail(email: string) {
    return getJson<AvailabilityResponse>(
        `/members/email/${encodeURIComponent(email)}`
    );
}

export function getMemberRatings(memberId: number) {
    return getJson<RatingResponse[]>(
        `/members/${memberId}/ratings`
    );
}

export async function createMember(data: SignupRequest): Promise<SignupResponse> {
    const response = await fetch(`${BASE_URL}/members`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`회원가입 요청 실패: ${response.status}`);
    }

    return response.json() as Promise<SignupResponse>;
}