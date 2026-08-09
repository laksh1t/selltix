require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pinoHttp = require('pino-http');
const { logger } = require('./utils/logger');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();
app.set('trust proxy', true);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

const authRoutes = require('./routes/auth.routes');
const orgRoutes = require('./routes/organization.routes');
const eventRoutes = require('./routes/event.routes');
const ticketTypeRoutes = require('./routes/ticketType.routes');
const bookingRoutes = require('./routes/booking.routes');
const ticketRoutes = require('./routes/ticket.routes');

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/organizations', orgRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/events/:eventId/ticket-types', ticketTypeRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/tickets', ticketRoutes);

app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'connected',
    version: '1.0.0',
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;

app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'connected',
    version: '1.0.0',
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
