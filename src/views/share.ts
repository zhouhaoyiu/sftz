const waterTypeEnum: Record<string | number, any>[] = [
  // 1: '生活用水',
  // 2: '非居民',
  // 3: '特种用水',
  {
    label: "生活一",
    value: 0,
  },
  {
    label: "生活二",
    value: 1,
  },
  {
    label: "居民一",
    value: 2,
  },
  {
    label: "居民二",
    value: 3,
  },
  {
    label: "非居民一",
    value: 4,
  },
  {
    label: "非居民二",
    value: 5,
  },
  {
    label: "特种一",
    value: 6,
  },
  {
    label: "非居民四",
    value: 7,
  },
];

const waterTypeOptions = [
  {
    label: "生活一",
    value: "生活一",
  },
  {
    label: "生活二",
    value: "生活二",
  },
  {
    label: "居民一",
    value: "居民一",
  },
  {
    label: "居民二",
    value: "居民二",
  },
  {
    label: "非居民一",
    value: "非居民一",
  },
  {
    label: "非居民二",
    value: "非居民二",
  },
  {
    label: "特种一",
    value: "特种一",
  },
  {
    label: "非居民四",
    value: "非居民四",
  },
];

const mockGetUser = {
  userId: 1,
  userHh: "123456",
  jfyf: "2023-02",
  userName: "张三",
  userAddress: "北京市海淀区",
  currentNumber: 0,
  lastNumber: 123,
  latestPaymentDate: "2023-03-15",
  userPopulation: 3,
  userPhone: "12345678901",
  userWx: "zhangsan",
  waterClassification: [
    { waterType: "生活一", waterNumber: "0" },
    { waterType: "特种一", waterNumber: "50" },
  ],
};

const getWaterPriceUnitPrice = (
  waterType: string,
  waterNumber: number
  // population = 3
): number => {
  void waterNumber;
  switch (waterType) {
    case "生活一":
      return 2.4;
    case "生活二":
      return 2.4;
    case "居民一":
      return 2.3;
    case "居民二":
      return 2.3;
    case "非居民一":
      return 4;
    case "非居民二":
      return 4;
    case "特种一":
      return 48;
    case "非居民四":
      return 3.2;
    default:
      return 0;
  }
};

const getWaterBornePrice = (waterType: string): number => {
  switch (waterType) {
    case "生活一":
      return 0.95;
    case "生活二":
      return 0.5;
    case "居民一":
      return 0.95;
    case "居民二":
      return 0.5;
    case "非居民一":
      return 1.4;
    case "非居民二":
      return 1.4;
    case "特种一":
      return 1.4;
    case "非居民四":
      return 1.4;
    default:
      return 0;
  }
};

export {
  waterTypeEnum,
  mockGetUser,
  waterTypeOptions,
  getWaterPriceUnitPrice,
  getWaterBornePrice,
};
