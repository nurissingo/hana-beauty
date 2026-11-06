"use client";

import { useActionState } from "react";
import { submitLead, type LeadState } from "@/app/actions";
import { Icon } from "@/components/Icon";
import { useI18n } from "./Providers";

export function LeadForm() {
  const { t } = useI18n();
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, { status: "idle" });

  if (state.status === "ok") {
    return (
      <div className="form-card glass-strong">
        <div className="form-success">
          <span className="chip-ico">
            <Icon name="check" size={20} strokeWidth={2.2} />
          </span>
          {t.wholesale.success}
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="form form-card glass-strong">
      <div className="field">
        <label htmlFor="l-name">{t.wholesale.name}</label>
        <input id="l-name" name="name" className="input" required autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="l-phone">{t.wholesale.phone}</label>
        <input id="l-phone" name="phone" className="input" required type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 7__ ___ __ __" />
      </div>
      <div className="field">
        <label htmlFor="l-company">{t.wholesale.company}</label>
        <input id="l-company" name="company" className="input" />
      </div>
      <div className="field">
        <label htmlFor="l-message">{t.wholesale.message}</label>
        <textarea id="l-message" name="message" className="input" rows={3} />
      </div>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {state.status === "error" && <p className="form-error">{t.cart.errorRequired}</p>}
      <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
        {pending ? t.wholesale.sending : t.wholesale.submit}
      </button>
    </form>
  );
}
