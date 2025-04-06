export interface FieldInterface {
  type: string;
  options?: string[];
}

export interface Field {
  value: string;
  title: string;
  interface: FieldInterface;
  key: string;
  required: boolean;
  defaultValue: string;
  defaultOptions: string[];
  hidden: boolean;
  placeholder: string;
  disabled: boolean;
  tooltip: string;
  colSpan: string;
  source?: {
    channel: string;
    system?: {
      id: string;
    };
    human?: {
      id: string;
      name: string;
      email: string;
    };
    timestamp: string;
  };
}

export interface Section {
  order: number;
  layout: string;
  title: string;
  tooltip?: string;
  bgColor: string;
  fields: {
    [key: string]: Field;
  };
  stats: {
    total: number;
    filled: number;
  };
}

export interface FormData {
  sections: {
    [key: string]: Section;
  };
}
