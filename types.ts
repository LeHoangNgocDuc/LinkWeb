
export enum Category {
  WORK = 'Công việc',
  AN_PHUC = 'Trung tâm An Phúc',
  TOOLS = 'Công cụ Web',
  AI = 'Công cụ AI'
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  category: Category;
  createdAt: number;
}

export type LinkFormData = Omit<LinkItem, 'id' | 'createdAt'>;
