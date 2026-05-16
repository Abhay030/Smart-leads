import { User } from '../models/User';
import { Lead } from '../models/Lead';
import bcrypt from 'bcryptjs';

const DEMO_EMAIL = 'demo@servicehive.com';

const firstNames = ['James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'Lucas', 'Isabella', 'Mateo', 'Mia', 'Oliver', 'Charlotte', 'Elijah', 'Amelia', 'Benjamin', 'Harper', 'Evelyn', 'Alexander'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

const statuses = ['New', 'Contacted', 'Qualified', 'Lost'];
const sources = ['Website', 'Instagram', 'Referral'];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(arr: T[]): T {
  return arr[getRandomInt(0, arr.length - 1)];
}

function generateDemoLeads(ownerId: string, count: number) {
  const leads = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    
    // Create dates scattered over the last 30 days
    const createdDate = new Date(now.getTime() - getRandomInt(0, 30) * 24 * 60 * 60 * 1000 - getRandomInt(0, 24) * 60 * 60 * 1000);
    
    leads.push({
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${getRandomInt(1, 99)}@example.com`,
      status: getRandomItem(statuses),
      source: getRandomItem(sources),
      owner: ownerId,
      createdAt: createdDate,
      updatedAt: createdDate,
    });
  }
  return leads;
}

export async function seedDemoWorkspace() {
  try {
    console.log('[Seed] Checking Demo User...');
    
    let demoUser = await User.findOne({ email: DEMO_EMAIL });
    
    if (!demoUser) {
      const hashedPassword = await bcrypt.hash('DemoPassword123!', 10);
      demoUser = await User.create({
        name: 'Demo Admin',
        email: DEMO_EMAIL,
        password: hashedPassword,
        role: 'admin',
      });
      console.log('[Seed] Created Demo User.');
    }

    // Always refresh demo data
    console.log('[Seed] Refreshing demo workspace data...');
    
    await Lead.deleteMany({ owner: demoUser._id });
    
    const leadsToInsert = generateDemoLeads(demoUser._id.toString(), 35);
    await Lead.insertMany(leadsToInsert);
    
    console.log('[Seed] Successfully seeded 35 demo leads.');
  } catch (err) {
    console.error('[Seed] Error seeding demo workspace:', err);
  }
}
