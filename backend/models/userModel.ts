type FileMetadata = {
    filename: string;
    createdAt: Date;
    size: number;
    url: string;
};

type User = {
    email: string;
    password: string;
    files: FileMetadata[];
};

export const users: Record<string, User> = {}; // Mock user database
export const fileShares: Record<string, string[]> = {}; // File sharing map
