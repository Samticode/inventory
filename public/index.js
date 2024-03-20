// -----------------------------DATA FRA DB/API-----------------------------------
//------------LESE/READ--------------
let inventoryId = null;

function showUserDetails(user) {
    document.getElementById('editName').value = user.info.name;
    document.getElementById('editUser').value = user.info.user;
    document.getElementById('editSerial').value = user.info.serial;
    document.getElementById('editMac').value = user.info.mac;
    document.getElementById('editMac2').value = user.info.mac2;
    document.getElementById('editRam').value = user.hardware.ram;
    document.getElementById('editDiskSpace').value = user.hardware.storage;
    document.getElementById('editCpu').value = user.hardware.cpu;
    document.getElementById('editPowerSupply').value = user.hardware.powersup;
    document.getElementById('editOs').value = user. software.os;
    document.getElementById('editPurchaseDate').value = user.info.date_bought;
    document.getElementById('editPurchasePrice').value = user.info.price;
    document.getElementById('editChangeDescription').value = user.documentation.log;
    document.getElementById('editChangeDate').value = user.documentation.log_date;

    console.log(`ID: ${user.id}`)
    return inventoryId = user.id;
}

function addDataToInput(thiss, that) {
    thiss.classList.remove('addInventoryForm');
    thiss.classList.add('none');
    that.classList.remove('none');
    that.classList.add('addInventoryForm');
}

let elseOr = 1;
let lastClickedRow = null;

