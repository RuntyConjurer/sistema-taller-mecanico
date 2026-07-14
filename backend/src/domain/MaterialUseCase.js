class MaterialUseCase {
    constructor(materialRepository) {
        this.materialRepository = materialRepository;
    }

    async obtenerTodos() {
        return await this.materialRepository.obtenerTodos();
    }

    async obtenerPorId(id) {
        const material = await this.materialRepository.obtenerPorId(id);

        if (!material) {
            throw new Error("Material no encontrado.");
        }

        return material;
    }

    async crear(data) {
        return await this.materialRepository.crear(data);
    }

    async actualizar(id, data) {
        const material = await this.materialRepository.obtenerPorId(id);

        if (!material) {
            throw new Error("Material no encontrado.");
        }

        return await this.materialRepository.actualizar(id, data);
    }

    async eliminar(id) {
        const material = await this.materialRepository.obtenerPorId(id);

        if (!material) {
            throw new Error("Material no encontrado.");
        }

        return await this.materialRepository.eliminar(id);
    }
}

module.exports = MaterialUseCase;