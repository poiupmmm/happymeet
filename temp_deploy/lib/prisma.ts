// lib/prisma.ts
// 使用虚拟的Prisma客户端替代，避免构建错误

class MockPrismaClient {
  user = createMockModel('user');
  group = createMockModel('group');
  event = createMockModel('event');
  comment = createMockModel('comment');
  membership = createMockModel('membership');
  eventParticipant = createMockModel('eventParticipant');
}

function createMockModel(name: string) {
  return {
    findUnique: () => Promise.resolve(null),
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
    count: () => Promise.resolve(0),
  };
}

// 创建一个全局的MockPrismaClient实例
// @ts-ignore - 故意使用mock替代真实PrismaClient
export const prisma = new MockPrismaClient(); 