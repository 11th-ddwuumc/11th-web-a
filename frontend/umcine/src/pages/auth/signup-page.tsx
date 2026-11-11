import { useState, type SubmitEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  function handleChangeField(key: DefaultFormKey, value: string) {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: DEFAULT_DUPLICATE_CHECK,
      }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCheckDuplicate(key: DuplicateCheckKey) {
    let isValid = isNicknameValid;
    let label = "닉네임";
    if (key === "email") {
      isValid = isEmailValid;
      label = "이메일";
    }
    if (!isValid || duplicateCheck[key].isChecking) return;

    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      let isAvailable = false;
      if (key === "email") {
        const response = await checkEmailDuplicate(form.email.trim());
        isAvailable = response.available;
      } else {
        const response = await checkNicknameDuplicate(form.nickname.trim());
        isAvailable = response.available;
      }

      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: isAvailable },
      }));

      if (isAvailable) {
        alert(`사용할 수 있는 ${label}이에요.`);
      } else {
        alert(`이미 사용 중인 ${label}이에요.`);
      }
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      alert(response.message);
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  let emailButtonText = "중복 확인";
  if (duplicateCheck.email.isChecking) emailButtonText = "확인 중";
  let nicknameButtonText = "중복 확인";
  if (duplicateCheck.nickname.isChecking) nicknameButtonText = "확인 중";
  let submitButtonText = "가입하기";
  if (isSubmitting) submitButtonText = "가입 중";

  return (
    <div className="flex w-full flex-1 items-center justify-center bg-[#f5f5f7] px-6 py-8">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md rounded-xl bg-white p-8 text-left shadow"
      >
        <h1 className="mb-6 text-2xl font-extrabold text-gray-900">회원가입</h1>

        <label className="text-sm font-semibold text-gray-900">이메일</label>
        <div className="mt-1 flex gap-2">
          <input
            type="email"
            value={form.email}
            disabled={duplicateCheck.email.isChecking}
            onChange={(e) => handleChangeField("email", e.target.value)}
            placeholder="example@email.com"
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
          />
          <button
            type="button"
            disabled={!isEmailValid || duplicateCheck.email.isChecking}
            onClick={() => handleCheckDuplicate("email")}
            className="shrink-0 rounded-lg bg-gray-900 px-3 text-xs font-semibold text-white disabled:bg-gray-300"
          >
            {emailButtonText}
          </button>
        </div>
        {showEmailError && (
          <p className="mt-1 text-xs text-red-500">
            올바른 이메일 형식이 아니에요.
          </p>
        )}
        {duplicateCheck.email.isAvailable && (
          <p className="mt-1 text-xs text-green-600">
            사용할 수 있는 이메일이에요.
          </p>
        )}

        <label className="mt-4 block text-sm font-semibold text-gray-900">
          닉네임
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            value={form.nickname}
            disabled={duplicateCheck.nickname.isChecking}
            onChange={(e) => handleChangeField("nickname", e.target.value)}
            placeholder="2~12자"
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
          />
          <button
            type="button"
            disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
            onClick={() => handleCheckDuplicate("nickname")}
            className="shrink-0 rounded-lg bg-gray-900 px-3 text-xs font-semibold text-white disabled:bg-gray-300"
          >
            {nicknameButtonText}
          </button>
        </div>
        {showNicknameError && (
          <p className="mt-1 text-xs text-red-500">
            닉네임은 2자 이상 12자 이하로 입력해 주세요.
          </p>
        )}
        {duplicateCheck.nickname.isAvailable && (
          <p className="mt-1 text-xs text-green-600">
            사용할 수 있는 닉네임이에요.
          </p>
        )}

        <label className="mt-4 block text-sm font-semibold text-gray-900">
          비밀번호
        </label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => handleChangeField("password", e.target.value)}
          placeholder="영문 대소문자, 숫자, 특수문자 포함 8자 이상"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
        />
        {showPasswordError && (
          <p className="mt-1 text-xs text-red-500">
            영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
            입력해 주세요.
          </p>
        )}

        <label className="mt-4 block text-sm font-semibold text-gray-900">
          비밀번호 확인
        </label>
        <input
          type="password"
          value={form.passwordConfirm}
          onChange={(e) => handleChangeField("passwordConfirm", e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
        />
        {showPasswordConfirmError && (
          <p className="mt-1 text-xs text-red-500">
            비밀번호가 일치하지 않아요.
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="mt-6 w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white disabled:bg-gray-300"
        >
          {submitButtonText}
        </button>
      </form>
    </div>
  );
}
