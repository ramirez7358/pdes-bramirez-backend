import { User } from '../../auth/entities';
import { ValidRoles } from '../../auth/interfaces';
import { Bookmark } from '../../bookmark/entities';
import { Purchase } from '../../purchase/entities';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

export const users = [
  {
    id: uuidv4(),
    email: 'user@example.com',
    password: bcrypt.hashSync('Password123', 10),
    fullName: 'Test user',
    isActive: true,
    roles: [ValidRoles.admin],
  },
  {
    id: uuidv4(),
    email: 'user1@example.com',
    password: bcrypt.hashSync('password1', 10),
    fullName: 'User One',
    isActive: true,
    roles: [ValidRoles.buyer],
  },
  {
    id: uuidv4(),
    email: 'user2@example.com',
    password: bcrypt.hashSync('password2', 10),
    fullName: 'User Two',
    isActive: true,
    roles: [ValidRoles.buyer],
  },
  {
    id: uuidv4(),
    email: 'user3@example.com',
    password: bcrypt.hashSync('password3', 10),
    fullName: 'User Three',
    isActive: true,
    roles: [ValidRoles.buyer],
  },
  {
    id: uuidv4(),
    email: 'user4@example.com',
    password: bcrypt.hashSync('password4', 10),
    fullName: 'User Four',
    isActive: true,
    roles: [ValidRoles.buyer],
  },
  {
    id: uuidv4(),
    email: 'user5@example.com',
    password: bcrypt.hashSync('password5', 10),
    fullName: 'User Five',
    isActive: true,
    roles: [ValidRoles.buyer],
  },
  {
    id: uuidv4(),
    email: 'user6@example.com',
    password: bcrypt.hashSync('password6', 10),
    fullName: 'User Six',
    isActive: true,
    roles: [ValidRoles.buyer],
  },
  {
    id: uuidv4(),
    email: 'user7@example.com',
    password: bcrypt.hashSync('password7', 10),
    fullName: 'User Seven',
    isActive: true,
    roles: [ValidRoles.buyer],
  },
  {
    id: uuidv4(),
    email: 'user8@example.com',
    password: bcrypt.hashSync('password8', 10),
    fullName: 'User Eight',
    isActive: true,
    roles: [ValidRoles.buyer],
  },
  {
    id: uuidv4(),
    email: 'user9@example.com',
    password: bcrypt.hashSync('password9', 10),
    fullName: 'User Nine',
    isActive: true,
    roles: [ValidRoles.buyer],
  },
  {
    id: uuidv4(),
    email: 'user10@example.com',
    password: bcrypt.hashSync('password10', 10),
    fullName: 'User Ten',
    isActive: true,
    roles: [ValidRoles.admin],
  },
];

export const bookmarks = (user: User, meliProductIds: string[]): Bookmark[] => {
  const bookmarks = meliProductIds.map((meliProductId) => {
    const bookmark = new Bookmark();
    bookmark.user = user;
    bookmark.meliProductId = meliProductId;
    bookmark.name = `Bookmark for ${meliProductId}`; // Generar un nombre
    bookmark.comment = `This is a comment for product ${meliProductId}`; // Generar un comentario
    bookmark.score = Math.floor(Math.random() * 10) + 1; // Generar un puntaje aleatorio entre 1 y 10

    return bookmark;
  });

  return bookmarks;
};

export const purchases = (user: User, meliProductIds: string[]): Purchase[] => {
  const purchases = meliProductIds.map((meliProductId) => {
    const purchase = new Purchase();
    purchase.user = user;
    purchase.meliId = meliProductId;
    purchase.name = `Purchase for ${meliProductId}`; // Generar un nombre
    purchase.price = parseFloat((Math.random() * 100).toFixed(2)); // Generar un precio aleatorio entre 0 y 100 con dos decimales
    purchase.count = Math.floor(Math.random() * 10) + 1; // Generar una cantidad aleatoria entre 1 y 10
    purchase.created_at = new Date(); // Fecha de creación actual
    purchase.updated_at = new Date(); // Fecha de actualización actual

    return purchase;
  });

  return purchases;
};
