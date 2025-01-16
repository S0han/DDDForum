import express, { Request, Response } from 'express';
import { PrismaClient as prisma } from '@prisma/client';

const app = express();
const PORT = 3000;


app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('code first!');
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});

app.post('/users/new', async (req: Request, res: Response) => {
    const { email, username, firstName, lastName, password } = req.body;

    try {
        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                firstName,
                lastName,
                password,
            }
        });
        res.status(201).json(newUser);
    } catch (e) {
        res.status(400)
    }
});
