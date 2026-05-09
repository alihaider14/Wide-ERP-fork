import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "~/config/jwt.config";

export const generatePassword = async (password: string) => {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    return hashedPassword;
};

export const comparePassword = async (
    password: string,
    hashedPassword: string
) => {
    const isMatch = await bcryptjs.compare(password, hashedPassword);

    return isMatch;
};

export async function getToken(user: object) {
    const token = jwt.sign({ user }, JWT_SECRET, {
        expiresIn: "1h",
    });

    return token;
}

export async function getRefreshToken(user: object) {
    const token = jwt.sign({ user }, JWT_REFRESH_SECRET, {
        expiresIn: "90d",
    });

    return token;
}
