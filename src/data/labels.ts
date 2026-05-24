const SALE_LABEL_COLOR = '#e44542';

interface ISaleLabel {
  color: string;
  text: string;
}

interface ILabel {
  color: string;
}

const LABELS = {
  instock: {
    color: '#76BC21',
  },
  'order-korea': {
    color: '#F5A623',
  },
  'pre-order': {
    color: '#9B59B6',
  },
  set: {
    color: '#2E86C1',
  },
};

export class Labels {
  static getSaleLabel(percent: number): ISaleLabel {
    return {
      color: SALE_LABEL_COLOR,
      text: `${percent}%`,
    };
  }

  static getLabelColor(permalink: string): ILabel | null {
    const label = LABELS[permalink];

    return label ? label : null;
  }
}
