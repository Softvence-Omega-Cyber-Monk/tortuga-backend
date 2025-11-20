export interface IBlog {
    _id?: string;
    title: string;
    content: string;
    imageUrl: string;
    finalWords: string;
    cloudinaryId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// DTO for creating blogs
export interface CreateBlogDTO {
    title: string;
    content: string;
    imageUrl: string;
    finalWords: string;
    cloudinaryId?: string;
}

// DTO for updating blogs
export interface UpdateBlogDTO {
    title?: string;
    content?: string;
    imageUrl?: string;
    finalWords?: string;
    cloudinaryId?: string;
}