import type { Metadata } from "next";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Icon } from "@/components/Icon";
import { requireAdmin } from "@/lib/auth";
import { listLeads } from "@/lib/repo";
import { deleteLeadAction, toggleLeadAction } from "../../actions";

export const metadata: Metadata = { title: "Оптовые заявки" };

export default async function LeadsPage() {
  await requireAdmin();
  const leads = listLeads();
  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Оптовые заявки</h1>
          <p>Анкеты из блока «Оптом» на главной странице</p>
        </div>
      </div>

      {leads.length === 0 ? (
        <section className="panel glass">
          <p className="muted">Заявок пока нет.</p>
        </section>
      ) : (
        <div className="list">
          {leads.map((l) => (
            <article key={l.id} className="order" style={{ opacity: l.isDone ? 0.6 : 1 }}>
              <div className="order-head">
                <h3>{l.name}</h3>
                <span className={`status ${l.isDone ? "done" : "new"}`}>{l.isDone ? "Обработана" : "Новая"}</span>
                <span className="meta">{new Date(`${l.createdAt.replace(" ", "T")}Z`).toLocaleString("ru-RU", { timeZone: "Asia/Almaty" })}</span>
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 16, flexWrap: "wrap", fontSize: 14.5 }}>
                <a href={`tel:${l.phone}`}><Icon name="phone" size={15} className="muted" /> {l.phone}</a>
                {l.company && <span><Icon name="instagram" size={15} className="muted" /> {l.company}</span>}
              </div>
              {l.message && <div className="order-items">{l.message}</div>}
              <div className="order-foot" style={{ marginTop: l.message ? 0 : 12 }}>
                <form action={toggleLeadAction}>
                  <input type="hidden" name="id" value={l.id} />
                  <input type="hidden" name="done" value={l.isDone ? "0" : "1"} />
                  <button className="btn btn-glass btn-sm">
                    <Icon name="check" size={16} /> {l.isDone ? "Вернуть в новые" : "Отметить обработанной"}
                  </button>
                </form>
                <form action={deleteLeadAction} style={{ marginLeft: "auto" }}>
                  <input type="hidden" name="id" value={l.id} />
                  <ConfirmButton className="icon-btn danger" title="Удалить" message="Удалить заявку?">
                    <Icon name="trash" size={18} />
                  </ConfirmButton>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
