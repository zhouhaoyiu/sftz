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

export { waterTypeEnum, mockGetUser };
