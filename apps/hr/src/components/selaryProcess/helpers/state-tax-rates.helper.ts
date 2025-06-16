export interface TaxBracket {
  rate: number;
  single: number;
  married: number;
  max: number;
}

export interface StateTaxConfig {
  SIT: TaxBracket[]; // Empty array if no state income tax
  UI: {
    rateRange: [number, number];
    wageBase: number;
  };
}

export const stateTaxBrackets: Record<string, StateTaxConfig> = {
  Alabama: {
    SIT: [
      { rate: 0.02, single: 0, married: 0, max: 500 },
      { rate: 0.04, single: 501, married: 1001, max: 3000 },
      { rate: 0.05, single: 3001, married: 6001, max: Infinity },
    ],
    UI: {
      rateRange: [0.011, 0.068],
      wageBase: 8000,
    },
  },

  Alaska: {
    SIT: [],
    UI: {
      rateRange: [0.011, 0.034],
      wageBase: 43600,
    },
  },

  Arizona: {
    SIT: [
      { rate: 0.0259, single: 0, married: 0, max: 27272 },
      { rate: 0.0334, single: 27273, married: 54545, max: 54544 },
      { rate: 0.0417, single: 54545, married: 109089, max: 163635 },
      { rate: 0.045, single: 163636, married: 327271, max: Infinity },
    ],
    UI: {
      rateRange: [0.0005, 0.03],
      wageBase: 7000,
    },
  },

  Arkansas: {
    SIT: [
      { rate: 0.009, single: 0, married: 0, max: 4000 },
      { rate: 0.034, single: 4001, married: 8001, max: 8000 },
      { rate: 0.055, single: 8001, married: 16001, max: 75000 },
      { rate: 0.066, single: 75001, married: 150001, max: Infinity },
    ],
    UI: {
      rateRange: [0.005, 0.057],
      wageBase: 10000,
    },
  },

  California: {
    SIT: [
      { rate: 0.01, single: 0, married: 0, max: 9325 },
      { rate: 0.02, single: 9326, married: 18651, max: 22107 },
      { rate: 0.04, single: 22108, married: 44215, max: 34892 },
      { rate: 0.06, single: 34893, married: 69785, max: 48435 },
      { rate: 0.08, single: 48436, married: 96871, max: 61214 },
      { rate: 0.093, single: 61215, married: 122429, max: 312686 },
      { rate: 0.103, single: 312687, married: 625373, max: 375221 },
      { rate: 0.113, single: 375222, married: 750443, max: 625369 },
      { rate: 0.123, single: 625370, married: 1250738, max: Infinity },
    ],
    UI: {
      rateRange: [0.015, 0.062],
      wageBase: 7000,
    },
  },
};
