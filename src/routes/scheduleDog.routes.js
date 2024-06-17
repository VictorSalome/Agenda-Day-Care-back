const express = require("express");
const router = express.Router();

const ScheduleController = require("../controller/schedule.model");

router.post("/annotation", async (req, res) => {
    return new ScheduleController(req, res).postSchedule();
});

// Rota para obter todas as anotações
router.get("/annotations", async (req, res) => {
    return new ScheduleController(req, res).getSchedule();
});

// Rota para obter uma anotação específica por ID
router.get("/annotation/:id", async (req, res) => {
    return new ScheduleController(req, res).getScheduleById();
});

// Rota para atualizar uma anotação específica por ID
router.put("/annotation/:id", async (req, res) => {
    return new ScheduleController(req, res).putSchedule();
});

// Rota para deletar uma anotação específica por ID
router.delete("/annotation/:id", async (req, res) => {
    return new ScheduleController(req, res).deleteSchedule();
});

module.exports = router;
