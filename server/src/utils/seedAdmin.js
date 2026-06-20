import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import initFirebaseAdmin, { getFirebaseAuth } from '../config/firebaseAdmin.js';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Nestify Admin';

  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  await connectDB();
  initFirebaseAdmin();

  const auth = getFirebaseAuth();
  let firebaseUid = null;

  if (auth) {
    try {
      const existingFirebaseUser = await auth.getUserByEmail(email);
      firebaseUid = existingFirebaseUser.uid;
      console.log('Firebase admin user already exists');
    } catch {
      const created = await auth.createUser({
        email,
        password,
        displayName: name,
        emailVerified: true,
      });
      firebaseUid = created.uid;
      console.log('Firebase admin user created');
    }
  } else {
    console.warn('Firebase Admin not configured — seeding MongoDB admin only');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await User.findOne({ email: email.toLowerCase() });

  if (existing) {
    existing.role = 'admin';
    existing.name = name;
    existing.passwordHash = passwordHash;
    if (firebaseUid) existing.firebaseUid = firebaseUid;
    existing.authProvider = firebaseUid ? 'both' : 'email';
    await existing.save();
    console.log('Admin user updated in MongoDB');
  } else {
    await User.create({
      firebaseUid,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'admin',
      authProvider: firebaseUid ? 'both' : 'email',
    });
    console.log('Admin user created in MongoDB');
  }

  console.log(`Admin seed complete: ${email}`);
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error('Admin seed failed:', err.message);
  process.exit(1);
});
