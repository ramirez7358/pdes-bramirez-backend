import { ValidRoles } from 'src/auth/interfaces';
import { v4 as uuidv4 } from 'uuid';

export const users = [
  {
    id: uuidv4(),
    email: 'user@example.com',
    password: 'Password123',
    fullName: 'Test user',
    isActive: true,
    roles: [ValidRoles.admin],
  },
  {
    id: uuidv4(),
    email: 'user1@example.com',
    password: 'password1',
    fullName: 'User One',
    isActive: true,
    roles: [ValidRoles.buyer],
  },
  {
    id: uuidv4(),
    email: 'user2@example.com',
    password: 'password2',
    fullName: 'User Two',
    isActive: true,
    roles: [ValidRoles.buyer],
  },
  {
    id: uuidv4(),
    email: 'user3@example.com',
    password: 'password3',
    fullName: 'User Three',
    isActive: true,
    roles: [ValidRoles.buyer],
  },
  {
    id: uuidv4(),
    email: 'user4@example.com',
    password: 'password4',
    fullName: 'User Four',
    isActive: true,
    roles: [ValidRoles.buyer],
  },
  {
    id: uuidv4(),
    email: 'user5@example.com',
    password: 'password5',
    fullName: 'User Five',
    isActive: true,
    roles: [ValidRoles.buyer],
  },
  {
    id: uuidv4(),
    email: 'user6@example.com',
    password: 'password6',
    fullName: 'User Six',
    isActive: true,
    roles: [ValidRoles.buyer],
  },
  {
    id: uuidv4(),
    email: 'user7@example.com',
    password: 'password7',
    fullName: 'User Seven',
    isActive: true,
    roles: [ValidRoles.buyer],
  },
  {
    id: uuidv4(),
    email: 'user8@example.com',
    password: 'password8',
    fullName: 'User Eight',
    isActive: true,
    roles: [ValidRoles.buyer],
  },
  {
    id: uuidv4(),
    email: 'user9@example.com',
    password: 'password9',
    fullName: 'User Nine',
    isActive: true,
    roles: [ValidRoles.buyer],
  },
  {
    id: uuidv4(),
    email: 'user10@example.com',
    password: 'password10',
    fullName: 'User Ten',
    isActive: true,
    roles: [ValidRoles.admin],
  },
];

const meliIds = [
  'MLA1417118195',
  'MLA1642598964',
  'MLA1127952638',
  'MLA1423270801',
  'MLA1757174910',
];

function getRandomMeliIds(count: number): string[] {
  const shuffled = meliIds.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Crear bookmarks asegurando que cada usuario tenga solo 3 meliIds únicos
export const bookmarks = [];
for (const user of users) {
  const userMeliIds = getRandomMeliIds(3);
  for (const meliId of userMeliIds) {
    bookmarks.push({
      user: { id: user.id },
      name: `Bookmark for ${meliId}`,
      meliProductId: meliId,
      comment: `Comment for bookmark ${meliId}`,
      score: Math.floor(1 + Math.random() * 10),
    });
  }
}
