var medidaModel = require("../models/medidaModel");




async function buscarUltimaPorSensor(req, res) {
    const idSensor = req.params.idSensor;
    if (!idSensor) {
        return res.status(400).send("idSensor está undefined!");
    }
    try {
        const resultado = await medidaModel.buscarUltimaPorSensor(idSensor);
        if (resultado.length > 0) {
            res.status(200).json(resultado[0]);
        } else {
            res.status(204).json({});
        }
    } catch (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    }
}
module.exports = {
  buscarUltimaPorSensor

}