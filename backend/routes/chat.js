// routes/chat.js
const express = require('express');
const { authenticate } = require('../middleware/auth');
const { prisma } = require('../utils/prisma');
const router = express.Router();

// Get all conversations for a user
router.get('/conversations', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`📞 Fetching conversations for user: ${userId}`);

        // Simplified query - agar raw query problem kar rahi hai toh yeh use kar
        try {
            // Try raw query first
            const conversations = await prisma.$queryRaw`
                SELECT DISTINCT 
                    CASE 
                        WHEN cm.from_user_id = ${userId} THEN cm.to_user_id
                        ELSE cm.from_user_id
                    END as other_user_id,
                    u.name as other_user_name,
                    u.role as other_user_role,
                    (SELECT message FROM chat_messages 
                     WHERE (from_user_id = ${userId} AND to_user_id = other_user_id)
                        OR (from_user_id = other_user_id AND to_user_id = ${userId})
                     ORDER BY created_at DESC LIMIT 1) as last_message,
                    (SELECT created_at FROM chat_messages 
                     WHERE (from_user_id = ${userId} AND to_user_id = other_user_id)
                        OR (from_user_id = other_user_id AND to_user_id = ${userId})
                     ORDER BY created_at DESC LIMIT 1) as last_message_time,
                    (SELECT COUNT(*) FROM chat_messages 
                     WHERE from_user_id = other_user_id 
                       AND to_user_id = ${userId} 
                       AND is_read = false) as unread_count
                FROM chat_messages cm
                JOIN users u ON u.id = (
                    CASE 
                        WHEN cm.from_user_id = ${userId} THEN cm.to_user_id
                        ELSE cm.from_user_id
                    END
                )
                WHERE cm.from_user_id = ${userId} OR cm.to_user_id = ${userId}
                GROUP BY other_user_id, u.name, u.role
                ORDER BY last_message_time DESC
            `;

            console.log(`✅ Found ${conversations.length} conversations`);
            res.json(conversations);
        } catch (queryError) {
            console.error('Raw query failed, using fallback:', queryError.message);

            // Fallback: Get unique users from messages
            const sentTo = await prisma.chatMessage.findMany({
                where: { from_user_id: userId },
                select: { to_user_id: true },
                distinct: ['to_user_id']
            });

            const receivedFrom = await prisma.chatMessage.findMany({
                where: { to_user_id: userId },
                select: { from_user_id: true },
                distinct: ['from_user_id']
            });

            const uniqueUserIds = new Set();
            sentTo.forEach(s => uniqueUserIds.add(s.to_user_id));
            receivedFrom.forEach(r => uniqueUserIds.add(r.from_user_id));

            const conversations = [];
            for (const otherId of uniqueUserIds) {
                const otherUser = await prisma.user.findUnique({
                    where: { id: otherId },
                    select: { id: true, name: true, role: true }
                });

                if (otherUser) {
                    const lastMessage = await prisma.chatMessage.findFirst({
                        where: {
                            OR: [
                                { from_user_id: userId, to_user_id: otherId },
                                { from_user_id: otherId, to_user_id: userId }
                            ]
                        },
                        orderBy: { created_at: 'desc' }
                    });

                    const unreadCount = await prisma.chatMessage.count({
                        where: {
                            from_user_id: otherId,
                            to_user_id: userId,
                            is_read: false
                        }
                    });

                    conversations.push({
                        other_user_id: otherUser.id,
                        other_user_name: otherUser.name,
                        other_user_role: otherUser.role,
                        last_message: lastMessage?.message || null,
                        last_message_time: lastMessage?.created_at || null,
                        unread_count: unreadCount
                    });
                }
            }

            console.log(`✅ Found ${conversations.length} conversations (fallback)`);
            res.json(conversations);
        }
    } catch (err) {
        console.error('❌ Error in /conversations:', err);
        res.status(500).json({ error: 'Failed to fetch conversations', details: err.message });
    }
});

// Get messages between two users
router.get('/messages/:otherUserId', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const otherUserId = parseInt(req.params.otherUserId);

        console.log(`📨 Fetching messages between ${userId} and ${otherUserId}`);

        // Validate otherUserId
        if (isNaN(otherUserId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Check if other user exists
        const otherUserExists = await prisma.user.findUnique({
            where: { id: otherUserId }
        });

        if (!otherUserExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const messages = await prisma.chatMessage.findMany({
            where: {
                OR: [
                    { from_user_id: userId, to_user_id: otherUserId },
                    { from_user_id: otherUserId, to_user_id: userId },
                ],
            },
            include: {
                from_user: {
                    select: { id: true, name: true, role: true },
                },
                to_user: {
                    select: { id: true, name: true, role: true },
                },
            },
            orderBy: { created_at: 'asc' },
        });

        console.log(`✅ Found ${messages.length} messages`);

        // Mark messages as read (only if there are unread messages)
        const unreadCount = await prisma.chatMessage.count({
            where: {
                from_user_id: otherUserId,
                to_user_id: userId,
                is_read: false,
            },
        });

        if (unreadCount > 0) {
            await prisma.chatMessage.updateMany({
                where: {
                    from_user_id: otherUserId,
                    to_user_id: userId,
                    is_read: false,
                },
                data: { is_read: true },
            });
            console.log(`✅ Marked ${unreadCount} messages as read`);
        }

        res.json(messages);
    } catch (err) {
        console.error('❌ Error in /messages/:otherUserId:', err);
        res.status(500).json({ error: 'Failed to fetch messages', details: err.message });
    }
});


// Get unread count for current user
router.get('/unread-count', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`🔔 Getting unread count for user: ${userId}`);

        const count = await prisma.chatMessage.count({
            where: {
                to_user_id: userId,
                is_read: false,
            },
        });

        console.log(`📬 Unread count: ${count}`);
        res.json({ unreadCount: count });
    } catch (err) {
        console.error('❌ Error in /unread-count:', err);
        res.status(500).json({ error: 'Failed to get unread count', details: err.message });
    }
});

// Get all users (for testing/selecting chat partner)
router.get('/users', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const users = await prisma.user.findMany({
            where: {
                id: { not: userId } // Exclude current user
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                is_verified: true,
            }
        });

        console.log(`👥 Found ${users.length} other users`);
        res.json(users);
    } catch (err) {
        console.error('❌ Error in /users:', err);
        res.status(500).json({ error: 'Failed to fetch users', details: err.message });
    }
});

// Send a test message (for debugging)
router.post('/test-message', authenticate, async (req, res) => {
    try {
        const { toUserId, message } = req.body;
        const fromUserId = req.user.id;

        if (!toUserId || !message) {
            return res.status(400).json({ error: 'Missing toUserId or message' });
        }

        const savedMessage = await prisma.chatMessage.create({
            data: {
                from_user_id: fromUserId,
                to_user_id: parseInt(toUserId),
                message: message,
                is_read: false,
            },
            include: {
                from_user: {
                    select: { id: true, name: true, role: true }
                }
            }
        });

        console.log(`✅ Test message sent from ${fromUserId} to ${toUserId}`);
        res.json({ success: true, message: savedMessage });
    } catch (err) {
        console.error('❌ Error in test-message:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
