import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'apple_office_super_secret_key_2026';

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});
const upload = multer({ storage });

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Main loader for Frontend (Simulator uses this instantly)
app.get('/api/data', async (req, res) => {
    try {
        const [
            configs, models, capacities, batteries, colors, accessories,
            iphoneStock, tradeInPrices, cards, plans, gallery, storeGallery
        ] = await Promise.all([
            prisma.config.findMany(),
            prisma.baseModel.findMany(),
            prisma.baseCapacity.findMany(),
            prisma.baseBattery.findMany(),
            prisma.baseColor.findMany(),
            prisma.accessory.findMany(),
            prisma.iphoneStock.findMany(),
            prisma.tradeInPrice.findMany(),
            prisma.financingCard.findMany(),
            prisma.financingPlan.findMany(),
            prisma.clientGallery.findMany({ orderBy: { created_at: 'desc' } }),
            prisma.storeGallery.findMany({ orderBy: { created_at: 'desc' } })
        ]);

        const dollarValConfig = configs.find(c => c.key === 'dollar_value');
        const dollar_value = dollarValConfig ? Number(dollarValConfig.value) : 1000;

        const featureCardsConfig = configs.find(c => c.key === 'feature_cards');
        const defaultFeatureCards = [
            { icon: 'Package', title: 'Equipos Nuevos', desc: 'Sellados en caja, directo de fábrica. Con la seguridad de un unpacked genuino.' },
            { icon: 'ShieldCheck', title: 'Garantía Oficial', desc: 'Dormí tranquilo. Tenés 12 meses de garantía directa de Apple internacional.' },
            { icon: 'RefreshCw', title: 'Plan Canje', desc: 'Dejá tu equipo actual como parte de pago. Lo cotizamos al mejor valor del mercado.' },
            { icon: 'MessageCircleHeart', title: 'Atención Premium', desc: 'Te guiamos y migramos tus datos mientras disfrutás del ambiente.' }
        ];
        const feature_cards = featureCardsConfig ? JSON.parse(featureCardsConfig.value) : defaultFeatureCards;

        res.json({
            config: { dollar_value },
            feature_cards,
            models: models.map((m: any) => m.name),
            capacities: capacities.map((c: any) => c.size),
            batteries: batteries.map((b: any) => b.status),
            colors: colors.map((c: any) => c.name),
            accessories,
            iphoneStock,
            tradeInPrices,
            cards,
            plans,
            gallery,
            storeGallery
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed fetching data' });
    }
});


// Authentication Middleware
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = typeof authHeader === 'string' ? authHeader.split(' ')[1] : undefined;

    if (!token) {
        res.status(401).json({ error: 'Acceso Denegado' });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
            res.status(403).json({ error: 'Token Inválido' });
            return;
        }
        (req as any).user = user;
        next();
    });
};

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, username: user.username });
    } catch (e) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// User Management Endpoints
