import { ArrowDown, ArrowRight, ArrowUpRight, CarFront, Check, ChevronRight, CircleHelp, Menu, Phone, Wrench, X } from 'lucide-react'
import { type CSSProperties, useEffect, useState } from 'react'
import { demos, type DemoBusiness } from './demoData'

function Catalog() {
  useEffect(() => {
    document.title = 'Внутренний каталог демоверсий'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Внутренний каталог демонстрационных концепций сайтов для компаний Барнаула.')
    const robots = document.querySelector('meta[name="robots"]') ?? document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'robots' }))
    robots.setAttribute('content', 'noindex, nofollow')
  }, [])
  return <main className="demo-catalog" style={{ '--accent': '#d3ef44', '--ink': '#f1f0eb' } as CSSProperties}>
    <header className="catalog-top"><a href="/" className="catalog-brand"><CarFront /> AUTO / CONCEPT</a><span>ВНУТРЕННИЙ ПРОСМОТР</span></header>
    <section className="catalog-intro"><p className="demo-kicker">BARNAUL · PRIVATE PREVIEW</p><h1>Демо-сайты<br /><em>для бизнеса.</em></h1><p>Персональные концепции, подготовленные для предварительного просмотра. Откройте карточку, чтобы посмотреть сайт.</p><div className="catalog-count">{demos.length} КОНЦЕПЦИЙ <span /> АВТОСФЕРА И СМЕЖНЫЕ НАПРАВЛЕНИЯ</div></section>
    <section className="catalog-grid" aria-label="Каталог демоверсий">{demos.map((demo, index) => <a className="catalog-card" href={`/demo/${demo.slug}`} key={demo.slug} style={{ '--accent': demo.accent, '--ink': '#f3f2ed' } as React.CSSProperties}>
      <div className="catalog-card-art"><span>{String(index + 1).padStart(2, '0')}</span><div className={`catalog-symbol symbol-${demo.theme}`}>{demo.theme === 'neutral' ? <CircleHelp /> : demo.theme === 'electric' ? <Wrench /> : <CarFront />}</div><ArrowUpRight size={18} /></div>
      <div className="catalog-card-copy"><small>{demo.theme.toUpperCase()} / BARNAUL</small><h2>{demo.name}</h2><p>{demo.headline}</p></div>
    </a>)}</section>
    <footer className="catalog-footer"><span>ВНУТРЕННИЙ КАТАЛОГ · ССЫЛКИ НА КОНЦЕПЦИИ МОЖНО ОТПРАВЛЯТЬ ОТДЕЛЬНО</span><a href="/">Открыть ГАРАЖ <ArrowUpRight size={15} /></a></footer>
  </main>
}

