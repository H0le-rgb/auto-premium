import BusinessSite from '../shared/BusinessSite'
import { ArrowRight, ArrowUpRight, CarFront, CircleHelp, Disc3, Recycle, Truck, Wrench } from 'lucide-react'
import { type CSSProperties, useEffect } from 'react'
import { demos } from './demoData'

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
      <div className="catalog-card-art"><span>{String(index + 1).padStart(2, '0')}</span><div className={`catalog-symbol symbol-${demo.theme}`}>{demo.theme === 'neutral' ? <CircleHelp /> : demo.theme === 'electric' ? <Wrench /> : demo.theme === 'waste' ? <Recycle /> : demo.theme === 'tire' ? <Disc3 /> : demo.theme === 'truck' ? <Truck /> : <CarFront />}</div><ArrowUpRight size={18} /></div>
      <div className="catalog-card-copy"><small>{demo.category}</small><h2>{demo.name}</h2><p>{demo.headline}</p></div>
    </a>)}</section>
    <footer className="catalog-footer"><span>ВНУТРЕННИЙ КАТАЛОГ · ССЫЛКИ НА КОНЦЕПЦИИ МОЖНО ОТПРАВЛЯТЬ ОТДЕЛЬНО</span><a href="/">Открыть ГАРАЖ <ArrowUpRight size={15} /></a></footer>
  </main>
}

const DemoPage = BusinessSite

export default function DemoApp() {
  const path = window.location.pathname.replace(/\/$/, '')
  if (path === '/demos') return <Catalog />
  const slug = path.split('/').filter(Boolean)[1]
  const demo = demos.find(item => item.slug === slug)
  if (!demo) return <main className="demo-not-found"><h1>Демо не найдено</h1><p>Проверьте адрес ссылки.</p><a href="/demos">В каталог <ArrowRight size={16} /></a></main>
  return <DemoPage demo={demo} />
}
