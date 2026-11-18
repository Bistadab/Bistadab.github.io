(()=>{'use strict';
const ENDPOINT='https://dabit-research-ai.bistadabitraj.workers.dev/chat';
const launch=document.createElement('button');
launch.id='research-ai-launch';launch.type='button';launch.textContent='✦ Ask Research AI';launch.setAttribute('aria-expanded','false');launch.setAttribute('aria-controls','research-ai-panel');
const panel=document.createElement('section');panel.id='research-ai-panel';panel.hidden=true;panel.setAttribute('aria-label','Research AI assistant');
panel.innerHTML='<header><strong>Ask Research AI</strong><button type="button" aria-label="Close chatbot">×</button></header><div id="research-ai-messages" role="log" aria-live="polite"></div><form id="research-ai-form"><input id="research-ai-input" aria-label="Your question" maxlength="500" placeholder="Ask about research or publications…" required><button type="submit">Send</button></form><footer>AI-generated answers may be imperfect. Verify findings in <a href="#publications">original publications</a>.</footer>';
document.body.append(launch,panel);
const messages=panel.querySelector('#research-ai-messages'),form=panel.querySelector('form'),input=panel.querySelector('input'),send=form.querySelector('button'),close=panel.querySelector('header button');const history=[];
function show(open){panel.hidden=!open;launch.setAttribute('aria-expanded',String(open));if(open)input.focus();else launch.focus();}
launch.addEventListener('click',()=>show(panel.hidden));close.addEventListener('click',()=>show(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)show(false);});
function add(text,user=false){const el=document.createElement('div');el.className='ai-msg'+(user?' ai-user':'');el.textContent=text;messages.append(el);messages.scrollTop=messages.scrollHeight;return el;}
add('Hello! Ask me about Dabit Bista’s research, publications, or academic background.');
form.addEventListener('submit',async e=>{e.preventDefault();const question=input.value.trim();if(!question)return;input.value='';add(question,true);send.disabled=true;const pending=add('Thinking…');
try{const response=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:question,history:history.slice(-6)})});const data=await response.json();if(!response.ok)throw new Error(data.error||'Service unavailable');pending.textContent=data.answer||'No answer available.';
if(Array.isArray(data.sources)){const links=document.createElement('div');links.className='ai-sources';for(const source of data.sources){if(typeof source.url!=='string'||!source.url.startsWith('https://'))continue;const a=document.createElement('a');a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=source.title||'Source';links.append(a);}pending.append(links);}
history.push({role:'user',content:question},{role:'assistant',content:data.answer||''});}
catch(err){pending.textContent='Sorry, the assistant is temporarily unavailable. Please try again later.';console.error('Research AI:',err);}
finally{send.disabled=false;messages.scrollTop=messages.scrollHeight;}});
})();
