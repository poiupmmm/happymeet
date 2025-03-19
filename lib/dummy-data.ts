// 模拟用户数据
export const users = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
];

// 模拟活动数据
export const events = [
  {
    id: '1',
    title: '周末爬山活动',
    description: '一起去爬山，呼吸新鲜空气，欣赏美丽风景。',
    startTime: '2023-09-30T08:00:00',
    endTime: '2023-09-30T17:00:00',
    location: '黄山',
    latitude: 30.1299,
    longitude: 118.1651,
    maxMembers: 20,
    price: 0,
    creatorId: '1',
    groupId: '1',
  },
  {
    id: '2',
    title: '读书分享会',
    description: '分享你最近读过的好书，交流读书心得。',
    startTime: '2023-10-05T19:00:00',
    endTime: '2023-10-05T21:00:00',
    location: '线上',
    latitude: 0,
    longitude: 0,
    maxMembers: 50,
    price: 0,
    creatorId: '2',
    groupId: '2',
  },
];

// 模拟群组数据
export const groups = [
  {
    id: '1',
    name: '户外探险俱乐部',
    description: '喜欢户外活动、探险和挑战的朋友们聚集地',
    category: '户外',
    location: '北京',
    latitude: 39.9042,
    longitude: 116.4074,
    creatorId: '1',
  },
  {
    id: '2',
    name: '读书会',
    description: '每周一起阅读和讨论好书',
    category: '教育',
    location: '上海',
    latitude: 31.2304,
    longitude: 121.4737,
    creatorId: '2',
  },
]; 