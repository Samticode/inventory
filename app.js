const express = require('express');
const app = express();

const path = require('path');
const sqlite3 = require('better-sqlite3');
const dotenv = require('dotenv');
dotenv.config();

// ----------------------------------------------------------------

const mainFolder = path.join(__dirname, 'public');

app.use(express.static(mainFolder));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ----------------------------------------------------------------

const db = sqlite3('./database/lettinventory.db', { verbose: console.log });


// ----------------------------------------------------------------

function logDbData(req, res) {
    //console.log users
    const getAll = db.prepare(`
        SELECT * FROM master
    `);

    const allData = getAll.all();

    if (allData) {
        const mappedData = allData.map(item => ({
            id: item.id,
            info: {
                name: item.name,
                user: item.user,
                serial: item.serial,
                mac: item.mac,
                mac2: item.mac2,
                tpm2: item.tpm2,
                date_bought: item.date_bought,
                price: item.price,
                outdated: item.outdated
            },
            hardware: {
                ram: item.ram,
                storage: item.storage,
                cpu: item.cpu,
                powersup: item.powersup
            },
            software: {
                os: item.os
            },
            documentation: {
                log: item.log,
                log_date: item.log_date
            }
        }));
        // console.log(mappedData);
        res.json({ inventory: mappedData });
    } else {
        console.log('No users found in the table.');
    }
    // http://localhost:3000/?name=Asus+pc&user=Roar&serial=12345&mac=1234567&mac2=1234567&ram=256GB+3200MHz&diskSpace=56TB+SSD&cpu=Intel+i9&powerSupply=&os=Tempel+OS&has_tpm=on&purchaseDate=2022-08-02&purchasePrice=2000&isOutdated=on&changeDescription=Lagt+til+i+database&changeDate=2023-11-22
}

// ----------------------------------------------------------------

function trueFalseFixing(what) {
    return what === '1' ? 1 : 0;
}

function replaceEmptyStringWithNull(value) {
    return value === '' ? null : value;
}

// ----------------------------------------------------------------

app.get('/', (req, res) => {
    res.sendFile(path.join(mainFolder, 'index.html'));
});


app.post('/add', (req, res) => {
    const {name, user, serial, mac, mac2, ram, diskSpace, cpu, powerSupply, os, has_tpm, purchaseDate, purchasePrice, isOutdated, changeDescription, changeDate} = req.body;
    
    const fixedHasTPM = trueFalseFixing(has_tpm);
    const fixedIsOutdated = trueFalseFixing(isOutdated);
    const fixedserial = replaceEmptyStringWithNull(serial);
    const fixedmac = replaceEmptyStringWithNull(mac);
    const fixedmac2 = replaceEmptyStringWithNull(mac2);
    const fixedram = replaceEmptyStringWithNull(ram);
    const fixeddiskSpace = replaceEmptyStringWithNull(diskSpace);
    const fixedcpu = replaceEmptyStringWithNull(cpu);
    const fixedpowerSupply = replaceEmptyStringWithNull(powerSupply);
    const fixedos = replaceEmptyStringWithNull(os);

    console.log(name, user, fixedserial, fixedmac, fixedmac2, fixedram, fixeddiskSpace, fixedcpu, fixedpowerSupply, fixedos, fixedHasTPM, purchaseDate, purchasePrice, fixedIsOutdated, changeDescription, changeDate);

    const insertData = db.prepare(`
    INSERT INTO master (name, user, serial, mac, mac2, ram, storage, cpu, powersup, os, tpm2, date_bought, price, outdated, log, log_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const addingToDB = insertData.run(name, user, fixedserial, fixedmac, fixedmac2, fixedram, fixeddiskSpace, fixedcpu, fixedpowerSupply, fixedos, fixedHasTPM, purchaseDate, purchasePrice, fixedIsOutdated, changeDescription, changeDate)

    res.redirect('/');
});

app.put('/edit', (req, res) => {
    const { id, name, user, serial, mac, mac2, ram, storage, cpu, powersup, os, tpm2, date_bought, price, outdated, log, log_date } = req.body;
    
    const query = `UPDATE master SET
    name = ?, 
    user = ?,
    serial = ?,
    mac = ?,
    mac2 = ?,
    ram = ?,
    storage = ?,
    cpu = ?,
    powersup = ?,
    os = ?,
    tpm2 = ?,
    date_bought = ?,
    price = ?,
    outdated = ?,
    log = ?,
    log_date = ?
    WHERE id = ?`;

    const updateData = db.prepare(query);
    updateData.run( name, user, serial, mac, mac2, ram, storage, cpu, powersup, os, tpm2, date_bought, price, outdated, log, log_date, id);
    res.redirect('/');
});

app.delete('/delete', (req, res) => {
    const { id } = req.body;

    const query = `DELETE FROM master WHERE id = ?`;
    const deleteData = db.prepare(query);
    deleteData.run(id);
    
    res.redirect('/');
});


app.get('/inventory/api', logDbData);

// ----------------------------------------------------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
