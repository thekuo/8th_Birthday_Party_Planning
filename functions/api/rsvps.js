// functions/api/rsvps.js

// GET request: Fetch the RSVP state from KV
export async function onRequestGet(context) {
  try {
    const data = await context.env.PARTY_STATE.get("rsvps");
    return new Response(data || "[]", {
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

// POST request: Save the RSVP state to KV
export async function onRequestPost(context) {
  try {
    const data = await context.request.text();
    // Validate JSON before saving
    JSON.parse(data);
    await context.env.PARTY_STATE.put("rsvps", data);
    return new Response(JSON.stringify({ success: true }), { 
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
