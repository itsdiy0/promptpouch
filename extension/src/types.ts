// src/types.ts
export interface Prompt {
    id: string;
    title: string;
    content: string;
}
  
export interface Prompts {
    prompts: Prompt[];
}