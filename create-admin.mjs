import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@healthcaresystem.com';
    const adminPassword = 'Admin@123'; // Please change this password after first login
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    try {
        const admin = await prisma.user.upsert({
            where: { email: adminEmail },
            update: {},
            create: {
                email: adminEmail,
                password: hashedPassword,
                name: 'System Administrator',
                role: 'ADMIN',
            },
        });

        console.log('Admin account created successfully:');
        console.log(`Email: ${admin.email}`);
        console.log('Password: Admin@123');
        console.log('\nPlease change the password after first login!');
    } catch (error) {
        console.error('Error creating admin account:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
