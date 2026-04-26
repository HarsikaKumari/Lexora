// utils/prisma.js - CommonJS version (require/export)
const { PrismaClient } = require('@prisma/client');

// Global instance to prevent too many connections in development
const globalForPrisma = global;

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = globalForPrisma.prisma;
}

// Test connection
prisma.$connect()
  .then(() => console.log('✅ Prisma connected to database'))
  .catch((err) => console.error('❌ Prisma connection error:', err));

module.exports = { prisma };
