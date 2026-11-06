"use client";

import { useActionState } from "react";
import { login, type FormState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="form">
      <div className="field">
        <label htmlFor="password">Пароль</label>
        <input id="password" name="password" type="password" className="input" required autoFocus autoComplete="current-password" />
      </div>
      {state.error && <p className="form-error">{state.error}</p>}
      <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "Проверяем…" : "Войти"}
      </button>
    </form>
  );
}