function DemoPage({ demo }: { demo: DemoBusiness }) {
  const [menu, setMenu] = useState(false)
  useEffect(() => {
    document.title = `${demo.name} — демонстрационная концепция`
    const meta = document.querySelector('meta[name="description"]')
    meta?.setAttribute('content', `${demo.name}: ${demo.description} Демонстрационная концепция сайта.`)
    const robots = document.querySelector('meta[name="robots"]') ?? document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'robots' }))
    robots.setAttribute('content', 'noindex, nofollow')
    return () => { document.title = 'ГАРАЖ'; robots.remove() }
  }, [demo])
  const featured = demo.services ?? []
  const nav = [{ href: '#approach', label: 'Концепция' }, ...(featured.length ? [{ href: '#services', label: 'Направления' }] : []), { href: '#contacts', label: 'Контакты' }]
  return <main className={`business-site theme-${demo.theme}`} style={{ '--accent': demo.accent, '--site-bg': demo.background } as CSSProperties}>
    <div className="preview-banner"><span /> ДЕМОНСТРАЦИОННАЯ КОНЦЕПЦИЯ САЙТА <span>ИНФОРМАЦИЮ ПРОВЕРИТЬ ПЕРЕД ПУБЛИКАЦИЕЙ</span></div>
    <header className="business-header"><a className="business-logo" href="#top"><span className="business-monogram">{demo.name.slice(0, 1)}</span><span>{demo.name}<small>BARNAUL / AUTO</small></span></a><nav className={menu ? 'business-nav opened' : 'business-nav'} aria-label="Основная навигация">{nav.map(link => <a key={link.href} href={link.href} onClick={() => setMenu(false)}>{link.label}</a>)}</nav><div className="business-header-action">{demo.phones?.[0] ? <a className="business-phone" href={demo.phones[0].href}><Phone size={15} />{demo.phones[0].display}</a> : <span className="phone-pending">ТЕЛЕФОН НЕ ПРЕДОСТАВЛЕН</span>}{demo.phones?.[0] && <a className="business-cta" href={demo.phones[0].href}>Позвонить <ArrowUpRight size={16} /></a>}<button className="business-menu" aria-label={menu ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button></div></header>
    <section id="top" className={`business-hero hero-${demo.theme}`}>
      <div className="hero-copy"><p className="demo-kicker"><span />{demo.eyebrow}</p><h1>{demo.headline}</h1><p className="hero-description">{demo.description}</p><div className="hero-buttons">{demo.phones?.[0] ? <a className="business-cta large" href={demo.phones[0].href}>Связаться <ArrowUpRight size={18} /></a> : <a className="business-cta large" href="#contacts">Контакты <ArrowDown size={17} /></a>}<a className="hero-secondary" href={featured.length ? '#services' : '#approach'}>Узнать больше <ArrowDown size={16} /></a></div><div className="hero-bottomline"><span>КОНЦЕПЦИЯ ДЛЯ {demo.name.toLocaleUpperCase('ru')}</span><span>53°20′ С. Ш. · 83°46′ В. Д.</span></div></div>
      <div className="hero-visual" aria-hidden="true"><div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/><div className="visual-disc">{demo.theme === 'tire' ? '°' : demo.theme === 'truck' ? 'ТРАНСПОРТ' : demo.theme === 'shaft' ? '⟷' : demo.theme === 'detail' ? 'FORM / FINISH' : demo.theme === 'electric' ? '12V+' : demo.theme === 'tuning' ? 'RPM' : demo.theme === 'waste' ? 'ECO' : 'AUTO'}<div className="visual-glyph">{demo.theme === 'neutral' ? <CircleHelp /> : demo.theme === 'electric' ? <Wrench /> : <CarFront />}</div></div><div className="visual-caption"><span>01 / {demo.theme.toUpperCase()}</span><span>BARNAUL, RUSSIA</span></div></div>
    </section>
    <section id="approach" className="business-intro"><div className="intro-label"><span>01</span><span>О ПРОЕКТЕ</span></div><div className="intro-content"><p className="demo-kicker">{demo.theme === 'neutral' ? 'ПЕРСОНАЛЬНАЯ КОНЦЕПЦИЯ' : 'ВАШЕ ДЕЛО — В ЦЕНТРЕ ВНИМАНИЯ'}</p><h2>{demo.theme === 'neutral' ? 'Сначала уточняем детали.' : demo.theme === 'tire' ? 'Важное — всегда под рукой.' : demo.theme === 'garage' ? 'Понятный путь от вопроса к решению.' : demo.theme === 'detail' ? 'Каждая деталь имеет значение.' : demo.theme === 'shaft' ? 'Специализация требует точности.' : demo.theme === 'truck' ? 'Время транспорта — часть работы.' : demo.theme === 'tuning' ? 'Техника встречается с характером.' : demo.theme === 'electric' ? 'Точная диагностика начинается с симптома.' : 'Ответственный подход к делу.'}</h2><p>{demo.note ?? 'Сайт-концепция показывает структуру и визуальный подход. Фактический перечень услуг и подробности можно уточнить перед разработкой.'}</p></div><div className="intro-stamp"><span>DEMO</span><Check /><small>PREVIEW<br />CONCEPT</small></div></section>
    {featured.length > 0 && <section id="services" className="business-services"><div className="service-heading"><div><p className="demo-kicker"><span />02 / НАПРАВЛЕНИЯ</p><h2>{demo.theme === 'tire' ? 'Работы с колёсами.' : demo.theme === 'garage' ? 'Сервис и ремонт.' : demo.theme === 'electric' ? 'Электрика автомобиля.' : demo.theme === 'detail' ? 'Уход за автомобилем.' : demo.theme === 'shaft' ? 'Ремонт узла.' : demo.theme === 'truck' ? 'Транспорт в фокусе.' : demo.theme === 'tuning' ? 'Возможности настройки.' : demo.theme === 'waste' ? 'Экологические услуги.' : 'Заявленные направления.'}</h2></div><p>Направления, заявленные для этой компании. Детали и доступность работ лучше уточнить напрямую.</p></div><div className={`service-tiles tiles-${demo.theme}`}>{featured.map((service, index) => <article className="service-tile" key={service}><div className="tile-top"><span>0{index + 1}</span><ArrowUpRight size={18} /></div><div className="tile-icon">{demo.theme === 'tire' ? '◉' : demo.theme === 'electric' ? 'ϟ' : demo.theme === 'shaft' ? '↔' : demo.theme === 'truck' ? '▰' : demo.theme === 'waste' ? '↻' : demo.theme === 'detail' ? '✳' : demo.theme === 'tuning' ? '⌁' : '✳'}</div><h3>{service}</h3><span className="tile-rule" /></article>)}</div></section>}
    {demo.theme === 'detail' && <section className="portfolio-concept"><div className="portfolio-caption"><p className="demo-kicker">VISUAL DIRECTION / 03</p><h2>Работы, которые<br /><em>говорят за себя.</em></h2><p>Место для реального портфолио детейлинг-центра. Изображения-заглушки не используются.</p></div><div className="portfolio-panels"><div className="portfolio-panel"><span>01 / КУЗОВ</span><div className="portfolio-shape"/></div><div className="portfolio-panel"><span>02 / ДЕТАЛИ</span><div className="portfolio-shape shape-two"/></div><div className="portfolio-panel"><span>03 / РЕЗУЛЬТАТ</span><div className="portfolio-shape shape-three"/></div></div></section>}
    {demo.theme === 'garage' && <section className="process-concept"><p className="demo-kicker">ПОНЯТНАЯ ПОСЛЕДОВАТЕЛЬНОСТЬ</p><div className="process-steps"><article><span>01</span><h3>Обращение</h3><p>Расскажите, что происходит с автомобилем.</p></article><article><span>02</span><h3>Проверка</h3><p>Обсудите с мастером необходимую диагностику.</p></article><article><span>03</span><h3>Согласование</h3><p>Уточните состав работ до начала ремонта.</p></article></div></section>}
    <section className="business-contact" id="contacts"><div className="contact-heading"><p className="demo-kicker"><span />03 / КОНТАКТЫ</p><h2>Начните<br /><em>с разговора.</em></h2><p>Позвоните, чтобы уточнить детали и договориться о следующем шаге.</p></div><div className="contact-panel"><span className="contact-panel-label">СВЯЗЬ С КОМПАНИЕЙ</span>{demo.phones?.length ? demo.phones.map((item, index) => <a className="contact-phone" key={item.href + index} href={item.href}><span>{item.label ?? `Телефон ${String(index + 1).padStart(2, '0')}`}</span><strong>{item.display}</strong><ArrowUpRight size={17} /></a>) : <div className="contact-missing">Контактный телефон не предоставлен.<br />Запросите его у владельца перед публикацией.</div>}<p className="contact-disclaimer">Демонстрационная версия. Адрес, график работы, цены и дополнительные способы связи не указаны без подтверждённых данных.</p></div></section>
    <footer className="business-footer"><a className="business-logo" href="#top"><span className="business-monogram">{demo.name.slice(0, 1)}</span><span>{demo.name}<small>BARNAUL / AUTO</small></span></a><span>ДЕМОНСТРАЦИОННАЯ КОНЦЕПЦИЯ</span><a href="#top" className="back-top">НАВЕРХ <ChevronRight size={15} /></a></footer>
  </main>
}

export default function DemoApp() {
  const path = window.location.pathname.replace(/\/$/, '')
  if (path === '/demos') return <Catalog />
  const slug = path.split('/').filter(Boolean)[1]
  const demo = demos.find(item => item.slug === slug)
  if (!demo) return <main className="demo-not-found"><h1>Демо не найдено</h1><p>Проверьте адрес ссылки.</p><a href="/demos">В каталог <ArrowRight size={16} /></a></main>
  return <DemoPage demo={demo} />
}
