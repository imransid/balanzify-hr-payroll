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

  Colorado: {
    SIT: [{ rate: 0.044, single: 0, married: 0, max: Infinity }],
    UI: {
      rateRange: [0.017, 0.09],
      wageBase: 13600,
    },
  },

  Connecticut: {
    SIT: [
      { rate: 0.03, single: 0, married: 0, max: 10000 },
      { rate: 0.05, single: 10001, married: 20001, max: 50000 },
      { rate: 0.055, single: 50001, married: 100001, max: 100000 },
      { rate: 0.06, single: 100001, married: 200001, max: Infinity },
    ],
    UI: {
      rateRange: [0.019, 0.068],
      wageBase: 15000,
    },
  },

  Delaware: {
    SIT: [
      { rate: 0.022, single: 0, married: 0, max: 2000 },
      { rate: 0.039, single: 2001, married: 3001, max: 5000 },
      { rate: 0.048, single: 5001, married: 10001, max: 10000 },
      { rate: 0.052, single: 10001, married: 20001, max: 20000 },
      { rate: 0.0555, single: 20001, married: 30001, max: Infinity },
    ],
    UI: {
      rateRange: [0.003, 0.053],
      wageBase: 14000,
    },
  },

  Florida: {
    SIT: [],
    UI: {
      rateRange: [0.027, 0.054],
      wageBase: 7000,
    },
  },

  Georgia: {
    SIT: [
      { rate: 0.01, single: 0, married: 0, max: 750 },
      { rate: 0.02, single: 751, married: 1001, max: 2250 },
      { rate: 0.03, single: 2251, married: 3001, max: 3750 },
      { rate: 0.04, single: 3751, married: 5001, max: 5250 },
      { rate: 0.05, single: 5251, married: 7001, max: 7000 },
      { rate: 0.0575, single: 7001, married: 10001, max: Infinity },
    ],
    UI: {
      rateRange: [0.006, 0.054],
      wageBase: 9500,
    },
  },

  Hawaii: {
    SIT: [
      { rate: 0.014, single: 0, married: 0, max: 2400 },
      { rate: 0.032, single: 2401, married: 4801, max: 4800 },
      { rate: 0.055, single: 4801, married: 9601, max: 9600 },
      { rate: 0.064, single: 9601, married: 19201, max: 14400 },
      { rate: 0.068, single: 14401, married: 28801, max: 19600 },
      { rate: 0.072, single: 19601, married: 39201, max: Infinity },
    ],
    UI: {
      rateRange: [0.004, 0.054],
      wageBase: 45200,
    },
  },
  Idaho: {
    SIT: [
      { rate: 0.01, single: 0, married: 0, max: 1566 },
      { rate: 0.03, single: 1567, married: 3134, max: 3133 },
      { rate: 0.045, single: 3134, married: 6267, max: 4700 },
      { rate: 0.06, single: 4701, married: 9401, max: 5800 },
      { rate: 0.074, single: 5801, married: 11601, max: Infinity },
    ],
    UI: {
      rateRange: [0.011, 0.066],
      wageBase: 39000,
    },
  },

  Illinois: {
    SIT: [{ rate: 0.0495, single: 0, married: 0, max: Infinity }],
    UI: {
      rateRange: [0.03, 0.065],
      wageBase: 12960,
    },
  },

  Indiana: {
    SIT: [{ rate: 0.0323, single: 0, married: 0, max: Infinity }],
    UI: {
      rateRange: [0.014, 0.074],
      wageBase: 9500,
    },
  },

  Iowa: {
    SIT: [
      { rate: 0.0033, single: 0, married: 0, max: 1676 },
      { rate: 0.0067, single: 1677, married: 3353, max: 3352 },
      { rate: 0.0225, single: 3353, married: 6705, max: 6676 },
      { rate: 0.0414, single: 6677, married: 13353, max: 15501 },
      { rate: 0.0563, single: 15502, married: 31003, max: 25000 },
      { rate: 0.0612, single: 25001, married: 50001, max: 50000 },
      { rate: 0.0648, single: 50001, married: 100001, max: Infinity },
    ],
    UI: {
      rateRange: [0.004, 0.09],
      wageBase: 34800,
    },
  },

  Kansas: {
    SIT: [
      { rate: 0.031, single: 0, married: 0, max: 15000 },
      { rate: 0.0525, single: 15001, married: 30001, max: Infinity },
    ],
    UI: {
      rateRange: [0.001, 0.07],
      wageBase: 14000,
    },
  },

  Kentucky: {
    SIT: [{ rate: 0.05, single: 0, married: 0, max: Infinity }],
    UI: {
      rateRange: [0.003, 0.1],
      wageBase: 12200,
    },
  },

  Louisiana: {
    SIT: [
      { rate: 0.02, single: 0, married: 0, max: 12500 },
      { rate: 0.04, single: 12501, married: 25001, max: 50000 },
      { rate: 0.06, single: 50001, married: 100001, max: Infinity },
    ],
    UI: {
      rateRange: [0.003, 0.062],
      wageBase: 7700,
    },
  },

  Maine: {
    SIT: [
      { rate: 0.058, single: 0, married: 0, max: 22000 },
      { rate: 0.0675, single: 22001, married: 44001, max: 52000 },
      { rate: 0.0715, single: 52001, married: 104001, max: 200000 },
      { rate: 0.0795, single: 200001, married: 400001, max: Infinity },
    ],
    UI: {
      rateRange: [0.012, 0.025],
      wageBase: 12000,
    },
  },
  Maryland: {
    SIT: [
      { rate: 0.02, single: 0, married: 0, max: 1000 },
      { rate: 0.03, single: 1001, married: 1501, max: 2000 },
      { rate: 0.04, single: 2001, married: 3001, max: 3000 },
      { rate: 0.0475, single: 3001, married: 4001, max: 100000 },
      { rate: 0.05, single: 100001, married: 150001, max: 125000 },
      { rate: 0.0525, single: 125001, married: 175001, max: 150000 },
      { rate: 0.0575, single: 150001, married: 200001, max: Infinity },
    ],
    UI: {
      rateRange: [0.023, 0.075],
      wageBase: 8500,
    },
  },

  Massachusetts: {
    SIT: [{ rate: 0.05, single: 0, married: 0, max: Infinity }],
    UI: {
      rateRange: [0.012, 0.06],
      wageBase: 15000,
    },
  },

  Michigan: {
    SIT: [{ rate: 0.0425, single: 0, married: 0, max: Infinity }],
    UI: {
      rateRange: [0.01, 0.103],
      wageBase: 9500,
    },
  },

  Minnesota: {
    SIT: [
      { rate: 0.0535, single: 0, married: 0, max: 27230 },
      { rate: 0.068, single: 27231, married: 41321, max: 88880 },
      { rate: 0.0785, single: 88881, married: 177761, max: 164400 },
      { rate: 0.0985, single: 164401, married: 328801, max: Infinity },
    ],
    UI: {
      rateRange: [0.006, 0.09],
      wageBase: 36000,
    },
  },

  Mississippi: {
    SIT: [
      { rate: 0.03, single: 0, married: 0, max: 5000 },
      { rate: 0.04, single: 5001, married: 10001, max: 10000 },
      { rate: 0.05, single: 10001, married: 20001, max: Infinity },
    ],
    UI: {
      rateRange: [0.002, 0.054],
      wageBase: 14000,
    },
  },

  Missouri: {
    SIT: [
      { rate: 0.015, single: 0, married: 0, max: 1000 },
      { rate: 0.02, single: 1001, married: 2001, max: 2000 },
      { rate: 0.025, single: 2001, married: 4001, max: 3000 },
      { rate: 0.03, single: 3001, married: 6001, max: 4000 },
      { rate: 0.035, single: 4001, married: 8001, max: 5000 },
      { rate: 0.04, single: 5001, married: 10001, max: 6000 },
      { rate: 0.054, single: 6001, married: 12001, max: Infinity },
    ],
    UI: {
      rateRange: [0.006, 0.063],
      wageBase: 11000,
    },
  },

  Nebraska: {
    SIT: [
      { rate: 0.0246, single: 0, married: 0, max: 3290 },
      { rate: 0.0351, single: 3291, married: 6581, max: 19370 },
      { rate: 0.0501, single: 19371, married: 38741, max: 29540 },
      { rate: 0.0684, single: 29541, married: 59081, max: 44820 },
      { rate: 0.0684, single: 44821, married: 89641, max: Infinity },
    ],
    UI: {
      rateRange: [0.005, 0.054],
      wageBase: 9000,
    },
  },

  Nevada: {
    SIT: [],
    UI: {
      rateRange: [0.0025, 0.054],
      wageBase: 33400,
    },
  },

  NewHampshire: {
    SIT: [
      { rate: 0.05, single: 0, married: 0, max: Infinity }, // Only on interest/dividends
    ],
    UI: {
      rateRange: [0.015, 0.025],
      wageBase: 14000,
    },
  },

  NewJersey: {
    SIT: [
      { rate: 0.014, single: 0, married: 0, max: 20000 },
      { rate: 0.0175, single: 20001, married: 40001, max: 35000 },
      { rate: 0.035, single: 35001, married: 70001, max: 40000 },
      { rate: 0.0553, single: 40001, married: 80001, max: 75000 },
      { rate: 0.0637, single: 75001, married: 150001, max: 500000 },
      { rate: 0.0897, single: 500001, married: 1000001, max: Infinity },
    ],
    UI: {
      rateRange: [0.003, 0.054],
      wageBase: 36200,
    },
  },
  NewMexico: {
    SIT: [
      { rate: 0.017, single: 0, married: 0, max: 5500 },
      { rate: 0.032, single: 5501, married: 8001, max: 11000 },
      { rate: 0.047, single: 11001, married: 16001, max: 16000 },
      { rate: 0.06, single: 16001, married: 24001, max: 21000 },
      { rate: 0.069, single: 21001, married: 33001, max: Infinity },
    ],
    UI: {
      rateRange: [0.014, 0.054],
      wageBase: 24800,
    },
  },
  NewYork: {
    SIT: [
      { rate: 0.04, single: 0, married: 0, max: 8500 },
      { rate: 0.045, single: 8501, married: 17151, max: 11700 },
      { rate: 0.0525, single: 11701, married: 23601, max: 13900 },
      { rate: 0.059, single: 13901, married: 27801, max: 21400 },
      { rate: 0.0609, single: 21401, married: 43001, max: 80650 },
      { rate: 0.0641, single: 80651, married: 161551, max: 215400 },
      { rate: 0.0685, single: 215401, married: 323801, max: 1077550 },
      { rate: 0.0882, single: 1077551, married: 2155101, max: Infinity },
    ],
    UI: {
      rateRange: [0.015, 0.07],
      wageBase: 12300,
    },
  },

  NorthCarolina: {
    SIT: [{ rate: 0.0525, single: 0, married: 0, max: Infinity }],
    UI: {
      rateRange: [0.0006, 0.06],
      wageBase: 25000,
    },
  },

  NorthDakota: {
    SIT: [
      { rate: 0.011, single: 0, married: 0, max: 41775 },
      { rate: 0.0204, single: 41776, married: 83551, max: 83550 },
      { rate: 0.0227, single: 83551, married: 167101, max: 166100 },
      { rate: 0.0264, single: 166101, married: 332201, max: Infinity },
    ],
    UI: {
      rateRange: [0.01, 0.09],
      wageBase: 37000,
    },
  },

  Ohio: {
    SIT: [
      { rate: 0.005, single: 0, married: 0, max: 22150 },
      { rate: 0.01, single: 22151, married: 44301, max: 44300 },
      { rate: 0.02, single: 44301, married: 88601, max: 88600 },
      { rate: 0.03, single: 88601, married: 177201, max: 131500 },
      { rate: 0.04, single: 131501, married: 263001, max: 179000 },
      { rate: 0.045, single: 179001, married: 358001, max: 220000 },
      { rate: 0.05, single: 220001, married: 440001, max: 250000 },
      { rate: 0.055, single: 250001, married: 500001, max: Infinity },
    ],
    UI: {
      rateRange: [0.005, 0.09],
      wageBase: 9000,
    },
  },

  Oklahoma: {
    SIT: [
      { rate: 0.005, single: 0, married: 0, max: 1000 },
      { rate: 0.01, single: 1001, married: 2001, max: 2500 },
      { rate: 0.02, single: 2501, married: 5001, max: 3750 },
      { rate: 0.03, single: 3751, married: 7501, max: 4900 },
      { rate: 0.04, single: 4901, married: 9801, max: 7100 },
      { rate: 0.05, single: 7101, married: 14201, max: 8800 },
      { rate: 0.055, single: 8801, married: 17601, max: Infinity },
    ],
    UI: {
      rateRange: [0.003, 0.055],
      wageBase: 19700,
    },
  },

  Oregon: {
    SIT: [
      { rate: 0.0475, single: 0, married: 0, max: 3650 },
      { rate: 0.0675, single: 3651, married: 7301, max: 9200 },
      { rate: 0.0875, single: 9201, married: 18401, max: 125000 },
      { rate: 0.099, single: 125001, married: 250001, max: Infinity },
    ],
    UI: {
      rateRange: [0.009, 0.054],
      wageBase: 47400,
    },
  },

  Pennsylvania: {
    SIT: [{ rate: 0.0307, single: 0, married: 0, max: Infinity }],
    UI: {
      rateRange: [0.027, 0.077],
      wageBase: 10000,
    },
  },

  RhodeIsland: {
    SIT: [
      { rate: 0.0375, single: 0, married: 0, max: 66200 },
      { rate: 0.0475, single: 66201, married: 132401, max: 151500 },
      { rate: 0.0599, single: 151501, married: 303001, max: Infinity },
    ],
    UI: {
      rateRange: [0.012, 0.06],
      wageBase: 24400,
    },
  },

  SouthCarolina: {
    SIT: [
      { rate: 0.0, single: 0, married: 0, max: 3070 },
      { rate: 0.03, single: 3071, married: 6141, max: 6150 },
      { rate: 0.04, single: 6151, married: 12301, max: 9230 },
      { rate: 0.05, single: 9231, married: 18461, max: 12310 },
      { rate: 0.06, single: 12311, married: 24621, max: 15390 },
      { rate: 0.07, single: 15391, married: 30781, max: Infinity },
    ],
    UI: {
      rateRange: [0.0006, 0.054],
      wageBase: 14000,
    },
  },

  SouthDakota: {
    SIT: [],
    UI: {
      rateRange: [0.012, 0.06],
      wageBase: 15000,
    },
  },

  Tennessee: {
    SIT: [],
    UI: {
      rateRange: [0.01, 0.1],
      wageBase: 7000,
    },
  },

  Texas: {
    SIT: [],
    UI: {
      rateRange: [0.0031, 0.064],
      wageBase: 9000,
    },
  },

  Utah: {
    SIT: [{ rate: 0.0485, single: 0, married: 0, max: Infinity }],
    UI: {
      rateRange: [0.003, 0.084],
      wageBase: 37300,
    },
  },

  Vermont: {
    SIT: [
      { rate: 0.0335, single: 0, married: 0, max: 40350 },
      { rate: 0.068, single: 40351, married: 67351, max: 97750 },
      { rate: 0.078, single: 97751, married: 163751, max: 204800 },
      { rate: 0.0875, single: 204801, married: 409601, max: Infinity },
    ],
    UI: {
      rateRange: [0.01, 0.06],
      wageBase: 14000,
    },
  },

  Virginia: {
    SIT: [
      { rate: 0.02, single: 0, married: 0, max: 3000 },
      { rate: 0.03, single: 3001, married: 6001, max: 5000 },
      { rate: 0.05, single: 5001, married: 8001, max: 17000 },
      { rate: 0.0575, single: 17001, married: 34001, max: Infinity },
    ],
    UI: {
      rateRange: [0.006, 0.06],
      wageBase: 8000,
    },
  },

  Washington: {
    SIT: [],
    UI: {
      rateRange: [0.001, 0.06],
      wageBase: 56500,
    },
  },

  WestVirginia: {
    SIT: [
      { rate: 0.03, single: 0, married: 0, max: 10000 },
      { rate: 0.04, single: 10001, married: 20001, max: 25000 },
      { rate: 0.045, single: 25001, married: 50001, max: 40000 },
      { rate: 0.06, single: 40001, married: 80001, max: 60000 },
      { rate: 0.065, single: 60001, married: 120001, max: 100000 },
      { rate: 0.0675, single: 100001, married: 200001, max: Infinity },
    ],
    UI: {
      rateRange: [0.005, 0.06],
      wageBase: 12000,
    },
  },

  Wisconsin: {
    SIT: [
      { rate: 0.0354, single: 0, married: 0, max: 11950 },
      { rate: 0.0465, single: 11951, married: 23901, max: 23930 },
      { rate: 0.0627, single: 23931, married: 47861, max: 263480 },
      { rate: 0.0765, single: 263481, married: 526961, max: Infinity },
    ],
    UI: {
      rateRange: [0.006, 0.096],
      wageBase: 14000,
    },
  },

  Wyoming: {
    SIT: [],
    UI: {
      rateRange: [0.006, 0.054],
      wageBase: 30600,
    },
  },

  WashingtonDC: {
    SIT: [
      { rate: 0.04, single: 0, married: 0, max: 10000 },
      { rate: 0.06, single: 10001, married: 20001, max: 40000 },
      { rate: 0.085, single: 40001, married: 80001, max: 60000 },
      { rate: 0.0875, single: 60001, married: 120001, max: 350000 },
      { rate: 0.0925, single: 350001, married: 700001, max: 1000000 },
      { rate: 0.1075, single: 1000001, married: 1000001, max: Infinity },
    ],
    UI: {
      rateRange: [0.01, 0.06],
      wageBase: 9000,
    },
  },
};