async function fetchApi() {
    const fetch_data = await fetch('/inventory/api');
    const data = await fetch_data.json();

    const inventoryUnits = data.inventory;
    const tableBody = document.querySelector('tbody');

    // for(let i = 0; i < 30; i++){

    // }
    let index = 1;
    inventoryUnits.forEach(inventoryUnit => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index}</td>
            <td>${inventoryUnit.info.name}</td>
            <td>${inventoryUnit.info.user}</td>
            <td>${inventoryUnit.info.serial}</td>
            <td>${inventoryUnit.info.mac}</td>
            <td>${inventoryUnit.info.mac2}</td>
            <td>${inventoryUnit.hardware.ram}</td>
            <td>${inventoryUnit.hardware.storage}</td>
            <td>${inventoryUnit.hardware.cpu}</td>
            <td>${inventoryUnit.hardware.powersup}</td>
            <td>${inventoryUnit.software.os}</td>
            <td>${inventoryUnit.info.tpm2 ? 'Ja' : 'Nei'}</td>
            <td>${inventoryUnit.info.date_bought}</td>
            <td>${inventoryUnit.info.price} kr</td>
            <td>${inventoryUnit.info.outdated ? 'Ja' : 'Nei'}</td>
            <td>${inventoryUnit.documentation.log}</td>
            <td>${inventoryUnit.documentation.log_date}</td>
        `;
        tableBody.appendChild(row);
        index++;

        row.addEventListener('click', () => {
            if (lastClickedRow === row) {
                addDataToInput(editInventoryForm, addInventoryForm);
                lastClickedRow = null;
            } else {
                addDataToInput(addInventoryForm, editInventoryForm);
                showUserDetails(inventoryUnit);
                lastClickedRow = row;
            }
        });
    });
}
fetchApi();

//------------OPPDATERE/UPDATE--------------
async function updateInventory(e) {
    e.preventDefault();
    const editName = document.getElementById('editName').value;
    const editUser = document.getElementById('editUser').value;
    const editSerial = document.getElementById('editSerial').value;
    const editMac = document.getElementById('editMac').value;
    const editMac2 = document.getElementById('editMac2').value;
    const editRam = document.getElementById('editRam').value;
    const editDiskSpace = document.getElementById('editDiskSpace').value;
    const editCpu = document.getElementById('editCpu').value;
    const editPowerSupply = document.getElementById('editPowerSupply').value;
    const editOs = document.getElementById('editOs').value;

    const has_tpm = document.getElementById('has_tpm').checked;
    console.log(has_tpm);

    const editPurchaseDate = document.getElementById('editPurchaseDate').value;
    const editPurchasePrice = document.getElementById('editPurchasePrice').value;
    
    const isOutdated = document.getElementById('isOutdated').checked;
    console.log(isOutdated);
    
    const editChangeDescription = document.getElementById('editChangeDescription').value;
    const editChangeDate = document.getElementById('editChangeDate').value;

    const editInventory = {
        id: inventoryId,
        name: editName,
        user: editUser,
        serial: editSerial,
        mac: editMac,
        mac2: editMac2,
        ram: editRam,
        storage: editDiskSpace,
        cpu: editCpu,
        powersup: editPowerSupply,
        os: editOs,
        tpm2: has_tpm,
        date_bought: editPurchaseDate,
        price: editPurchasePrice,
        outdated: isOutdated,
        log: editChangeDescription,
        log_date: editChangeDate
    };

    try {
        const response = await fetch('/edit', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editInventory),
        });

        if (!response.ok) {
            console.error('Failed to update inventory:', response.statusText);
        } else {
            console.log('Inventory updated successfully');
            window.location.reload();
        }
    } catch (error) {
        console.error('Error during fetch:', error);
    }

    window.location.reload();
}
document.querySelector('#editInventoryForm #editIt').addEventListener('click', updateInventory);


//------------SLETTE/DELETE--------------
async function deleteInventory(e) {
    e.preventDefault();

    const deleteInventory = {
        id: inventoryId
    };

    try {
        const response = await fetch('/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deleteInventory),
        });

        if (!response.ok) {
            console.error('Failed to delete inventory:', response.statusText);
        } else {
            console.log('Inventory deleted successfully');
            window.location.reload();
        }
    } catch (error) {
        console.error('Error during fetch:', error);
    }

    window.location.reload();
}
document.querySelector('#editInventoryForm #deleteIt').addEventListener('click', deleteInventory);


// ---------------------------EDIT & DELETE DB ENTRIES-------------------------------------

const editInventoryForm = document.getElementById('editInventoryForm');
const addInventoryForm = document.getElementById('addInventoryForm');

// -----------------------------DARK/WHITE-MODE & ENGLISH/NORWEGIAN-----------------------------------

function enableDarkMode() {
    const root = document.documentElement;
    root.style.setProperty('--black', 'rgb(25, 25, 25)');
    root.style.setProperty('--light-black', 'rgb(49, 49, 49)');
    root.style.setProperty('--border', 'rgba(255, 255, 255, 0.506)');
    root.style.setProperty('--really-white', 'rgb(255, 255, 255)');
}

function disableDarkMode() {
    const root = document.documentElement;
    root.style.setProperty('--black', 'rgb(239, 239, 239)');
    root.style.setProperty('--light-black', 'rgb(205, 238, 247)');
    root.style.setProperty('--border', 'rgba(0, 0, 0, 0.708)');
    root.style.setProperty('--really-white', 'rgb(0, 0, 0)');
}

function english() {

}


const lightmodeButton = document.getElementById('lightmodeButton');
const languageButton = document.getElementById('languageButton');

window.addEventListener('load', () => {
    if (lightmodeButton.checked) {
        disableDarkMode();
    } else {
        enableDarkMode() 
    }
    if (lightmodeButton.checked) {

    } else {

    }
    lightmodeButton.addEventListener('change', () => {
        if (lightmodeButton.checked) {
            disableDarkMode();
        } else {
            enableDarkMode() 
        }
    });

    languageButton.addEventListener('change', () => {
        if (languageButton.checked) {

        } else {

        }
    });
});

// ---------------------------SEARCHBAR-------------------------------------

const search = document.getElementById('searchBar');

function filterRows(searchValue) {
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        const rowData = row.textContent.toLowerCase();
        if (rowData.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

window.addEventListener('load', () => {
    search.value = null;
    filterRows('');
    search.addEventListener('keyup', () => {
        let searchValue = search.value.toLowerCase();
        filterRows(searchValue);
    });
});

// ---------------------------HIDE SIDEBAR-------------------------------------

const menyBTN = document.querySelector('h1');
const sidebar = document.querySelector('.sidebar');
const mainSpace = document.querySelector('.mainSpace');

let isSidebarVisible = true;

menyBTN.addEventListener('click', () => {
    if (isSidebarVisible) {
        sidebar.style.opacity = '0';
        sidebar.style.width = '7%';
        mainSpace.style.width = '93%';
    } else {
        sidebar.style.opacity = '1';
        sidebar.style.width = '17%';
        mainSpace.style.width = '83%';
    }
    isSidebarVisible = !isSidebarVisible;
});