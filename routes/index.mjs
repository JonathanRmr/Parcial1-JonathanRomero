import express from 'express'
import departments from './../resources/departments.json' with { type: 'json' };
import towns from './../resources/towns.json' with { type: 'json' };
import fs from 'node:fs';

const router = express.Router()

const readRecords = () => {
    try {
        const data = fs.readFileSync('resources/records.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

const writeRecords = (records) => {
    fs.writeFileSync('resources/records.json', JSON.stringify(records, null, 2), 'utf8');
}

router.get('/', (req, res) => {
    const allRecords = readRecords();
    const { departamento } = req.query;
    let filteredRecords = allRecords;

    if (departamento) {
        filteredRecords = allRecords.filter(record => record.departamento === departamento);
    }

    const recordsWithNames = filteredRecords.map(record => {
        const departmentObject = departments.find(dep => dep.code === record.departamento);
        return {
            fecha: record.fecha,
            departamento: departmentObject ? departmentObject.name : record.departamento,
            municipio: record.municipio
        };
    });

    res.render('index.ejs', {
        "title": "Sistema de Información Geográfica",
        "data": recordsWithNames,
        "departments": departments
    })
})

router.get('/new-record', (req, res) => {
    res.render('add-record.ejs', {
        "title": "Nuevo Registro",
        "departments": departments,
        "towns": towns
    })
})

router.post("/", (req, res) => {
    const records = readRecords();
    const { fecha, departamento, municipio } = req.body
    const newRecord = {
        fecha: fecha,
        departamento: departamento,
        municipio: municipio
    }

    records.push(newRecord)
    writeRecords(records);
    res.redirect('/')
})

router.post('/delete-record', (req, res) => {
    const records = readRecords();
    const { index } = req.body;
    if (index !== undefined && records[index]) {
        records.splice(index, 1);
    }
    writeRecords(records);
    res.redirect('/');
})

export default router
