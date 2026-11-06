"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCategoryAction, type FormState } from "../../actions";

export function CategoryCreateForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createCategoryAction, {});
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.error) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="inline-form">
      <input name="nameRu" className="input" placeholder="Название (RU)" required />
      <input name="nameKz" className="input" placeholder="Атауы (KZ)" />
      <input name="sort" className="input" placeholder="Порядок" inputMode="numeric" />
      <button className="btn btn-primary btn-sm" type="submit" disabled={pending}>
        Добавить
      </button>
      {state.error && <p className="form-error">{state.error}</p>}
    </form>
  );
}
