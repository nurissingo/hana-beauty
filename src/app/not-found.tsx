import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="container" style={{ padding: "120px 24px" }}>
        <div className="empty glass">
          <p className="eyebrow">404</p>
          <h1 className="h2">Страница не найдена</h1>
          <p>Бет табылмады</p>
          <Link href="/" className="btn btn-primary">
            На главную
          </Link>
        </div>
      </div>
    </>
  );
}
