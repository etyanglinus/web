export const BLOCKS = {
  hero: { label: 'Hero', group: 'Commerce', icon: '▣', description: 'A strong introduction with imagery and a call to action.' },
  catalog: { label: 'Product catalog', group: 'Commerce', icon: '▦', description: 'Live products from your Fasta store.' },
  banner: { label: 'Promotion banner', group: 'Commerce', icon: '▰', description: 'Announce a launch, offer or seasonal collection.' },
  heading: { label: 'Heading', group: 'Content', icon: 'H', description: 'Introduce a new part of your page.' },
  text: { label: 'Text', group: 'Content', icon: '¶', description: 'Tell your story in your own words.' },
  image: { label: 'Image', group: 'Media', icon: '▧', description: 'A photograph with an optional caption.' },
  image_text: { label: 'Image & text', group: 'Media', icon: '◧', description: 'Pair a photograph with your story.' },
  cards: { label: 'Image cards', group: 'Media', icon: '▤', description: 'Showcase collections, categories or services.' },
  gallery: { label: 'Gallery', group: 'Media', icon: '▥', description: 'An inviting grid of photographs.' },
  features: { label: 'Benefits', group: 'Content', icon: '✧', description: 'Explain what makes shopping with you special.' },
  testimonials: { label: 'Testimonials', group: 'Content', icon: '❝', description: 'Share genuine customer feedback.' },
  faq: { label: 'Frequently asked questions', group: 'Content', icon: '?', description: 'Answer the questions your customers ask.' },
  cta: { label: 'Call to action', group: 'Commerce', icon: '↗', description: 'Give customers a clear next step.' },
  contact: { label: 'Contact details', group: 'Content', icon: '✉', description: 'Help customers get in touch or find your shop.' },
  spacer: { label: 'Spacer', group: 'Layout', icon: '↕', description: 'Create a little breathing room.' },
  divider: { label: 'Divider', group: 'Layout', icon: '—', description: 'Separate sections with a subtle line.' },
};
export const FONT_OPTIONS = {system:'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', editorial:'Georgia, "Times New Roman", serif', rounded:'"Trebuchet MS", sans-serif'};
export const uid = () => `b-${globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)}`;
export function newBlock(type, store = {}) {
  const props = {align:'left',spacing:'normal',columns:3};
  const defaults = {
    hero:{eyebrow:'WELCOME TO OUR STORE',heading:store.name || 'Good things, closer to you.',text:'Discover your new favourites. Carefully selected, ready when you are.',image:store.cover || '',alt:'',button:'Explore the collection',href:'',layout:'split'},
    catalog:{eyebrow:'CURATED FOR YOU',heading:'Shop our favourites',text:'Explore what is available from our store.'},
    banner:{eyebrow:'SOMETHING SPECIAL',heading:'Meet your next favourite.',text:'A collection worth making room for.',button:'Shop now',href:'',background:'#e7f4eb',layout:'cover'},
    heading:{eyebrow:'OUR COLLECTION',heading:'A little inspiration.',text:'Discover something that feels like you.'},
    text:{heading:'Our story',text:'Every great store starts with a simple idea. Share yours here.'},
    image:{image:'',alt:'',text:'A moment from our collection.'},
    image_text:{eyebrow:'THOUGHTFULLY CHOSEN',heading:'Made for your everyday.',text:'Tell customers what matters to your brand, and why you love what you do.',image:store.cover || '',alt:'',layout:'left',button:'Discover more',href:''},
    cards:{heading:'Find your favourites',text:'Explore our collections.',items:[{title:'The everyday edit',text:'Good things for your daily routine.',image:'',alt:'',href:'',label:'Explore'},{title:'Something new',text:'Discover your next favourite.',image:'',alt:'',href:'',label:'Explore'},{title:'Handpicked for you',text:'A collection with a little extra care.',image:'',alt:'',href:'',label:'Explore'}]},
    gallery:{heading:'A closer look',items:[{image:'',alt:'',title:''},{image:'',alt:'',title:''},{image:'',alt:'',title:''}]},
    features:{heading:'A better way to shop',items:[{title:'Carefully selected',text:'Products we are proud to put our name behind.'},{title:'Local, personal service',text:'A real team that cares about your experience.'},{title:'Easy ordering',text:'Browse our collection and order through Fasta.'}]},
    testimonials:{heading:'Words from our customers',items:[{name:'Customer name',role:'Verified customer',quote:'Add a genuine customer testimonial here.',rating:5}]},
    faq:{heading:'A few helpful answers',items:[{question:'How do I place an order?',answer:'Browse our catalog and use Shop on Fasta to complete your order.'},{question:'Where do you deliver?',answer:'Delivery availability is confirmed during checkout.'}]},
    cta:{eyebrow:'READY WHEN YOU ARE',heading:'Your next favourite is waiting.',text:'Explore the collection and place your order.',button:'Shop on Fasta',href:'',align:'center',background:'#073e2d',color:'#ffffff'},
    contact:{heading:'Let’s stay in touch.',text:'Questions about a product? Our team is here to help.',email:'',phone:'',address:''},
    spacer:{height:48},divider:{},
  };
  return {id:uid(),type,name:BLOCKS[type].label,props:{...props,...defaults[type]}};
}
export function normalizeTheme(theme, store = {}) {
  if (theme.version === 2) return {...theme,settings:{font:'system',width:'wide',radius:'soft',background:'#ffffff',navigation:true,footer:'',...theme.settings},seo:{title:'',description:'',indexable:false,...theme.seo}};
  return {version:2,title:theme.title || store.name || 'My store',description:theme.description || '',accent:theme.accent || '#039D55',motion:theme.motion || 'none',settings:{font:'system',width:'wide',radius:'soft',background:'#ffffff',navigation:true,footer:''},seo:{title:'',description:'',indexable:false},sections:(theme.sections || ['hero','catalog']).map((type)=>{
    const block=newBlock(type,store);block.id=type;
    if(type==='hero')block.props={...block.props,heading:theme.title || store.name || '',text:theme.description || '',image:store.cover || ''};
    return block;
  })};
}
export function pattern(name, store) {
  const types={essentials:['hero','features','catalog','cta'],editorial:['hero','image_text','cards','gallery','catalog','testimonials'],service:['hero','features','image_text','testimonials','faq','contact']}[name];
  return types.map(type=>newBlock(type,store));
}
