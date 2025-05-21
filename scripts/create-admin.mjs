import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const adminData = {
        name: 'admin',
        email: 'admin@gmail.com',
        password: 'Admin_21',
        role: 'ADMIN'
    };

    const hashedPassword = await bcryptjs.hash(adminData.password, 10);

    try {
        const admin = await prisma.user.upsert({
            where: { email: adminData.email },
            update: {
                name: adminData.name,
                password: hashedPassword,
                role: 'ADMIN'
            },
            create: {
                email: adminData.email,
                name: adminData.name,
                password: hashedPassword,
                role: 'ADMIN',
            },
        });

        console.log('Admin account created successfully:');
        console.log(`Username: ${admin.name}`);
        console.log(`Email: ${admin.email}`);
        console.log(`Password: ${adminData.password}`);
        console.log('\nYou can now login with these credentials.');
    } catch (error) {
        console.error('Error creating admin account:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
