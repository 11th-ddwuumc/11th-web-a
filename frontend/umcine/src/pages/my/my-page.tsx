import { Link } from "@tanstack/react-router";

const MY_EMAIL = "example@email.com";
const MY_NICKNAME = "유엠씨";

export function MyPage() {
  return (
    <div className="flex w-full flex-1 items-center justify-center bg-[#f5f5f7] px-6 py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-left shadow">
        <h1 className="mb-6 text-2xl font-extrabold text-gray-900">내 정보</h1>

        <p className="text-sm font-semibold text-gray-500">이메일</p>
        <p className="mt-1 text-base text-gray-900">{MY_EMAIL}</p>

        <p className="mt-4 text-sm font-semibold text-gray-500">닉네임</p>
        <p className="mt-1 text-base text-gray-900">{MY_NICKNAME}</p>

        <Link
          to="/my-edit"
          className="mt-6 block w-full rounded-lg bg-gray-900 py-3 text-center text-sm font-semibold text-white"
        >
          내 정보 수정
        </Link>
      </div>
    </div>
  );
}
