import { useState } from 'react'
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronDown, Clock3, Disc3, Gauge, Instagram, MapPin, Menu, Phone, Settings2, ShieldCheck, Sparkles, Wrench, X } from 'lucide-react'

// Replace these clearly marked demo details before publishing the site.
const CONTACTS = {
  phone: '+7 (999) 123-45-67',
  phoneLink: '+79991234567',
  address: 'г. Новосибирск, ул. Станционная, 38',
  hours: 'Ежедневно, 09:00–21:00',
  note: 'Демонстрационные данные — замените перед публикацией',
}

const services = [
  { num: '01', icon: Gauge, title: 'Диагностика', text: 'Находим причину, а не гадаем по симптомам. Точно, понятно и с отчётом по результатам.' },
  { num: '02', icon: Wrench, title: 'Техническое обслуживание', text: 'Регламентные работы, расходники и всё, что нужно для уверенных поездок.' },
  { num: '03', icon: Settings2, title: 'Ремонт двигателя', text: 'Бережно работаем со сложными узлами и объясняем каждый этап ремонта.' },
  { num: '04', icon: Disc3, title: 'Тормозная система', text: 'Проверяем, обслуживаем и возвращаем то самое чувство контроля.' },
]

const steps = [
  ['01', 'Знакомимся', 'Вы рассказываете, что беспокоит. Мы задаём правильные вопросы.'],
  ['02', 'Проверяем', 'Диагностируем автомобиль и согласовываем план работ.'],
  ['03', 'Работаем', 'Выполняем согласованное, оставаясь на связи.'],
  ['04', 'Передаём ключи', 'Показываем результат и отвечаем на ваши вопросы.'],
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notice, setNotice] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  const handleBook = () => { setNotice(true); window.setTimeout(() => setNotice(false), 4500) }
  const nav = [['Услуги', '#services'], ['О нас', '#about'], ['Как работаем', '#process'], ['Контакты', '#contacts']]

  return <main>
    <div className="demo-strip"><span className="demo-dot" />{CONTACTS.note}</div>
    <header className="header">
      <a className="brand" href="#top" aria-label="Гараж — на главную"><span className="brand-mark">Г<span>.</span></span><span className="brand-name">ГАРАЖ<small>АВТОСЕРВИС</small></span></a>
      <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Основная навигация">{nav.map(([name, href]) => <a key={name} href={href} onClick={closeMenu}>{name}</a>)}</nav>
      <a className="header-phone" href={`tel:${CONTACTS.phoneLink}`}><Phone size={15} />{CONTACTS.phone}</a>
      <button className="button button-yellow header-cta" onClick={handleBook}>Записаться <ArrowUpRight size={16} /></button>
      <button className="mobile-toggle" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
    </header>

    <section className="hero" id="top">
      <div className="hero-image" />
      <div className="hero-shade" />
      <div className="hero-content">
        <div className="eyebrow"><span className="eyebrow-line" />АВТОСЕРВИС НОВОГО УРОВНЯ</div>
        <h1>ВАШ АВТОМОБИЛЬ.<br /><span>НАШЕ ДЕЛО.</span></h1>
        <p className="hero-lead">Сервис, в котором о машине заботятся<br className="desktop-break" /> так, как о своей.</p>
        <div className="hero-actions"><button className="button button-yellow" onClick={handleBook}>Записаться на сервис <ArrowUpRight size={17} /></button><a href="#services" className="text-link">Наши услуги <ArrowDownRight size={16} /></a></div>
        <div className="hero-bottom"><span>СИЛЬНЫЕ РУКИ. ЧИСТАЯ РАБОТА.</span><a href="#services" aria-label="Листайте вниз"><ArrowDown size={18} /></a><span>54°59′ С. Ш. · 82°54′ В. Д.</span></div>
      </div>
      <div className="hero-index"><span>01</span><i />04</div>
      <div className="hero-stamp"><span>EST. 2012</span><b>СЕРВИС<br />С ХАРАКТЕРОМ</b></div>
    </section>

    <section className="ticker" aria-label="Наш подход"><div className="ticker-track">{Array.from({ length: 2 }, (_, block) => <span className="ticker-group" key={block}>ТОЧНОСТЬ <i>✳</i> ВНИМАНИЕ К ДЕТАЛЯМ <i>✳</i> ЧЕСТНЫЙ ПОДХОД <i>✳</i> УВЕРЕННОСТЬ НА ДОРОГЕ <i>✳</i></span>)}</div></section>

    <section className="section services" id="services">
      <div className="section-head"><div><div className="eyebrow"><span className="eyebrow-line" />ЧТО МЫ ДЕЛАЕМ</div><h2>ЗАБОТА<br />БЕЗ <span>ЛИШНЕГО.</span></h2></div><p className="section-aside">Каждая машина приходит со своей историей. Мы слушаем, разбираемся и делаем именно то, что ей нужно.</p></div>
      <div className="service-grid">{services.map(({ num, icon: Icon, title, text }) => <article className="service-card" key={num}><div className="service-top"><span>{num} / 04</span><Icon size={23} strokeWidth={1.5} /></div><div><h3>{title}</h3><p>{text}</p></div><a className="circle-link" href="#contacts" aria-label={`Подробнее: ${title}`}><ArrowUpRight size={18} /></a></article>)}</div>
      <div className="service-note"><span>НУЖНО ЧТО-ТО ДРУГОЕ?</span><a href="#contacts">Расскажите нам <ArrowRight size={15} /></a></div>
    </section>

    <section className="manifesto"><div className="manifesto-photo" /><div className="manifesto-overlay" /><div className="manifesto-content"><div className="eyebrow"><span className="eyebrow-line" />МЫ ВЕРИМ В ПРОСТЫЕ ВЕЩИ</div><p>ХОРОШИЙ СЕРВИС<br />НАЧИНАЕТСЯ С <span>УВАЖЕНИЯ.</span></p><span className="manifesto-caption">К ВАШЕМУ ВРЕМЕНИ. К ВАШЕМУ АВТОМОБИЛЮ. К ВАШЕМУ ВЫБОРУ.</span></div></section>

    <section className="section benefits"><div className="benefit-title"><div className="eyebrow"><span className="eyebrow-line" />ПОЧЕМУ ГАРАЖ</div><h2>МЕНЬШЕ<br />ВОПРОСОВ.<br /><span>БОЛЬШЕ ДЕЛА.</span></h2><p>Мы не усложняем. Просто хорошо делаем свою работу и держим вас в курсе.</p></div><div className="benefit-list"><article><span className="benefit-icon"><ShieldCheck /></span><div><h3>Понятно, что происходит</h3><p>Объясняем простыми словами, показываем и обсуждаем до начала работ.</p></div><span className="benefit-num">01</span></article><article><span className="benefit-icon"><Sparkles /></span><div><h3>Внимание к мелочам</h3><p>Инструмент на месте, рабочее пространство в порядке, автомобиль в надёжных руках.</p></div><span className="benefit-num">02</span></article><article><span className="benefit-icon"><Clock3 /></span><div><h3>Ваше время уважают</h3><p>Заранее договоримся о времени и сообщим, если планы изменятся.</p></div><span className="benefit-num">03</span></article><article><span className="benefit-icon"><Check /></span><div><h3>Ничего лишнего</h3><p>Согласуем только те работы, которые действительно нужны вашему автомобилю.</p></div><span className="benefit-num">04</span></article></div></section>

    <section className="section process" id="process"><div className="process-head"><div><div className="eyebrow"><span className="eyebrow-line" />ВСЁ ПО ПЛАНУ</div><h2>ЧЕТЫРЕ ШАГА.<br /><span>ПОЛНЫЙ ПОРЯДОК.</span></h2></div><span className="process-aside">Прозрачный процесс<br />от первого звонка до ключей.</span></div><div className="steps">{steps.map(([num, title, text]) => <article className="step" key={num}><span className="step-num">{num}</span><span className="step-line" /><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className="about" id="about"><div className="about-photo"><div className="about-tag">МЕСТО, ГДЕ АВТОМОБИЛЮ<br />РАДЫ <span>☻</span></div></div><div className="about-copy"><div className="eyebrow"><span className="eyebrow-line" />НЕМНОГО О НАС</div><h2>ЛЮБИМ<br />МАШИНЫ.<br /><span>ЦЕНИМ ЛЮДЕЙ.</span></h2><p>ГАРАЖ — команда мастеров, которым важно, как автомобиль поведёт себя после выезда за ворота. Работаем внимательно, объясняем честно и всегда рады хорошему разговору у капота.</p><a href="#contacts" className="text-link">Приезжайте знакомиться <ArrowRight size={16} /></a><span className="about-number">2012 <i>—</i> 20<span>26</span></span></div></section>

    <section className="contact" id="contacts"><div className="contact-left"><div className="eyebrow"><span className="eyebrow-line" />ВАШ СЛЕДУЮЩИЙ ШАГ</div><h2>ПОРА<br /><span>ЗНАКОМИТЬСЯ.</span></h2><p>Расскажите, что нужно вашему автомобилю.<br />Найдём время и подберём подходящее решение.</p><button className="button button-yellow" onClick={handleBook}>Записаться на сервис <ArrowUpRight size={17} /></button></div><div className="contact-info"><div className="contact-row"><span className="contact-label"><Phone size={15} />ТЕЛЕФОН</span><a href={`tel:${CONTACTS.phoneLink}`}>{CONTACTS.phone}</a></div><div className="contact-row"><span className="contact-label"><MapPin size={15} />АДРЕС</span><a href="https://yandex.ru/maps/?text=Новосибирск%2C%20ул.%20Станционная%2C%2038" target="_blank" rel="noreferrer">{CONTACTS.address}<ArrowUpRight size={14} /></a></div><div className="contact-row"><span className="contact-label"><Clock3 size={15} />ГРАФИК</span><span>{CONTACTS.hours}</span></div><div className="contact-demo"><span className="demo-dot" />ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ — ЗАМЕНИТЕ ПЕРЕД ПУБЛИКАЦИЕЙ</div></div></section>

    <footer className="footer"><a className="brand" href="#top"><span className="brand-mark">Г<span>.</span></span><span className="brand-name">ГАРАЖ<small>АВТОСЕРВИС</small></span></a><span className="footer-copy">СДЕЛАНО С УВАЖЕНИЕМ К ДЕТАЛЯМ.</span><div className="footer-links"><a href="#services">Услуги</a><a href="#about">О нас</a><a href={`tel:${CONTACTS.phoneLink}`} aria-label="Позвонить"><Phone size={15} /></a><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={16} /></a><a href="#top" aria-label="Наверх"><ChevronDown className="up-chevron" size={17} /></a></div><span className="copyright">© 2026 ГАРАЖ</span></footer>
    {notice && <div className="toast" role="status"><span className="toast-check"><Check size={15} /></span><span><b>Будем рады вашему звонку</b><small>Позвоните нам: {CONTACTS.phone}</small></span><a href={`tel:${CONTACTS.phoneLink}`}><Phone size={17} /></a><button aria-label="Закрыть" onClick={() => setNotice(false)}><X size={16} /></button></div>}
  </main>
}

export default App
