const Schedule = require("../models/schedule.model");

class ScheduleController {
    constructor(req, res) {
        // Adicionando o this para referenciar as propriedades req e res dentro da classe
        this.req = req;
        this.res = res;
    }

    async postSchedule() {
        const { title, start, end, description } = this.req.body;

        const newSchedule = new Schedule({
            title,
            start: start || new Date(), // Usa a data e hora atuais se não fornecidas
            end: end || new Date(), // Opcionalmente, ajusta o final também
            description,
        });

        try {
            const savedSchedule = await newSchedule.save();
            this.res.status(201).json({
                message: "Agendamento criado com sucesso",
                schedule: savedSchedule,
            });
        } catch (error) {
            this.res
                .status(500)
                .json({ message: "Erro ao salvar agendamento" });
        }
    }

    async getSchedule() {
        try {
            const schedules = await Schedule.find();
            this.res.status(200).json(schedules);
        } catch (error) {
            this.res
                .status(500)
                .json({ message: "Erro ao buscar agendamentos" });
        }
    }

    async getScheduleById() {
        const { id } = this.req.params;

        try {
            const schedule = await Schedule.findById(id);
            if (!schedule) {
                return this.res
                    .status(404)
                    .json({ message: "Erro ao buscar agendamento" });
            }
            this.res.status(200).json(schedule);
        } catch (error) {
            this.res.status(500).json({ message: "Error fetching schedule" });
        }
    }

    async putSchedule() {
        const { id } = this.req.params;
        const { title, start, end, description } = this.req.body;

        try {
            const updatedSchedule = await Schedule.findByIdAndUpdate(
                id,
                { title, start, end, description },
                { new: true, runValidators: true }
            );

            if (!updatedSchedule) {
                return this.res
                    .status(404)
                    .json({ message: "erro ao atualizar" });
            }

            this.res.status(200).json(updatedSchedule);
        } catch (error) {
            this.res.status(500).json({ message: "Erro ao atualizar" });
        }
    }

    async deleteSchedule() {
        const { id } = this.req.params;

        try {
            const deletedSchedule = await Schedule.findByIdAndDelete(id);

            if (!deletedSchedule) {
                return this.res
                    .status(404)
                    .json({ message: "Erro ao deletar" });
            }

            this.res.status(200).json({
                message: "Agendamento deletado com sucesso",
            });
        } catch (error) {
            this.res.status(500).json({ message: "Erro ao deletar" });
        }
    }
}

module.exports = ScheduleController;
