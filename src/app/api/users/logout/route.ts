import { NextApiRequest, NextApiResponse } from 'next';

export default function POST(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        res.setHeader('Set-Cookie', 'uid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');
        res.status(200).json({ message: 'Logged out successfully' });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
