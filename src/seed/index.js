import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/database.js';
import { Business } from '../modules/businesses/models/business.model.js';
import { Group } from '../modules/groups/models/group.model.js';
import { Post } from '../modules/posts/models/post.model.js';
import { User } from '../modules/users/models/user.model.js';

await connectDatabase();

await Promise.all([User.deleteMany({}), Business.deleteMany({}), Group.deleteMany({}), Post.deleteMany({})]);

const passwordHash = await bcrypt.hash('Password123!', 12);
const [ana, luis, maria] = await User.create([
  { name: 'Ana Rivera', username: 'ana', email: 'ana@oned.local', passwordHash, bio: 'Explorando negocios locales.', location: 'Santo Domingo' },
  { name: 'Luis Mercado', username: 'luis', email: 'luis@oned.local', passwordHash, bio: 'Café, tecnología y comunidad.', location: 'Santiago' },
  { name: 'María Gómez', username: 'maria', email: 'maria@oned.local', passwordHash, bio: 'Promociones y eventos del barrio.', location: 'Santo Domingo' },
]);

ana.following.push(luis._id, maria._id);
luis.followers.push(ana._id);
maria.followers.push(ana._id);
await Promise.all([ana.save(), luis.save(), maria.save()]);

const [coffeeShop, market] = await Business.create([
  { owner: luis._id, name: 'OneD Café', category: 'Cafetería', description: 'Café local y coworking.', location: 'Santo Domingo', phone: '809-555-0101', whatsapp: '809-555-0101' },
  { owner: maria._id, name: 'Mercado Verde', category: 'Supermercado', description: 'Productos frescos del día.', location: 'Santiago', phone: '809-555-0202', whatsapp: '809-555-0202' },
]);

const group = await Group.create({ owner: ana._id, name: 'Vecinos Zona Colonial', description: 'Noticias, recomendaciones y eventos.', scope: 'neighborhood', location: 'Zona Colonial', members: [ana._id, luis._id, maria._id] });

await Post.create([
  { author: ana._id, text: 'Bienvenidos a OneD Social 👋', type: 'user', score: 3, likes: [luis._id, maria._id] },
  { author: luis._id, business: coffeeShop._id, text: '2x1 en cappuccino hasta las 5pm.', type: 'promotion', score: 5, likes: [ana._id] },
  { author: maria._id, business: market._id, text: 'Llegaron frutas frescas para el fin de semana.', type: 'business', score: 2 },
  { author: ana._id, group: group._id, text: '¿Qué evento recomiendan esta semana en la zona?', type: 'group', score: 1 },
]);

console.log('Seed completed. Users: ana@oned.local, luis@oned.local, maria@oned.local / Password123!');
process.exit(0);
