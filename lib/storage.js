import {put,list,del} from '@vercel/blob';
export async function objects(prefix){let cursor,all=[];do{const page=await list({prefix,cursor});all.push(...page.blobs);cursor=page.hasMore?page.cursor:undefined}while(cursor);return all}
export async function read(obj){const response=await fetch(obj.url,{cache:'no-store'});if(!response.ok)throw Error('Could not read saved listing.');return response.json()}
export async function inventory(){const objs=await objects('listings/');const rows=await Promise.all(objs.map(async obj=>({obj,data:await read(obj)})));const unique=new Map();rows.forEach(row=>{const prior=unique.get(row.data.id);if(!prior||prior.data.updatedAt<row.data.updatedAt)unique.set(row.data.id,row)});return [...unique.values()].sort((a,b)=>b.data.createdAt.localeCompare(a.data.createdAt))}
export async function saveListing(data){const old=await objects('listings/'+data.id+'/');await put('listings/'+data.id+'/'+crypto.randomUUID()+'.json',JSON.stringify(data),{access:'public',addRandomSuffix:false,contentType:'application/json'});await Promise.allSettled(old.map(x=>del(x.url)))}
export async function eraseListing(id,attachments){await Promise.all((await objects('listings/'+id+'/')).map(x=>del(x.url)));await Promise.allSettled(attachments.map(x=>eraseAttachment(x.id)))}
export async function eraseAttachment(id){await Promise.all((await objects('attachments/'+id+'/')).map(x=>del(x.url)))}
export {put};
