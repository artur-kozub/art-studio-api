import express, { Application, NextFunction, Request, Response } from "express";
import connectDB from './db';
import cors from 'cors';
import bookRoutes from './routes/bookingRoute';
import paymentRoutes from './routes/paymentRoute';

const app: Application = express();
const PORT = process.env.EXPRESS_PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(process.env.BOOKINGS_ENDPOINT + '', bookRoutes);
app.use(process.env.PAYMENTS_ENDPOINT + '', paymentRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.get('/', (req: Request, res: Response) => {
    res.send('/')
});

app.get('/healthcheck', (req: Request, res: Response) => {
    res.send('Servers is on...')
});

app.listen(PORT, () => {
    console.log('Server is listening on ' + PORT)
});

connectDB();