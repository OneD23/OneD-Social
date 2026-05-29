import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/database.js';
import { Business } from '../modules/businesses/models/business.model.js';
import { Community } from '../modules/communities/models/community.model.js';
import { Event } from '../modules/events/models/event.model.js';
import { Group } from '../modules/groups/models/group.model.js';
import { Job } from '../modules/jobs/models/job.model.js';
import { MarketplaceCategory } from '../modules/marketplace/models/marketplaceCategory.model.js';
import { MarketplaceItem } from '../modules/marketplace/models/marketplaceItem.model.js';
import { Post } from '../modules/posts/models/post.model.js';
import { Story } from '../modules/stories/models/story.model.js';
import { User } from '../modules/users/models/user.model.js';

await connectDatabase();

await Promise.all([
  User.deleteMany({}), Business.deleteMany({}), Group.deleteMany({}), Post.deleteMany({}), Story.deleteMany({}),
  MarketplaceCategory.deleteMany({}), MarketplaceItem.deleteMany({}), Job.deleteMany({}), Event.deleteMany({}), Community.deleteMany({}),
]);

const passwordHash = await bcrypt.hash('Password123!', 12);
const [ana, luis, maria] = await User.create([
  { name: 'Ana Rivera', username: 'ana', email: 'ana@oned.local', passwordHash, bio: 'Explorando negocios locales.', location: 'Santo Domingo', role: 'admin', verified: true, verifiedAt: new Date() },
  { name: 'Luis Mercado', username: 'luis', email: 'luis@oned.local', passwordHash, bio: 'Café, tecnología y comunidad.', location: 'Santiago', verified: true, verifiedAt: new Date() },
  { name: 'María Gómez', username: 'maria', email: 'maria@oned.local', passwordHash, bio: 'Promociones y eventos del barrio.', location: 'San Francisco de Macorís' },
]);

ana.following.push(luis._id, maria._id);
luis.followers.push(ana._id);
maria.followers.push(ana._id);
await Promise.all([ana.save(), luis.save(), maria.save()]);

const [coffeeShop, market] = await Business.create([
  { owner: luis._id, name: 'OneD Café', category: 'Cafetería', description: 'Café local y coworking.', location: 'Santo Domingo', phone: '809-555-0101', whatsapp: '809-555-0101', verified: true, verifiedAt: new Date(), verifiedBy: ana._id },
  { owner: maria._id, name: 'Mercado Verde', category: 'Supermercado', description: 'Productos frescos del día.', location: 'San Francisco de Macorís', phone: '809-555-0202', whatsapp: '809-555-0202' },
]);

const [castillo, villaRiva] = await Community.create([
  { name: 'Castillo', slug: 'castillo', description: 'Comunidad local de Castillo.', location: 'Duarte', featuredBusinesses: [market._id], moderators: [ana._id] },
  { name: 'Villa Riva', slug: 'villa-riva', description: 'Noticias y comercio local de Villa Riva.', location: 'Duarte', featuredBusinesses: [coffeeShop._id], moderators: [ana._id] },
]);

const group = await Group.create({ owner: ana._id, name: 'Vecinos Zona Colonial', description: 'Noticias, recomendaciones y eventos.', scope: 'neighborhood', location: 'Zona Colonial', members: [ana._id, luis._id, maria._id] });

await Post.create([
  { author: ana._id, text: 'Bienvenidos a OneD Social 👋', type: 'user', score: 3, likes: [luis._id, maria._id], sharesCount: 1 },
  { author: luis._id, business: coffeeShop._id, text: '2x1 en cappuccino hasta las 5pm.', type: 'promotion', score: 5, likes: [ana._id] },
  { author: maria._id, business: market._id, text: 'Llegaron frutas frescas para el fin de semana.', type: 'business', score: 2 },
  { author: ana._id, group: group._id, text: '¿Qué evento recomiendan esta semana en la zona?', type: 'group', score: 1 },
]);

await Story.create([
  { author: ana._id, mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg', caption: 'Atardecer en la comunidad', expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
  { author: luis._id, mediaType: 'video', mediaUrl: 'https://res.cloudinary.com/demo/video/upload/dog.mp4', caption: 'Preparando café', expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
]);

const [food, electronics] = await MarketplaceCategory.create([
  { name: 'Alimentos', slug: 'alimentos' },
  { name: 'Electrónica', slug: 'electronica' },
]);
await MarketplaceItem.create([
  { seller: maria._id, title: 'Canasta de frutas locales', description: 'Frutas frescas de productores cercanos.', category: food._id, photos: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'], price: { amount: 850, currency: 'DOP' }, location: 'San Francisco de Macorís', contact: { whatsapp: '809-555-0202' } },
  { seller: luis._id, title: 'Router WiFi usado', description: 'En buen estado.', category: electronics._id, photos: [], price: { amount: 1200, currency: 'DOP' }, location: 'Santo Domingo', contact: { phone: '809-555-0101' } },
]);

await Job.create([
  { owner: luis._id, business: coffeeShop._id, title: 'Barista medio tiempo', description: 'Buscamos barista con experiencia básica.', location: 'Santo Domingo', salary: 'RD$18,000 mensual', contactEmail: 'jobs@onedcafe.local' },
  { owner: maria._id, business: market._id, title: 'Cajero/a', description: 'Turno vespertino para supermercado local.', location: 'San Francisco de Macorís', salary: 'A discutir' },
]);

await Event.create([
  { owner: ana._id, community: castillo._id, title: 'Feria comunitaria de Castillo', description: 'Negocios, música y comida local.', startsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), location: 'Parque Central de Castillo' },
  { owner: luis._id, business: coffeeShop._id, community: villaRiva._id, title: 'Cata de café local', description: 'Degustación gratuita para clientes.', startsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), location: 'OneD Café' },
]);

console.log('Seed completed. Users: ana@oned.local, luis@oned.local, maria@oned.local / Password123!');
process.exit(0);
