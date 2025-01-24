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
        
        const keyIsMissing = isMissingKeys(req.body, [
            'email', 'firstName', 'lastName', 'username'
        ])
        if (keyIsMissing) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }
        
        const userId = parseInt(req.params.userId);
        const user = await prisma.user.findFirst({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: Errors.UserNotFound, data: undefined, success: false });
        }

        const existingUsername = await prisma.user.findFirst({ where: { 
            username: req.body.username, 
            NOT: { id: userId }
        } });
        if (existingUsername) {
            return res.status(409).json({ error: Errors.UsernameAlreadyTaken, data: undefined, success: false });
        }

        const existingUserByEmail = await prisma.user.findFirst({ where: { 
            email: req.body.email,
            NOT: { id: userId }
        } });
        if (existingUserByEmail) {
            return res.status(409).json({ error: Errors.EmailAlreadyInUse, data: undefined, success: false });
        }

        const userData = req.body;

        const newUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                username: userData.username,
            }
        });
 
        res.status(200).json({ error: undefined, data: parseUserForResponse(newUser), success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
});

app.get('/users', async (req: Request, res: Response) => {
    try {
        const email = req.query.email as string;
        if (!email) {
            console.log("Email query parameter is missing.");
            return res.status(400).json({ error: Errors.UserNotFound , data: undefined, success: false });
        }

        const user = await prisma.user.findFirst({
            where: { email },
        });

        res.status(200).json({ error: undefined, data: user, success: true });
    } catch (e) {
        console.error("Error fetching user:", e);
        res.status(500).json({ error: "ServerError", data: undefined, success: false });
    }
});

app.get('/posts', async (req: Request, res: Response) => {
    try {
        const { sort } = req.query;

        if (sort !== 'recent') {
            return res.status(400).json({ error: Errors.ClientError, data: undefined, successful: false });
        }
        
        let postsWithVotes = await prisma.post.findMany({
            include: {
                votes: true,
                memberPostedBy: {
                    include: {
                        user: true
                    }
                },
                comments: true,
            },
            orderBy: {
                dateCreated: 'desc',
            }
        });

        return res.json({ error: undefined, data: { posts: postsWithVotes }, success: true });
    } catch (error) {
        return res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});