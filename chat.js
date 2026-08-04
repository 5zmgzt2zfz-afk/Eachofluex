export async function onRequestPost({ request, env }) {
  const headers = {"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"content-type"};
  try {
    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
    const input = messages.map(m => ({role:m.role === "assistant" ? "assistant" : "user", content:String(m.text||"").slice(0,4000)})).filter(m=>m.content);
    if (!input.length) return new Response(JSON.stringify({error:"No command provided."}),{status:400,headers});
    if (!env.OPENAI_API_KEY) return new Response(JSON.stringify({error:"OPENAI_API_KEY is missing."}),{status:503,headers});
    const r = await fetch("https://api.openai.com/v1/responses",{
      method:"POST",
      headers:{"Authorization":`Bearer ${env.OPENAI_API_KEY}`,"Content-Type":"application/json"},
      body:JSON.stringify({
        model: env.OPENAI_MODEL || "gpt-5",
        instructions:"You are Eachoflux V2, a futuristic personal AI assistant. Speak naturally, be concise but useful, confident and friendly. You can help with ideas, explanations, planning, writing, coding, and general questions. Never claim to control devices or perform real-world actions unless a connected tool actually did so.",
        input
      })
    });
    const data=await r.json();
    if(!r.ok) return new Response(JSON.stringify({error:data?.error?.message||"AI request failed."}),{status:502,headers});
    const reply=data.output_text || data.output?.flatMap(x=>x.content||[]).find(x=>x.type==="output_text")?.text;
    if(!reply) return new Response(JSON.stringify({error:"No AI text returned."}),{status:502,headers});
    return new Response(JSON.stringify({reply}),{status:200,headers});
  } catch(e) { return new Response(JSON.stringify({error:e?.message||"Server error"}),{status:500,headers}); }
}
export async function onRequestOptions(){return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"content-type","Access-Control-Allow-Methods":"POST, OPTIONS"}})}