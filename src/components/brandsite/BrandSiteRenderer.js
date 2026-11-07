import useSellerAnalytics from './useSellerAnalytics';
import styles from './BrandSiteRenderer.module.css';
import Head from 'next/head';
import Link from 'next/link';
import { normalizeTheme, FONT_OPTIONS } from './blocks';

export default function BrandSite({catalog,slug,page=1,preview=false,selectedSection,marketplaceOrigin}) {
  const {store,items=[],has_more:hasMore}=catalog;
  useSellerAnalytics(store.id, preview);
  const theme=normalizeTheme(catalog.theme,store);
  const marketRoute={pathname:`/store/${store.id}`,query:{module:store.module_id,brandsite:slug}};
  const market=marketplaceOrigin ? `${marketplaceOrigin}${marketRoute.pathname}?${new URLSearchParams(marketRoute.query)}` : marketRoute;
  const radius={none:'0px',soft:'16px',round:'28px'}[theme.settings.radius];
  const sections=theme.sections;
  const photo=(src,alt='',className='')=>src ? <img className={className} src={src} alt={alt} loading="lazy"/> : <div className={`photo-placeholder ${className}`} aria-label="Add an image"><svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="m3 17 6-6 4 4 3-3 5 5"/><circle cx="16" cy="8" r="1"/></svg><span>Your image belongs here</span></div>;
  const button=(p)=>p.button && (preview ? <span className="button">{p.button}<span>↗</span></span> : p.href ? <a className="button" href={p.href}>{p.button}<span>↗</span></a> : <Link className="button" href={market}>{p.button}<span>↗</span></Link>);
  const intro=p=><div className="section-intro">{p.eyebrow && <p className="eyebrow">{p.eyebrow}</p>}{p.heading && <h2>{p.heading}</h2>}{p.text && <p className="body-copy">{p.text}</p>}</div>;
  return <>
    {!preview && <Head><title>{theme.seo.title || `${theme.title} | Fasta`}</title><meta name="description" content={theme.seo.description || theme.description || `${theme.title} — shop our collection on Fasta.`}/><meta name="robots" content={theme.seo.indexable?'index,follow':'noindex,nofollow'}/><meta property="og:title" content={theme.seo.title || theme.title}/><meta property="og:description" content={theme.seo.description || theme.description}/></Head>}
    <div className={styles.brandsite} style={{'--accent':theme.accent,'--radius':radius,'--font':FONT_OPTIONS[theme.settings.font],'--page-bg':theme.settings.background,'--content-width':theme.settings.width==='wide'?'1200px':'960px'}} data-motion={theme.motion}>
      <header className="site-header"><a className="site-identity" href={preview?undefined:'#'}>{store.logo && <img src={store.logo} alt=""/>}<span>{theme.title}</span></a>
        {theme.settings.navigation && <nav className="site-nav" aria-label="Storefront navigation">{sections.filter(b=>['catalog','image_text','faq','contact'].includes(b.type)).slice(0,3).map(b=><a key={b.id} href={preview?undefined:`#${b.id}`}>{b.props.heading || b.name}</a>)}</nav>}
        {!preview && <Link className="shop-link" href={market}>Shop on Fasta <span>↗</span></Link>}
      </header>
      <main className="site-content">
      {sections.map(block=>{
        const p=block.props || {},type=block.type,list=p.items || [];
        return <section key={block.id} id={block.id} className={`block block-${type} align-${p.align || 'left'} space-${p.spacing || 'normal'} ${p.hiddenMobile?'mobile-hidden':''} ${preview?'is-preview':''}`} data-brandsite-block={preview?block.id:undefined} data-selected={preview && selectedSection===block.id?'true':undefined} style={{background:p.background || undefined,color:p.color || undefined,'--columns':p.columns || 3}} aria-label={block.name || type}>
          {preview && selectedSection===block.id && <span className="selection-label">{block.name}</span>}
          {type==='hero' && <div className={`hero-layout layout-${p.layout || 'split'}`}>{p.layout==='cover' && <div className="hero-cover">{photo(p.image || store.cover,p.alt)}</div>}<div className="hero-copy">{intro(p)}{button(p)}</div>{p.layout!=='cover' && <div className="hero-photo">{photo(p.image || store.cover,p.alt)}</div>}</div>}
          {type==='catalog' && <>{intro(p)}{items.length ? <div className="item-grid">{items.map(item=><article className="product" key={item.id}>{photo(item.image,item.name,'product-photo')}<div className="product-caption"><h3>{item.name}</h3>{!preview && <Link className="round-link" href={market} aria-label={`Shop ${item.name}`}>↗</Link>}</div></article>)}</div> : <div className="empty-catalog"><span>▦</span><h3>Your collection starts here.</h3><p>Active products added to your Fasta store will appear here automatically.</p></div>}{!preview && (page>1 || hasMore) && <nav className="pagination" aria-label="Catalog pages">{page>1 && (marketplaceOrigin ? <a href={`/?page=${page-1}`}>← Previous</a> : <Link href={{pathname:'/brandsite/[slug]',query:{slug,page:page-1}}}>← Previous</Link>)}{hasMore && page<500 && (marketplaceOrigin ? <a href={`/?page=${page+1}`}>Next →</a> : <Link href={{pathname:'/brandsite/[slug]',query:{slug,page:page+1}}}>Next →</Link>)}</nav>}</>}
          {type==='banner' && <div className={`promo ${p.image?'with-image':''}`}>{p.image && <div className="promo-image">{photo(p.image,p.alt)}</div>}<div className="promo-copy">{intro(p)}{button(p)}</div></div>}
          {['heading','text'].includes(type) && <div className={`prose ${type==='heading'?'prose-heading':''}`}>{intro(p)}</div>}
          {type==='image' && <figure>{photo(p.image,p.alt,'single-photo')}{p.text && <figcaption>{p.text}</figcaption>}</figure>}
          {type==='image_text' && <div className={`media-text ${p.layout==='right'?'reverse':''}`}><div className="media-photo">{photo(p.image,p.alt)}</div><div className="media-copy">{intro(p)}{button(p)}</div></div>}
          {['cards','gallery','features','testimonials'].includes(type) && <>{intro(p)}<div className={`content-grid grid-${type}`}>{list.map((item,index)=><article key={index} className={`content-card card-${type}`}>
            {['cards','gallery'].includes(type) && photo(item.image,item.alt || item.title,'card-photo')}
            {type==='features' && <span className="feature-number">0{index+1}</span>}
            {type==='testimonials' ? <><div className="stars" aria-label={`${item.rating || 5} out of 5 stars`}>{'★'.repeat(item.rating || 5)}</div><blockquote>“{item.quote}”</blockquote><div className="testimonial-person"><span className="avatar">{item.name?.[0] || '“'}</span><div><strong>{item.name}</strong><small>{item.role}</small></div></div></> : <div className="card-copy">{item.title && <h3>{item.title}</h3>}{item.text && <p>{item.text}</p>}{type==='cards' && item.label && (preview || !item.href?<span className="card-action">{item.label} ↗</span>:<a className="card-action" href={item.href}>{item.label} ↗</a>)}</div>}
          </article>)}</div></>}
          {type==='faq' && <div className="faq-layout">{intro(p)}<div className="faq-list">{list.map((item,index)=><details key={index}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></div>}
          {type==='cta' && <div className="cta-inner">{intro(p)}{button(p)}</div>}
          {type==='contact' && <div className="contact-layout">{intro(p)}<div className="contact-details">{p.email && <div><span>EMAIL</span><a href={preview?undefined:`mailto:${p.email}`}>{p.email}</a></div>}{p.phone && <div><span>CALL US</span><a href={preview?undefined:`tel:${p.phone.replace(/[^+0-9]/g,'')}`}>{p.phone}</a></div>}{p.address && <div><span>VISIT US</span><p>{p.address}</p></div>}{!p.email && !p.phone && !p.address && <p>Add your contact details in the block settings.</p>}</div></div>}
          {type==='spacer' && <div className="spacer" style={{height:p.height || 48}}>{preview && <span>{p.height || 48} px spacing</span>}</div>}
          {type==='divider' && <hr/>}
        </section>;
      })}
      </main>
      <footer className="site-footer"><div><strong>{theme.title}</strong><p>{theme.settings.footer || 'Good things. Local people. Delivered with care.'}</p></div><span>Powered by <strong>Fasta Deliveries</strong><i>↗</i></span></footer>
    </div>
    
  </>;
}
