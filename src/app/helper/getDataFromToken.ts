import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface DecodedToken {
    id: string;
    // Add other expected properties from your JWT payload
}

export const getDataFromToken = (request: NextRequest): string => {
    try {
        // Check if token secret exists
        if (!process.env.TOKEN_SECRET) {
            throw new Error("TOKEN_SECRET environment variable not configured");
        }

        const token = request.cookies.get("token")?.value || '';
        
        // Verify token with proper type assertion
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET) as DecodedToken;

        if (!decodedToken.id) {
            throw new Error("Invalid token structure - missing user ID");
        }

        return decodedToken.id;

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Token verification failed: ${error.message}`);
        }
        throw new Error("Unknown error occurred during token verification");
    }
}