class Manager {
    constructor(model) {
        this.model = model;
    }

    save = async (data) => {
        const newItem = new this.model(data);
        await newItem.save();
        return newItem.toObject();
    };

    findAll = async () => {
        return await this.model.find().lean();
    };

    findById = async (id) => {
        return await this.model.findById(id).lean();
    };

    editOne = async (id, data) => {
        return await this.model.findByIdAndUpdate(id, data, { new: true }).lean();
    };

    deleteById = async (id) => {
        return await this.model.findByIdAndDelete(id);
    };

    findBy = async (filter) => {
        return await this.model.findOne(filter).lean();
    };
}

export default Manager;