app.get('/api/users', authenticateToken, async (req, res) => {
    try {
        const users = await prisma.user.findMany({ select: { id: true, username: true } });
        res.json(users);
    } catch (e) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

app.post('/api/users', authenticateToken, async (req, res) => {
    const { username, password } = req.body;
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { username, password: passwordHash }
        });
        res.json({ id: newUser.id, username: newUser.username });
    } catch (e) {
        res.status(400).json({ error: 'El usuario ya existe o hubo un error' });
    }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.user.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

// Update Config
app.post('/api/config', authenticateToken, async (req, res) => {
    const { dollar_value } = req.body;
    await prisma.config.upsert({
        where: { key: 'dollar_value' },
        update: { value: String(dollar_value) },
        create: { key: 'dollar_value', value: String(dollar_value) }
    });
    res.json({ success: true });
});

// Save feature cards
app.post('/api/feature-cards', authenticateToken, async (req, res) => {
    const { feature_cards } = req.body;
    try {
        await prisma.config.upsert({
            where: { key: 'feature_cards' },
            update: { value: JSON.stringify(feature_cards) },
            create: { key: 'feature_cards', value: JSON.stringify(feature_cards) }
        });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Error saving feature cards' });
    }
});

// Base Entities Add
app.post('/api/base/:entity', authenticateToken, async (req, res) => {
    const { entity } = req.params;
    const { value } = req.body;

    try {
        if (entity === 'model') await prisma.baseModel.create({ data: { name: value } });
        if (entity === 'capacity') await prisma.baseCapacity.create({ data: { size: Number(value) } });
        if (entity === 'battery') await prisma.baseBattery.create({ data: { status: value } });
        if (entity === 'color') await prisma.baseColor.create({ data: { name: value } });
        res.json({ success: true });
    } catch (e) {
        res.status(400).json({ error: 'Could not create or already exists' });
    }
});

// Base Entities Delete
app.delete('/api/base/:entity', authenticateToken, async (req, res) => {
    const { entity } = req.params;
    const { value } = req.body;
    try {
        if (entity === 'model') await prisma.baseModel.delete({ where: { name: value } });
        if (entity === 'capacity') await prisma.baseCapacity.delete({ where: { size: Number(value) } });
        if (entity === 'battery') await prisma.baseBattery.delete({ where: { status: value } });
        if (entity === 'color') await prisma.baseColor.delete({ where: { name: value } });
        res.json({ success: true });
    } catch (e) {
        res.status(400).json({ error: 'Failed deletion' });
    }
});

// Accessories CRUD
app.post('/api/accessories', authenticateToken, async (req, res) => {
    await prisma.accessory.create({ data: req.body });
    res.json({ success: true });
});
app.delete('/api/accessories/:id', authenticateToken, async (req, res) => {
    await prisma.accessory.delete({ where: { id: req.params.id } });
    res.json({ success: true });
});

// Stock CRUD
app.post('/api/stock', authenticateToken, async (req, res) => {
    await prisma.iphoneStock.create({ data: req.body });
    res.json({ success: true });
});
app.delete('/api/stock/:id', authenticateToken, async (req, res) => {
    await prisma.iphoneStock.delete({ where: { id: req.params.id } });
    res.json({ success: true });
});

// Trade-In CRUD
app.post('/api/tradein', authenticateToken, async (req, res) => {
    await prisma.tradeInPrice.create({ data: req.body });
    res.json({ success: true });
});
app.delete('/api/tradein/:id', authenticateToken, async (req, res) => {
    await prisma.tradeInPrice.delete({ where: { id: req.params.id } });
    res.json({ success: true });
});

// Financing Options
app.post('/api/cards', authenticateToken, async (req, res) => {
    await prisma.financingCard.create({ data: req.body });
    res.json({ success: true });
});
app.delete('/api/cards/:id', authenticateToken, async (req, res) => {
    await prisma.financingCard.delete({ where: { card_name: req.params.id } });
    res.json({ success: true });
});

app.post('/api/plans', authenticateToken, async (req, res) => {
    await prisma.financingPlan.create({ data: req.body });
    res.json({ success: true });
});
app.delete('/api/plans/:id', authenticateToken, async (req, res) => {
    await prisma.financingPlan.delete({ where: { id: req.params.id } });
    res.json({ success: true });
});

// Gallery CRUD
app.get('/api/gallery', async (req, res) => {
    const gallery = await prisma.clientGallery.findMany({ orderBy: { created_at: 'desc' } });
    res.json(gallery);
});

app.post('/api/gallery', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { description } = req.body;
        if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

        const imageUrl = `/uploads/${req.file.filename}`;
        const newEntry = await prisma.clientGallery.create({
            data: {
                image_url: imageUrl,
                description
            }
        });
        res.json(newEntry);
    } catch (e) {
        res.status(500).json({ error: 'Failed to upload' });
    }
});

app.put('/api/gallery/:id', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const existing = await prisma.clientGallery.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Not found' });

        let imageUrl = existing.image_url;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const updated = await prisma.clientGallery.update({
            where: { id },
            data: { image_url: imageUrl, description }
        });
        res.json(updated);
    } catch (e) {
        res.status(500).json({ error: 'Failed to update' });
    }
});

app.delete('/api/gallery/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.clientGallery.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed' });
    }
});

// Store Gallery CRUD
app.post('/api/store-gallery', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { description } = req.body;
        if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
        const imageUrl = `/uploads/${req.file.filename}`;
        const newEntry = await prisma.storeGallery.create({
            data: { image_url: imageUrl, description }
        });
        res.json(newEntry);
    } catch (e) {
        res.status(500).json({ error: 'Failed to upload store image' });
    }
});

app.delete('/api/store-gallery/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.storeGallery.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend Server running intensely on http://localhost:${PORT}`);
});
