"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { saveProduct, type FormState } from "@/app/admin/actions";
import { shapeLabels, toneLabels } from "@/app/admin/(panel)/labels";
import { Icon } from "@/components/Icon";
import { ProductArt } from "@/components/ProductArt";
import { slugify } from "@/lib/format";
import { SHAPES, TONES, type Category, type Product, type Shape, type Tone } from "@/lib/types";

type Props = { categories: Category[]; product?: Product };

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";

export function ProductForm({ categories, product }: Props) {
  const [state, formAction] = useActionState<FormState, FormData>(saveProduct, {});
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(product?.name ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [shape, setShape] = useState<Shape>(product?.shape ?? "tube");
  const [tone, setTone] = useState<Tone>(product?.tone ?? "lime");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [files, setFiles] = useState<File[]>([]);
  const [drag, setDrag] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  useEffect(() => {
    if (state.error) errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [state]);

  const autoSlug = slugify(`${brand} ${name}`);
  const slugValue = slugTouched ? slug : autoSlug;

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const accepted = Array.from(list).filter((f) => ACCEPT.split(",").includes(f.type));
    setFiles((prev) => [...prev, ...accepted].slice(0, 12));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.delete("newImages");
    files.forEach((f) => fd.append("newImages", f));
    startTransition(() => formAction(fd));
  };

  const hasImages = images.length + files.length > 0;

  return (
    <form onSubmit={onSubmit} className="pf">
      {product && <input type="hidden" name="id" value={product.id} />}
      {images.map((src) => (
        <input key={src} type="hidden" name="keepImages" value={src} />
      ))}

      <div style={{ display: "grid", gap: 16 }}>
        {state.error && (
          <div className="notice error" ref={errorRef}>
            <Icon name="close" size={18} /> {state.error}
          </div>
        )}

        <section className="panel glass">
          <h2>Основное</h2>
          <div className="form-grid">
            <div className="field full">
              <label htmlFor="name">Название товара *</label>
              <input id="name" name="name" className="input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Например: Vitamin C Booster Shot" />
            </div>
            <div className="field">
              <label htmlFor="brand">Бренд</label>
              <input id="brand" name="brand" className="input" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Arencia" list="brand-list" />
            </div>
            <div className="field">
              <label htmlFor="categoryId">Категория</label>
              <select id="categoryId" name="categoryId" className="select input" defaultValue={product?.categoryId ?? ""} style={{ height: 52 }}>
                <option value="">Без категории</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.nameRu}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="price">Цена, ₸ *</label>
              <input id="price" name="price" className="input" required inputMode="numeric" defaultValue={product?.price ?? ""} placeholder="12900" />
            </div>
            <div className="field">
              <label htmlFor="oldPrice">Старая цена, ₸</label>
              <input id="oldPrice" name="oldPrice" className="input" inputMode="numeric" defaultValue={product?.oldPrice ?? ""} placeholder="Для отображения скидки" />
            </div>
            <div className="field">
              <label htmlFor="volume">Объём / количество</label>
              <input id="volume" name="volume" className="input" defaultValue={product?.volume ?? ""} placeholder="30 мл" />
            </div>
            <div className="field">
              <label htmlFor="stock">Остаток, шт</label>
              <input id="stock" name="stock" className="input" inputMode="numeric" defaultValue={product?.stock ?? 0} />
            </div>
            <div className="field full">
              <label htmlFor="shortDesc">Краткое описание</label>
              <input id="shortDesc" name="shortDesc" className="input" maxLength={300} defaultValue={product?.shortDesc ?? ""} placeholder="Одно предложение для карточки товара" />
            </div>
            <div className="field full">
              <label htmlFor="skinType">Тип кожи</label>
              <input id="skinType" name="skinType" className="input" defaultValue={product?.skinType ?? ""} placeholder="Для всех типов кожи" />
            </div>
          </div>
        </section>

        <section className="panel glass">
          <h2>Описание</h2>
          <div className="form-grid">
            <div className="field full">
              <label htmlFor="description">Полное описание</label>
              <textarea id="description" name="description" className="input" rows={5} defaultValue={product?.description ?? ""} />
            </div>
            <div className="field full">
              <label htmlFor="usage">Способ применения</label>
              <textarea id="usage" name="usage" className="input" rows={3} defaultValue={product?.usage ?? ""} />
            </div>
            <div className="field full">
              <label htmlFor="ingredients">Состав</label>
              <textarea id="ingredients" name="ingredients" className="input" rows={3} defaultValue={product?.ingredients ?? ""} />
            </div>
          </div>
        </section>

        <section className="panel glass">
          <h2>Фотографии</h2>
          {hasImages && (
            <div className="img-grid">
              {images.map((src, i) => (
                <div key={src} className="img-tile">
                  <img src={src} alt="" />
                  {i === 0 && <span className="main-tag">Главное</span>}
                  <div className="tile-actions">
                    {i > 0 && (
                      <button type="button" title="Сделать главным" onClick={() => setImages((prev) => [src, ...prev.filter((x) => x !== src)])}>
                        <Icon name="star" size={14} />
                      </button>
                    )}
                    <button type="button" title="Удалить" onClick={() => setImages((prev) => prev.filter((x) => x !== src))}>
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {previews.map((src, i) => (
                <div key={src} className="img-tile">
                  <img src={src} alt="" />
                  {images.length === 0 && i === 0 && <span className="main-tag">Главное</span>}
                  {!(images.length === 0 && i === 0) && <span className="main-tag" style={{ background: "var(--honey)", color: "var(--ink)" }}>Новое</span>}
                  <div className="tile-actions">
                    <button type="button" title="Убрать" onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}>
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <label
            className={`dropzone ${drag ? "drag" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              addFiles(e.dataTransfer.files);
            }}
          >
            <Icon name="image" size={28} />
            <span>
              <b>Выберите фото</b> или перетащите сюда
            </span>
            <span className="hint">JPG, PNG, WEBP · до 10 МБ · можно несколько</span>
            <input
              ref={fileInput}
              type="file"
              accept={ACCEPT}
              multiple
              hidden
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="imageUrls">Или ссылки на фото (каждая с новой строки)</label>
            <textarea id="imageUrls" name="imageUrls" className="input" rows={2} placeholder="https://..." />
          </div>
        </section>
      </div>

      <aside className="pf-side">
        <section className="panel glass">
          <h2>Публикация</h2>
          <div className="switches">
            <label className="switch">
              <span>
                Показывать на сайте
                <small>Скрытый товар виден только в админке</small>
              </span>
              <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} />
            </label>
            <label className="switch">
              <span>
                Хит продаж
                <small>Попадёт в блок «Хиты» на главной</small>
              </span>
              <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured ?? false} />
            </label>
            <label className="switch">
              <span>
                Новинка
                <small>Бейдж «Новинка» и блок новинок</small>
              </span>
              <input type="checkbox" name="isNew" defaultChecked={product?.isNew ?? true} />
            </label>
          </div>
          <div className="field" style={{ marginTop: 12 }}>
            <label htmlFor="slug">Адрес страницы</label>
            <input
              id="slug"
              name="slug"
              className="input"
              value={slugValue}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="vitamin-c-booster"
            />
            <span className="hint">/product/{slugify(slugValue) || "…"}</span>
          </div>
          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 18 }} disabled={pending}>
            {pending ? "Сохраняем…" : product ? "Сохранить изменения" : "Добавить товар"}
          </button>
          <Link href="/admin/products" className="btn btn-ghost btn-block" style={{ marginTop: 6 }}>
            Отмена
          </Link>
        </section>

        <section className="panel glass">
          <h2>Обложка без фото</h2>
          <p className="hint" style={{ margin: "-8px 0 12px", paddingLeft: 0 }}>
            Если фото не загружено, на сайте показывается стилизованная упаковка.
          </p>
          <div className={`art-preview tone-${tone}`}>
            <ProductArt shape={shape} tone={tone} brand={brand || "Brand"} uid="preview" />
          </div>
          <div className="field">
            <label>Форма</label>
            <div className="swatches">
              {SHAPES.map((s) => (
                <label key={s} className="swatch">
                  <input type="radio" name="shape" value={s} checked={shape === s} onChange={() => setShape(s)} />
                  <span>{shapeLabels[s]}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="field" style={{ marginTop: 12 }}>
            <label>Цвет</label>
            <div className="swatches">
              {TONES.map((tn) => (
                <label key={tn} className="swatch color" title={toneLabels[tn].label}>
                  <input type="radio" name="tone" value={tn} checked={tone === tn} onChange={() => setTone(tn)} />
                  <span style={{ background: toneLabels[tn].color }} />
                </label>
              ))}
            </div>
          </div>
        </section>
      </aside>

      <datalist id="brand-list">
        {["Arencia", "Anua", "Beauty of Joseon", "COSRX", "Torriden", "Round Lab", "Medicube", "SKIN1004", "Dr.Jart+", "Mixsoon", "Mediheal", "Abib", "Illiyoon", "Some By Mi", "Ma:nyo"].map((b) => (
          <option key={b} value={b} />
        ))}
      </datalist>
    </form>
  );
}
