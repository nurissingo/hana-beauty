export default function AdminLoading() {
  return (
    <div className="admin-loading" aria-busy="true" aria-label="Загрузка">
      <div className="admin-loading-bar" />
      <div className="admin-skeleton">
        <div className="sk sk-title" />
        <div className="sk sk-line" />
        <div className="sk sk-block" />
        <div className="sk sk-block" />
      </div>
    </div>
  );
}
