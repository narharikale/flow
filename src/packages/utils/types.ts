type source = {
  channel: string;
  timestamp: string;

  [key: string]: string | { [key: string]: string };
};

export type Field = {
  value: string;
  title: string;
  interface: {
    type: string;
    options?: string[];
  };
  key: string;
  required: boolean;
  defaultValue: string;
  defaultOptions: string[];
  hidden: boolean;
  placeholder: string;
  disabled: boolean;
  tooltip: string;
  colSpan: string;
  source?: source;
};

type Fields = {
  [key: string]: Field;
};

export type Data = {
  sections: {
    [key: string]: {
      order: number;
      layout: string;
      title: string;
      tooltip: string;
      bgColor: string;

      fields: Fields;
      stats: {
        total: number;
        filled: number;
      };
    };
  };
};
