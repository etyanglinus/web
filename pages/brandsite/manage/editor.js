import Head from 'next/head';
import Link from 'next/link';
import {useEffect,useReducer,useRef,useState} from 'react';
import BrandSite from '../../../src/components/brandsite/BrandSiteRenderer';
import {BLOCKS,newBlock,normalizeTheme,pattern,uid} from '../../../src/components/brandsite/blocks';
import styles from '../../../src/components/brandsite/BrandSiteEditor.module.css';

const endpoint='/api/brandsite/editor';
const initial={past:[],draft:null,future:[]};
function history(state,action){
  if(action.type==='load')return {...initial,draft:action.draft};
  if(action.type==='edit')return {past:[...state.past.slice(-59),state.draft],draft:action.draft,future:[]};
  if(action.type==='undo' && state.past.length)return {past:state.past.slice(0,-1),draft:state.past.at(-1),future:[state.draft,...state.future]};
  if(action.type==='redo' && state.future.length)return {past:[...state.past,state.draft],draft:state.future[0],future:state.future.slice(1)};
  return state;
}
const errorText=result=>Object.values(result?.errors || {}).flat().map(e=>typeof e==='string'?e:e.message).join(' ') || result?.message || 'Please try again.';
async function request(body){
  const response=await fetch(endpoint,body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const result=await response.json();if(!response.ok)throw new Error(errorText(result));return result;
}

export default function BrandSiteEditor(){
  const [state,setState]=useState(null),[{past,draft,future},dispatch]=useReducer(history,initial);
  const [selected,setSelected]=useState(''),[left,setLeft]=useState('list'),[settings,setSettings]=useState(true),[tab,setTab]=useState('block');
  const [viewport,setViewport]=useState('Desktop'),[search,setSearch]=useState(''),[group,setGroup]=useState('All');
  const [busy,setBusy]=useState(true),[uploading,setUploading]=useState(false),[error,setError]=useState(''),[message,setMessage]=useState('');
  const [revision,setRevision]=useState(''),[dialog,setDialog]=useState('');
  const started=useRef(false),dragged=useRef(null);
  const locked=busy || uploading;
  const block=draft?.sections.find(b=>b.id===selected) || draft?.sections[0];
  const dirty=Boolean(draft && state && JSON.stringify(draft)!==JSON.stringify(state.draft));
  const load=result=>{
    const document=normalizeTheme(result.draft,result.store);
    setState({...result,draft:document});dispatch({type:'load',draft:document});
    setSelected(current=>document.sections.some(b=>b.id===current)?current:document.sections[0].id);
  };
  useEffect(()=>{
    if(started.current)return;started.current=true;
    (async()=>{
      const code=new URLSearchParams(window.location.hash.slice(1)).get('code');
      if(code){window.history.replaceState(window.history.state,'',window.location.pathname);const r=await fetch(endpoint+'?action=session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})});if(!r.ok)throw new Error(errorText(await r.json()));}
      load(await request());
    })().catch(e=>setError(e.message)).finally(()=>setBusy(false));
  },[]);
  useEffect(()=>{if(!dirty)return;const warn=e=>{e.preventDefault();e.returnValue='';};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
  const edit=next=>{setMessage('');dispatch({type:'edit',draft:next});};
  const change=patch=>edit({...draft,...patch});
  const updateProps=patch=>change({sections:draft.sections.map(b=>b.id===block.id?{...b,props:{...b.props,...patch}}:b)});
  const choose=id=>{setSelected(id);setTab('block');setSettings(true);};
  const add=type=>{
    if(draft.sections.length>=40){setError('A page supports up to 40 blocks.');return;}
    const created=newBlock(type,state.store);const index=draft.sections.findIndex(b=>b.id===block?.id)+1;
    const sections=[...draft.sections];sections.splice(index,0,created);change({sections});choose(created.id);
  };
  const duplicate=()=>{
    if(draft.sections.length>=40){setError('A page supports up to 40 blocks.');return;}
    const copy={...structuredClone(block),id:uid(),name:`${block.name.slice(0,50)} copy`};const sections=[...draft.sections];sections.splice(sections.findIndex(b=>b.id===block.id)+1,0,copy);change({sections});choose(copy.id);
  };
  const remove=()=>{if(draft.sections.length<2)return;const sections=draft.sections.filter(b=>b.id!==block.id);change({sections});setSelected(sections[0].id);};
  const move=(from,to)=>{if(locked || from===null || to<0 || to>=draft.sections.length || from===to)return;const sections=[...draft.sections];sections.splice(to,0,sections.splice(from,1)[0]);change({sections});};
  const persist=async(body,success)=>{
    setBusy(true);setError('');setMessage('');
    try{const result=await request({...body,revision:state.revision});load(result);setMessage(success);}catch(e){setError(e.message);}finally{setBusy(false);}
  };
  const save=publish=>persist({...draft,publish},publish?'Your storefront is published.':'Draft saved.');
  useEffect(()=>{
    const key=e=>{
      if(!draft || locked)return;
      const typing=/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.isContentEditable;
      if((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==='s'){e.preventDefault();if(dirty)save(false);}
      if(!typing && (e.ctrlKey || e.metaKey) && e.key.toLowerCase()==='z'){e.preventDefault();dispatch({type:e.shiftKey?'redo':'undo'});}
      if(e.key==='Escape'){setDialog('');}
    };window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
  },[draft,locked,dirty,state]);
  const upload=async file=>{
    if(file.size>5*1024*1024)throw new Error('Choose an image smaller than 5 MB.');
    if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Choose a JPG, PNG or WebP image.');
    setUploading(true);setError('');
    try{const response=await fetch(endpoint+'/media',{method:'POST',headers:{'Content-Type':file.type},body:file});const result=await response.json();if(!response.ok)throw new Error(errorText(result));setMessage('Image uploaded. Save your draft to keep it on the page.');return result.url;}finally{setUploading(false);}
  };
  const download=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(draft,null,2)+'\n'],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`${state.store.slug}.brandsite.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  const importFile=async e=>{const file=e.target.files?.[0];e.target.value='';if(!file)return;try{if(file.size>120*1024)throw new Error('Choose a JSON theme smaller than 120 KB.');if(!file.name.toLowerCase().endsWith('.json'))throw new Error('Choose a JSON theme.');await persist({theme:JSON.parse(await file.text())},'Theme imported into your private draft.');}catch(e){setError(e instanceof SyntaxError?'This file contains invalid JSON.':e.message);}};
  const props=block?.props || {},index=draft?.sections.findIndex(b=>b.id===block?.id);
  const patchSettings=patch=>change({settings:{...draft.settings,...patch}});
  const patchSeo=patch=>change({seo:{...draft.seo,...patch}});
  return <main className={styles.editor}>
    <Head><title>BrandSite editor | Fasta</title><meta name="robots" content="noindex"/></Head>
    <header className="toolbar"><a className="brand" href={state?.dashboard_url || '#'} aria-label="Return to My BrandSite">F<span>•</span></a>
      <div className="tools"><button className={`square add ${left==='insert'?'active':''}`} aria-label="Add block" aria-pressed={left==='insert'} onClick={()=>setLeft(left==='insert'?'':'insert')}>＋</button><button className="square" aria-label="Undo" disabled={locked || !past.length} onClick={()=>dispatch({type:'undo'})}>↶</button><button className="square" aria-label="Redo" disabled={locked || !future.length} onClick={()=>dispatch({type:'redo'})}>↷</button><span className="separator"/><button className={`square ${left==='list'?'active':''}`} aria-label="List view" aria-pressed={left==='list'} onClick={()=>setLeft(left==='list'?'':'list')}>☷</button><button className="patterns-trigger" onClick={()=>setDialog('patterns')} disabled={locked || !draft}>Layouts</button></div>
      <div className="document"><span className="document-type">HOMEPAGE · {draft?.sections.length || 0} BLOCKS</span><h1>{state?.store.name || 'BrandSite editor'}</h1><span className="save-state">{dirty?'Unsaved changes':'All changes saved'}</span></div>
      <div className="actions"><label className="viewport"><span className="sr-only">Preview size</span><select aria-label="Preview size" value={viewport} onChange={e=>setViewport(e.target.value)}><option>Desktop</option><option>Tablet</option><option>Mobile</option></select></label>{state?.published_revision!=null && <Link className="live-link" href={`/brandsite/${state.store.slug}`} target="_blank" rel="noopener noreferrer">View site ↗</Link>}<button className="text-button" disabled={locked || !dirty} onClick={()=>save(false)}>Save draft</button><button className="primary" disabled={locked || !draft} onClick={()=>save(true)}>Publish</button><button className={`square ${settings?'active':''}`} aria-label="Settings" aria-pressed={settings} onClick={()=>setSettings(!settings)}>◫</button></div>
    </header>
    {state?.support_mode && <div className="support-banner"><strong>Admin support session</strong><span>Editing {state.store.name}. Your saves and publications are recorded as administrator actions.</span></div>}
    <div className="notices" aria-live="polite">{(busy || uploading) && <p role="status">{uploading?'Uploading image…':state?'Saving…':'Opening your editor…'}</p>}{message && <p role="status" className="success">✓ {message}</p>}{error && <p role="alert" className="error">{error}<button onClick={()=>setError('')} aria-label="Dismiss error">×</button></p>}</div>
    {draft && <div className={`workspace ${left?'has-left':''} ${settings?'has-right':''}`}>
      {left && <aside className="outline" aria-label={left==='insert'?'Block inserter':'List view'}><div className="panel-heading"><h2>{left==='insert'?'Build your page':'List view'}</h2><button className="square" aria-label="Close block panel" onClick={()=>setLeft('')}>×</button></div>
        {left==='insert'?<><div className="library-tabs"><button className="current">Blocks</button><button onClick={()=>setDialog('patterns')}>Starter layouts ↗</button></div><label className="search"><span>⌕</span><input placeholder="Search 16 blocks" aria-label="Search blocks" value={search} onChange={e=>setSearch(e.target.value)}/></label><div className="group-filters">{['All','Commerce','Content','Media','Layout'].map(g=><button key={g} className={group===g?'chosen':''} onClick={()=>setGroup(g)}>{g}</button>)}</div><div className="block-library">{Object.entries(BLOCKS).filter(([type,meta])=>(group==='All' || meta.group===group) && (meta.label+' '+meta.description).toLowerCase().includes(search.toLowerCase())).map(([type,meta])=><button key={type} className="block-tile" title={meta.description} disabled={locked || draft.sections.length>=40} onClick={()=>add(type)}><span className="block-symbol">{meta.icon}</span><strong>{meta.label}</strong><span>{meta.group}</span></button>)}</div><p className="panel-note">Add repeatable blocks. Arrange them your way. Each block has its own content and styling.</p></>:<><div className="page-label"><span>▤</span><span>Homepage</span><span className="count">{draft.sections.length}/40</span></div><ol>{draft.sections.map((b,i)=><li key={b.id} className={block?.id===b.id?'selected':''} draggable={!locked} onDragStart={e=>{dragged.current=i;e.dataTransfer.setData('text/plain',b.id);}} onDragEnd={()=>{dragged.current=null;}} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();move(dragged.current,i);dragged.current=null;}}><button className="block-name" aria-pressed={block?.id===b.id} onClick={()=>choose(b.id)}><span>{BLOCKS[b.type].icon}</span><span>{b.name}{b.props.hiddenMobile && <small>Hidden on mobile</small>}</span></button><div className="move-buttons"><button aria-label={`Move ${b.name} up`} disabled={locked || i===0} onClick={()=>move(i,i-1)}>↑</button><button aria-label={`Move ${b.name} down`} disabled={locked || i===draft.sections.length-1} onClick={()=>move(i,i+1)}>↓</button></div></li>)}</ol><button className="add-another" onClick={()=>setLeft('insert')}>＋ Add a block</button><p className="panel-note">Drag blocks to reorder. Duplicate your favourites from the block toolbar.</p></>}
      </aside>}
      <section className="canvas-area" aria-label="Live storefront preview"><div className="canvas-top"><span>HOMEPAGE / {viewport.toUpperCase()}</span><span>{dirty?'Unsaved changes':state.published_revision!=null?`Live revision ${state.published_revision}`:'Private draft'}</span></div>
        {block && <div className="floating-toolbar"><span>{BLOCKS[block.type].icon}</span><strong>{block.name}</strong><button disabled={locked || index===0} onClick={()=>move(index,index-1)} aria-label="Move selected block up">↑</button><button disabled={locked || index===draft.sections.length-1} onClick={()=>move(index,index+1)} aria-label="Move selected block down">↓</button><button disabled={locked || draft.sections.length>=40} onClick={duplicate}>Duplicate</button><button className="danger" disabled={locked || draft.sections.length===1} onClick={remove}>Remove</button></div>}
        <div className={`canvas viewport-${viewport.toLowerCase()}`} style={{maxWidth:{Desktop:1200,Tablet:768,Mobile:390}[viewport]}} onClick={e=>{const target=e.target.closest('[data-brandsite-block]');if(target)choose(target.dataset.brandsiteBlock);if(e.target.closest('a'))e.preventDefault();}}><BrandSite preview selectedSection={block?.id} catalog={{store:state.store,items:state.items,theme:draft}}/></div><div className="canvas-bottom"><span>{block?.name}</span><span>Live changes require Publish · Ctrl / ⌘ + S to save</span></div>
      </section>
      {settings && <aside className="inspector" aria-label="Website settings"><div className="inspector-tabs"><button className={tab==='site'?'current':''} onClick={()=>setTab('site')}>Website</button><button className={tab==='block'?'current':''} onClick={()=>setTab('block')}>Block</button><button className="square" aria-label="Close settings" onClick={()=>setSettings(false)}>×</button></div><fieldset disabled={locked}>
        {tab==='site'?<>
          <div className="property-group"><p className="eyebrow">YOUR BRAND, YOUR WAY</p><h2>Website settings</h2><Field label="Website title" value={draft.title} max={120} onChange={title=>change({title})}/><Field label="Store introduction" value={draft.description} max={600} multiline onChange={description=>change({description})}/></div>
          <details className="property-group" open><summary>Global design</summary><Color label="Brand accent" value={draft.accent} onChange={accent=>change({accent})}/><Select label="Typography" value={draft.settings.font} options={{system:'Modern sans serif',editorial:'Editorial serif',rounded:'Soft and rounded'}} onChange={font=>patchSettings({font})}/><Select label="Content width" value={draft.settings.width} options={{standard:'Focused · 960 px',wide:'Spacious · 1200 px'}} onChange={width=>patchSettings({width})}/><Select label="Corner style" value={draft.settings.radius} options={{none:'Square',soft:'Soft',round:'Rounded'}} onChange={radius=>patchSettings({radius})}/><Color label="Page background" value={draft.settings.background || '#ffffff'} onChange={background=>patchSettings({background})}/><Select label="Section entrance" value={draft.motion} options={{none:'None',fade:'Fade in',rise:'Rise and fade'}} onChange={motion=>change({motion})}/><p className="help">Animations respect reduced-motion preferences.</p></details>
          <details className="property-group"><summary>Header & footer</summary><Check label="Show section navigation" value={draft.settings.navigation} onChange={navigation=>patchSettings({navigation})}/><Field label="Footer message" value={draft.settings.footer} max={220} multiline onChange={footer=>patchSettings({footer})}/><p className="help">Your logo and catalog images come from your Fasta store.</p></details>
          <details className="property-group"><summary>Search & sharing</summary><Field label="Search title" value={draft.seo.title} max={160} onChange={title=>patchSeo({title})}/><Field label="Search description" value={draft.seo.description} max={300} multiline onChange={description=>patchSeo({description})}/><Check label="Allow search engines to index this site" value={draft.seo.indexable} onChange={indexable=>patchSeo({indexable})}/></details>
          <details className="property-group"><summary>Import or export a theme</summary><p className="help">Portable JSON, versions 1 and 2. Import saves a private draft. Save current edits first.</p><label className="file-label">Upload theme · JSON, up to 120 KB<input type="file" accept=".json,application/json" disabled={locked || dirty} onChange={importFile}/></label><button className="secondary full" onClick={download}>Export current theme</button></details>
          <details className="property-group"><summary>Revision history</summary><Select label="Published versions" value={revision} options={{'':'Choose a version',...Object.fromEntries(state.publications.map(n=>[n,`Revision ${n}`]))}} onChange={setRevision}/><button className="secondary full" disabled={locked || dirty || !revision} onClick={()=>persist({restore_revision:Number(revision)},'Version restored to your private draft.')}>Restore to draft</button><p className="help">Restoring does not change the live site until you publish.</p></details>
        </>:block && <>
          <div className="property-group"><div className="block-description"><span className="block-symbol">{BLOCKS[block.type].icon}</span><div><h2>{BLOCKS[block.type].label}</h2><p className="help">{BLOCKS[block.type].description}</p></div></div></div>
          <BlockFields block={block} update={updateProps} upload={upload} onError={setError}/>
          <details className="property-group" open><summary>Appearance</summary><Select label="Text alignment" value={props.align || 'left'} options={{left:'Left',center:'Centre',right:'Right'}} onChange={align=>updateProps({align})}/><Select label="Section spacing" value={props.spacing || 'normal'} options={{compact:'Compact',normal:'Comfortable',spacious:'Spacious'}} onChange={spacing=>updateProps({spacing})}/>{['catalog','cards','gallery','features','testimonials'].includes(block.type) && <Select label="Desktop columns" value={props.columns || 3} options={{2:'2 columns',3:'3 columns',4:'4 columns'}} onChange={v=>updateProps({columns:Number(v)})}/>}<Color label="Section background" value={props.background || '#ffffff'} onChange={background=>updateProps({background})} clear={()=>{const {background,...rest}=props;change({sections:draft.sections.map(b=>b.id===block.id?{...b,props:rest}:b)});}}/><Color label="Text colour" value={props.color || '#172c24'} onChange={color=>updateProps({color})}/></details>
          <details className="property-group"><summary>Block settings</summary><Field label="Block name" value={block.name} max={60} onChange={name=>change({sections:draft.sections.map(b=>b.id===block.id?{...b,name}:b)})}/><Check label="Hide on mobile" value={props.hiddenMobile} onChange={hiddenMobile=>updateProps({hiddenMobile})}/><p className="help">Desktop column layouts automatically adapt to smaller screens.</p><button className="secondary full" disabled={draft.sections.length>=40} onClick={duplicate}>Duplicate block</button><button className="remove" disabled={draft.sections.length===1} onClick={remove}>Remove block</button></details>
        </>}
      </fieldset></aside>}
    </div>}
    {dialog==='patterns' && <div className="modal-backdrop" onClick={()=>setDialog('')}><section role="dialog" aria-modal="true" aria-labelledby="layout-heading" className="layout-dialog" onClick={e=>e.stopPropagation()}><div className="dialog-heading"><div><p className="eyebrow">A LITTLE HEAD START</p><h2 id="layout-heading">Start with a thoughtful layout.</h2></div><button className="square" aria-label="Close layouts" onClick={()=>setDialog('')}>×</button></div><p className="dialog-copy">Replace your draft blocks with a ready-made arrangement, then make it yours. Undo brings your previous layout back. Your live site stays unchanged.</p><div className="pattern-grid">{[{id:'essentials',name:'Shop essentials',text:'A focused store with hero, benefits, products and a clear call to action.',types:['hero','features','catalog','cta']},{id:'editorial',name:'The editorial',text:'Tell a richer story with images, collections and customer voices.',types:['hero','image_text','cards','gallery','catalog','testimonials']},{id:'service',name:'Local & personal',text:'Introduce your business, build trust and make it easy to get in touch.',types:['hero','features','image_text','testimonials','faq','contact']}].map(layout=><article key={layout.id}><div className={`pattern-preview pattern-${layout.id}`}><div className="mini-nav"/><div className="mini-hero"><i/><i/></div><div className="mini-cards"><i/><i/><i/></div><div className="mini-footer"/></div><h3>{layout.name}</h3><p>{layout.text}</p><span>{layout.types.length} editable blocks</span><button className="primary" onClick={()=>{const sections=pattern(layout.id,state.store);change({sections});choose(sections[0].id);setDialog('');}}>Use layout</button></article>)}</div></section></div>}
  </main>;
}

function Field({label,value,onChange,multiline=false,max=3000,type='text'}){return <label className="field">{label}{multiline?<textarea rows={5} maxLength={max} value={value || ''} onChange={e=>onChange(e.target.value)}/>:<input type={type} maxLength={max} value={value || ''} onChange={e=>onChange(e.target.value)}/>}</label>;}
function Select({label,value,options,onChange}){return <label className="field">{label}<select value={value} onChange={e=>onChange(e.target.value)}>{Object.entries(options).map(([v,label])=><option key={v} value={v}>{label}</option>)}</select></label>;}
function Check({label,value,onChange}){return <label className="check-field"><input type="checkbox" checked={Boolean(value)} onChange={e=>onChange(e.target.checked)}/><span>{label}</span></label>;}
function Color({label,value,onChange,clear}){return <label className="field">{label}<span className="color-field"><input aria-label={label} type="color" value={value} onChange={e=>onChange(e.target.value)}/><span>{value.toUpperCase()}</span>{clear && <button onClick={clear}>Reset</button>}</span></label>;}
function MediaField({value,onChange,alt,onAlt,upload,onError}){return <div className="media-field">{value?<img src={value} alt="Image preview"/>:<div className="media-empty">▧<span>Add an image to bring this block to life.</span></div>}<label className="upload-button">Upload image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={async e=>{const file=e.target.files?.[0];e.target.value='';if(file)try{onChange(await upload(file));}catch(e){onError(e.message);}}}/></label><Field label="Or image URL" value={value} max={2048} onChange={onChange}/>{onAlt && <Field label="Alternative text" value={alt} max={200} onChange={onAlt}/>}<p className="help">JPG, PNG or WebP · up to 5 MB. Describe images for screen readers.</p>{value && <button className="remove" onClick={()=>onChange('')}>Remove image</button>}</div>;}
function BlockFields({block,update,upload,onError}){
  const p=block.props,type=block.type;
  const heading=!['spacer','divider','image'].includes(type),text=!['spacer','divider','gallery','features','testimonials','faq'].includes(type);
  const hasImage=['hero','banner','image','image_text'].includes(type),hasButton=['hero','banner','image_text','cta'].includes(type);
  const itemType=['cards','gallery','features','testimonials','faq'].includes(type);
  return <>
    {(heading || text) && <div className="property-group">{heading && <><Field label="Eyebrow" value={p.eyebrow} max={80} onChange={eyebrow=>update({eyebrow})}/><Field label="Heading" value={p.heading} max={160} onChange={heading=>update({heading})}/></>}{text && <Field label={type==='image'?'Caption':'Body text'} value={p.text} multiline max={3000} onChange={text=>update({text})}/>}</div>}
    {hasImage && <details className="property-group" open><summary>Image</summary><MediaField value={p.image} alt={p.alt} onChange={image=>update({image})} onAlt={alt=>update({alt})} upload={upload} onError={onError}/>{['hero','image_text'].includes(type) && <Select label="Layout" value={p.layout || (type==='hero'?'split':'left')} options={type==='hero'?{split:'Image beside text',cover:'Image background',stack:'Image below text'}:{left:'Image on left',right:'Image on right'}} onChange={layout=>update({layout})}/>}</details>}
    {hasButton && <details className="property-group" open><summary>Call to action</summary><Field label="Button text" value={p.button} max={60} onChange={button=>update({button})}/><Field label="Button link" value={p.href} max={2048} onChange={href=>update({href})}/><p className="help">Leave the link empty to open your Fasta shop. Use a full https:// URL or a path starting with /.</p></details>}
    {type==='catalog' && <div className="property-group"><p className="help">Your active Fasta products appear automatically. Product names and images are managed in your seller dashboard.</p></div>}
    {type==='contact' && <div className="property-group"><Field label="Email" type="email" value={p.email} max={160} onChange={email=>update({email})}/><Field label="Phone" value={p.phone} max={60} onChange={phone=>update({phone})}/><Field label="Address" value={p.address} max={500} multiline onChange={address=>update({address})}/></div>}
    {type==='spacer' && <div className="property-group"><label className="field">Height · {p.height || 48} px<input aria-label="Spacer height" type="range" min="16" max="160" step="8" value={p.height || 48} onChange={e=>update({height:Number(e.target.value)})}/></label></div>}
    {itemType && <div className="property-group"><h3>{type==='faq'?'Questions':type==='testimonials'?'Customer stories':'Items'} · {(p.items || []).length}/16</h3>{(p.items || []).map((item,i)=>{
      const change=patch=>update({items:p.items.map((existing,n)=>n===i?{...existing,...patch}:existing)});
      return <details className="item-editor" key={i}><summary><span>{String(i+1).padStart(2,'0')}</span>{item.title || item.question || item.name || `Image ${i+1}`}</summary>
        {['cards','gallery'].includes(type) && <MediaField value={item.image} alt={item.alt} onChange={image=>change({image})} onAlt={alt=>change({alt})} upload={upload} onError={onError}/>}
        {type==='faq'?<><Field label="Question" value={item.question} max={180} onChange={question=>change({question})}/><Field label="Answer" value={item.answer} max={1500} multiline onChange={answer=>change({answer})}/></>:type==='testimonials'?<><Field label="Customer name" value={item.name} max={80} onChange={name=>change({name})}/><Field label="Customer role" value={item.role} max={100} onChange={role=>change({role})}/><Field label="Testimonial" value={item.quote} max={600} multiline onChange={quote=>change({quote})}/><Select label="Star rating" value={item.rating || 5} options={{1:'1 star',2:'2 stars',3:'3 stars',4:'4 stars',5:'5 stars'}} onChange={v=>change({rating:Number(v)})}/></>:<><Field label={type==='gallery'?'Caption':'Title'} value={item.title} max={120} onChange={title=>change({title})}/>{type!=='gallery' && <Field label="Description" value={item.text} max={600} multiline onChange={text=>change({text})}/>}</>}
        {type==='cards' && <><Field label="Link label" value={item.label} max={60} onChange={label=>change({label})}/><Field label="Link URL" value={item.href} max={2048} onChange={href=>change({href})}/></>}
        <div className="item-controls"><button disabled={i===0} onClick={()=>{const items=[...p.items];[items[i-1],items[i]]=[items[i],items[i-1]];update({items});}}>↑ Up</button><button disabled={i===p.items.length-1} onClick={()=>{const items=[...p.items];[items[i],items[i+1]]=[items[i+1],items[i]];update({items});}}>↓ Down</button><button className="danger" onClick={()=>update({items:p.items.filter((_,n)=>n!==i)})}>Remove</button></div>
      </details>;
    })}<button className="secondary full" disabled={(p.items || []).length>=16} onClick={()=>{const item=type==='faq'?{question:'A helpful question',answer:'Your answer here.'}:type==='testimonials'?{name:'Customer name',role:'',quote:'A genuine customer experience.',rating:5}:type==='features'?{title:'Another reason to choose us',text:'Explain the benefit.'}:{title:'New collection',text:'',image:'',alt:'',href:'',label:'Explore'};update({items:[...(p.items || []),item]});}}>＋ Add {type==='faq'?'question':type==='testimonials'?'testimonial':'item'}</button></div>}
  </>;
}
