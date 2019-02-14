export interface IClassification {
    id: number;
    layer: 0 | 1 | 2 | 3 | 4;
    user: string;
    modificationDate?: Date;
}
