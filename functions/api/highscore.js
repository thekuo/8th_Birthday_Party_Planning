// functions/api/highscore.js

// GET request: Fetch the global balloon high score from KV
export async function onRequestGet(context) {
  try {
    const data = await context.env.PARTY_STATE.get("highscore");
    return new Response(data || '{"score":0,"name":""}', {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// POST request: Save a new high score to KV (validates server-side)
export async function onRequestPost(context) {
  try {
    const bodyText = await context.request.text();
    const newHS = JSON.parse(bodyText);
    
    // Fetch current high score from KV to validate
    const currentDataStr = await context.env.PARTY_STATE.get("highscore");
    const currentHS = currentDataStr ? JSON.parse(currentDataStr) : { score: 0, name: "" };

    // Validate and save if strictly greater
    if (typeof newHS.score === "number" && newHS.score > currentHS.score) {
      const sanitizedName = String(newHS.name || "Player").trim().substring(0, 15);
      const updatedData = JSON.stringify({ score: newHS.score, name: sanitizedName });
      await context.env.PARTY_STATE.put("highscore", updatedData);
      
      return new Response(JSON.stringify({ success: true, updated: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: true, updated: false, reason: "Score not higher" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}
