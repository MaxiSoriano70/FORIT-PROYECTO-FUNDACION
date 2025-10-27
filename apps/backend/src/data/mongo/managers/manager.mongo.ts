import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";

type Lean<T> = Omit<T, keyof Document>;

class Manager<T extends Document> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    save = async (data: Partial<T>): Promise<Lean<T>> => {
        const newItem = new this.model(data);
        await newItem.save();
        return newItem.toObject() as Lean<T>;
    };

    findAll = async (): Promise<Lean<T>[]> => {
        return await this.model.find().lean() as Lean<T>[];
    };

    findById = async (id: string): Promise<Lean<T> | null> => {
        return await this.model.findById(id).lean() as Lean<T> | null;
    };

    editOne = async (id: string, data: UpdateQuery<T>): Promise<Lean<T> | null> => {
        return await this.model.findByIdAndUpdate(id, data, { new: true }).lean() as Lean<T> | null;
    };

    deleteById = async (id: string): Promise<T | null> => {
        return await this.model.findByIdAndDelete(id);
    };

    findBy = async (filter: FilterQuery<T>): Promise<Lean<T> | null> => {
        return await this.model.findOne(filter).lean() as Lean<T> | null;
    };
}

export default Manager;
