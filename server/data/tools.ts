import toolsData from "./tools.json";

export interface Tool {
  key: string;
  category: string;
  path: string;
  famous: boolean;
  badges: Array<{
    type: string;
    color: string;
    label: string;
  }>;
  keywords: string[];
  adSlot?: string;
}

export const tools: Tool[] = toolsData;

export const getToolByKey = (key: string): Tool | null => {
  return tools.find((tool) => tool.key === key) || null;
};

export default tools;
