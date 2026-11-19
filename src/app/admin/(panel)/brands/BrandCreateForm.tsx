"use client";

import { useActionState } from "react";
import { createBrandAction, type FormState } from "../../actions";

export function BrandCreateForm({ suggestions }: { suggestions: string[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(createBrandAction, {});

  return (
    <form action={action} className="brand-create">
      <div className="inline-form" style={{ gridTemplateColumns: "1fr 90px auto auto" }}>
        <input name="name" className="input" placeholder="Название бренда (как в товарах)" list="brand-suggestions" required />
        <datalist id="brand-suggestions">
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        <input name="sort" className="input" defaultValue={0} aria-label="Порядок" inputMode="numeric" />
        <label className="switch" style={{ padding: "0 8px", margin: 0 }}>
          <span>
            На главной
            <small>показывать в блоке брендов</small>
          </span>
          <input type="checkbox" name="showHome" value="1" defaultChecked />
        </label>
        <button className="btn btn-primary btn-sm" type="submit" disabled={pending}>
          {pending ? "…" : "Добавить"}
        </button>
      </div>
      {state.error ? <p className="form-error" style={{ marginTop: 10 }}>{state.error}</p> : null}
    </form>
  );
}
