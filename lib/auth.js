import {createHmac,createHash,timingSafeEqual} from 'node:crypto';
const digest=s=>createHash('sha256').update(s).digest();
export const configured=()=>!!process.env.ADMIN_PASSWORD&&process.env.SESSION_SECRET?.length>=32;
export function passwordMatches(value){return configured()&&timingSafeEqual(digest(String(value)),digest(process.env.ADMIN_PASSWORD))}
export function sessionToken(now=Date.now()){const expiry=String(now+8*60*60*1000);return expiry+'.'+createHmac('sha256',process.env.SESSION_SECRET).update(expiry).digest('hex')}
export function authorized(request,now=Date.now()){if(!configured())return false;const cookie=(request.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('mikazuki_admin='));if(!cookie)return false;const [expiry,sig]=cookie.slice(15).split('.');if(!/^\d+$/.test(expiry)||!sig||Number(expiry)<=now||Number(expiry)>now+8*60*60*1000)return false;const expected=createHmac('sha256',process.env.SESSION_SECRET).update(expiry).digest('hex');return sig.length===expected.length&&timingSafeEqual(Buffer.from(sig),Buffer.from(expected))}
export function sameOrigin(request){return request.headers.get('origin')===new URL(request.url).origin}
export const cookie=value=>'mikazuki_admin='+value+'; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age='+(value?'28800':'0');
export const json=(value,status=200,headers={})=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store',...headers}});
