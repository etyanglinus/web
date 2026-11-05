export const config = { api: { bodyParser: false } };
export default async function media(req, res) {
  res.setHeader('Cache-Control','private, no-store');
  if(req.method!=='POST') {res.setHeader('Allow','POST');return res.status(405).json({message:'Method not allowed.'});}
  const origin=process.env.BRANDSITE_WEB_ORIGIN?.replace(/\/+$/,'');
  const base=process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/,'');
  if(!origin || !base)return res.status(503).json({message:'Image uploads are unavailable.'});
  const loopback=/^http:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/;
  const local=process.env.NODE_ENV==='development' && loopback.test(origin);
  if((!origin.startsWith('https://') && !local) || (req.headers.origin!==origin && !(local && loopback.test(req.headers.origin || '') && new URL(req.headers.origin).port===new URL(origin).port)))return res.status(403).json({message:'Invalid editor origin.'});
  const token=req.cookies.fasta_brandsite_editor;
  if(!/^[a-f0-9]{64}$/.test(token || ''))return res.status(401).json({message:'Open the editor from My BrandSite.'});
  if(!['image/jpeg','image/png','image/webp'].includes(req.headers['content-type']))return res.status(415).json({message:'Choose an image file.'});
  const chunks=[];let size=0;
  try {
    for await(const chunk of req) {
      size+=chunk.length;
      if(size>6*1024*1024)return res.status(413).json({message:'Choose an image smaller than 5 MB.'});
      chunks.push(chunk);
    }
    const response=await fetch(`${base}/api/v1/brandsite/editor/media`,{method:'POST',headers:{Accept:'application/json',Authorization:`Bearer ${token}`,'Content-Type':req.headers['content-type']},body:Buffer.concat(chunks),redirect:'error',signal:AbortSignal.timeout(30000)});
    if(response.status>=500)return res.status(502).json({message:'The image service is unavailable.'});
    const payload=await response.json();
    const result=response.ok && payload?.identical_code ? payload.content : payload;
    if(response.ok && result?.url && local) {
      const url=new URL(result.url);if(['localhost','127.0.0.1'].includes(url.hostname))url.hostname=new URL(req.headers.origin).hostname;result.url=url.href;
    }
    return res.status(response.status).json(result);
  } catch {return res.status(502).json({message:'Image upload failed. Please try again.'});}
}
