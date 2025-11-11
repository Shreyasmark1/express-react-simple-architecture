import { Session } from './user-session';

declare global {
    namespace Express {
        interface Request {
            getUserSession: () => Session; 
        }
    }
}

// This is required to make the file a module
export { };