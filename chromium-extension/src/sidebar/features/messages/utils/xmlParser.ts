import { WorkflowData } from "../types/messages";

export const parseWorkflowXML = (xml: string): WorkflowData | undefined => {
  try {
    // Check if the input is XML or plain text
    if (!xml || !xml.trim().startsWith("<")) {
      // Plain text response - return it as an answer
      const trimmedText = xml?.trim();
      if (trimmedText) {
        return {
          name: "",
          thought: "",
          agents: [],
          answer: trimmedText
        };
      }
      return undefined;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");

    // Check for XML parsing errors
    const parserError = doc.querySelector("parsererror");
    if (parserError) {
      // If XML parsing failed, treat as plain text
      const trimmedText = xml.trim();
      return {
        name: "",
        thought: "",
        agents: [],
        answer: trimmedText
      };
    }

    const name = doc.querySelector("name")?.textContent || "";
    const thought = doc.querySelector("thought")?.textContent || "";
    const answer = doc.querySelector("answer")?.textContent || "";

    const agents: Array<{ name: string; task: string; nodes: string[] }> = [];
    doc.querySelectorAll("agent").forEach((agentNode) => {
      const agentName = agentNode.getAttribute("name") || "";
      const task = agentNode.querySelector("task")?.textContent || "";
      const nodes: string[] = [];

      agentNode.querySelectorAll("node").forEach((node) => {
        if (node.textContent) nodes.push(node.textContent);
      });

      agents.push({ name: agentName, task, nodes });
    });

    return { name, thought, agents, answer: answer || undefined };
  } catch (e) {
    console.error("Failed to parse XML", e);
    // On error, try to return the raw text as answer
    const trimmedText = xml?.trim();
    if (trimmedText) {
      return {
        name: "",
        thought: "",
        agents: [],
        answer: trimmedText
      };
    }
    return undefined;
  }
};
