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
}

export const tools: Tool[] = toolsData;

export const getToolByKey = (key: string): Tool | undefined => {
  return tools.find((tool) => tool.key === key);
};

export const getToolByPath = (path: string): Tool | undefined => {
  return tools.find((tool) => tool.path === path);
};

export default tools;
