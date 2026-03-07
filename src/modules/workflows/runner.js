import fetch from "node-fetch";

const API_BASE = process.env.API_BASE || "https://axiom-backend-1.onrender.com";

export async function runWorkflow(fastify, workflowId, input){

  const steps = await fastify.pg.query(
    "SELECT * FROM workflow_steps WHERE workflow_id=$1 ORDER BY step_order",
    [workflowId]
  );

  let currentInput = input;

  for(const step of steps.rows){

    const tool = await fastify.pg.query(
      "SELECT * FROM ai_tools WHERE id=$1",
      [step.tool_id]
    );

    const template = tool.rows[0].prompt_template;

    const prompt = template.replace("{input}", currentInput);

    const response = await fetch(`${API_BASE}/api/ai/generate`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({prompt})
    });

    const data = await response.json();

    currentInput = data.content || currentInput;
  }

  return currentInput;

}
