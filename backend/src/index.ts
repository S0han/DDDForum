import express, { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';

const cors = require('cors')
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

const Errors = {
    UsernameAlreadyTaken: 'UsernameAlreadyTaken',
    EmailAlreadyInUse: 'EmailAlreadyInUse',
    ValidationError: 'ValidationError',
    ServerError: 'ServerError',
    ClientError: 'ClientError',
    UserNotFound: 'UserNotFound'
}

function isMissingKeys (data: any, keysToCheckFor: string[]) {
    for (let key of keysToCheckFor) {
      if (data[key] === undefined) return true;
    } 
    return false;
}

function generateRandomPassword(length: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    const passwordArray = [];

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        passwordArray.push(charset[randomIndex]);
    }

    return passwordArray.join('');
}

function parseUserForResponse(user: User) {
    const returnData = JSON.parse(JSON.stringify(user));
    delete returnData.password;
    return returnData;
}

app.post('/users/new', async (req: Request, res: Response) => {
    try {
        const keyIsMissing = isMissingKeys(req.body, 
            ['email', 'firstName', 'lastName', 'username']
        );

        if (keyIsMissing) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false })
        }

        const userData = req.body;

        const existingUserByEmail = await prisma.user.findFirst({ where: { email: userData.email }});
        if (existingUserByEmail) {
          return res.status(409).json({ error: Errors.EmailAlreadyInUse, data: undefined, success: false });
        }

        const existingUsername = await prisma.user.findFirst({ where: { username: userData.username } });
        if (existingUsername) {
            return res.status(409).json({ error: Errors.UsernameAlreadyTaken, data: undefined, success: false });
        }

        const newUser = await prisma.user.create({
            data: {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                username: userData.username,
                password: generateRandomPassword(10)
            },
        });

        return res.status(201).json({ error: undefined, data: parseUserForResponse(newUser), success: true });
    } catch (error) { 
        console.error(error);
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
});

app.post('/users/edit/:userId', async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const user = await prisma.user.findFirst({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: Errors.UserNotFound, data: undefined, success: false });
        }

        const existingUsername = await prisma.user.findFirst({ where: { username: req.body.username } });
        if (existingUsername) {
            return res.status(409).json({ error: Errors.UsernameAlreadyTaken, data: undefined, success: false });
        }        

        res.status(200).json({ error: undefined, data: user, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
});

app.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Error fetching users" });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});