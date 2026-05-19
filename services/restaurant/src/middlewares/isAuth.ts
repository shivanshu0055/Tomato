import { Request, Response, NextFunction } from 'express';
import jwt,{JwtPayload} from 'jsonwebtoken';

export interface IUser{
    _id: string,
    name: string,
    email: string,
    image: string
    role: string,
    restaurantId?: string
}

export interface AuthenticatedRequest extends Request {
    user?: IUser | null 
}

export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) : Promise<void> => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Please login - send valid auth headers'});
            return;
        }

        const token=authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'Please login - token missing'});
            return;
        }

        const decodedValue=jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if(!decodedValue || !decodedValue.user){
            res.status(401).json({ message: 'Please login - token invalid'});
            return;
        }

        req.user=decodedValue.user as IUser
        next();
    }
    catch(err:any){
        res.status(401).json({ message: 'Please login - token invalid', error: err.message });
    }
}


export const isSeller = async (req: AuthenticatedRequest, res: Response, next: NextFunction) : Promise<void>=>{
    if(req.user?.role !== 'seller'){
        res.status(403).json({message:"Access denied - sellers only"})
        return;
    }
    next();
}