const iSubmit = document.querySelectorAll('.i-submit');
const iCostPer = document.querySelectorAll('.i-cost-per');
const iQty = document.querySelectorAll('.i-quantity');
const lineTotal = document.querySelector('.i-line-total');
const itemBox = document.querySelector('.item-box');
const listBox = document.querySelector('.list-box');
const invName = document.querySelector('.inv-name');
const invInput = document.querySelector('.invoice-input');
const itemInput = document.querySelector('.item-input');
const iDescription = document.querySelector('.i-description.i-input');

let selectedInv = 0;
let renameId = 0;
let renameFrom = '';
let renameNode = null;

const getLastViewed = async () => {
    let lastViewed = 0;
    await axios.get('/lastViewed')
        .then(res => changeSelectedInv(res.data[0].inv_id))
        .catch(err => console.log(err));
}

const setLastViewed = (id) => {
    axios.put(`/putLastViewed/${id}`)
        .then(res => console.log('Last view set'))
        .catch(err => console.log(err));
}

const getInvoiceList = async () => {
    listBox.innerHTML = '';
    await axios.get('/getInvoiceList')
        .then(async res => {
            // Create list items
            changeSelectedInv(res.data[0].inv_id);
            res.data.forEach(ele => {
                const newSec = document.createElement('div');
                newSec.classList.add('list-item');
                newSec.classList.add('item');
                newSec.value = ele.inv_id;
                listBox.appendChild(newSec);
                newSec.innerHTML = 
                `
                <div class="name-space">${ele.inv_name}</div>
                <button class="i-edit"></button>
                <button class="i-delete"></button>
                `;
            })
            console.log(`getInvoiceList selectedInv ${selectedInv}`);
            await getLastViewed();    
            getInvoice(selectedInv);      
        })
}

const getInvoice = async (value) => {
    itemBox.innerHTML = '';
    axios.get(`/getInvoice/${value}`)
        .then(res => {
            //Create name box
            let newSec = document.createElement('section');
                newSec.classList.add('item');
                newSec.classList.add('inv-name-box');
                itemBox.appendChild(newSec);
                newSec.innerHTML = `<p class= inv-name>${res.data[0].inv_name}</p>`
            //Create columns
            let newColumns = document.createElement('section');
                newColumns.classList.add('item');
                newColumns.classList.add('columns')
                itemBox.appendChild(newColumns);
                newColumns.innerHTML = `
                    <div class="i-field i-column i-description">Description</div>
                    <div class="i-field i-column i-cost-per">Cost Per</div>
                    <div class="i-field i-column i-quantity">Quantity</div>
                    <div class="i-field i-column i-unit">Unit</div>
                    <div class="i-field i-column i-line-total">Line Total</div>
                    <div class="delete-space">Delete</div>
                `
            //Create item lines
            if (res.data[0].i_id) {
                res.data.forEach(ele => {
                    let newSec = document.createElement('section');
                    newSec.classList.add('item');
                    newSec.value = ele.i_id;
                    itemBox.appendChild(newSec);
                    newSec.innerHTML =
                    `
                    <div class="i-field i-description">${ele.i_description}</div>
                    <div class="i-field i-cost-per">${ele.i_cost}</div>
                    <div class="i-field i-quantity">${ele.i_qty}</div>
                    <div class="i-field i-unit">${ele.i_unit}</div>
                    <div class="i-field i-line-total">${ele.i_line_total}</div>
                    <button class="i-delete"></button>
                    `;
                })
                //Create total line
                let newTotal = document.createElement('section');
                newTotal.classList.add('item');
                newTotal.classList.add('invoice-total');
                itemBox.appendChild(newTotal);
                newTotal.innerHTML = `
                <div class="i-column">Total:</div>
                <div class="i-field i-total">${res.data[0].inv_total}</div>
                `;
            }
        })
        .catch(err => console.log(err));
    console.log('getInvoice')
}

const handleLineTotal = event => {
    let targetCost = event.target.parentNode.querySelector('.i-cost-per').value;
    let targetQty = event.target.parentNode.querySelector('.i-quantity').value;
    let total = (targetCost * targetQty).toFixed(2);
    lineTotal.textContent = total;
    lineTotal.value = total;
}

const createInvoice = async event => {
    event.preventDefault();
    const invNameInput = event.target.parentNode.querySelector('.inv-name');
    console.log(`createInvoice name value: ${invNameInput.value}`);
    if (invNameInput.value) {
        await axios.post(`/createInvoice/${invNameInput.value}`)
        .then(res => {
            getInvoiceList()
        })
        .catch(err => console.log(err));
        invNameInput.value = '';
        iDescription.focus();
    }
        
}

const createLineItem = event => {
    event.preventDefault();
    const inputFields = event.target.parentNode.querySelectorAll('.i-field')
    let inputArr = [];
    let completeForm = true;
    inputFields.forEach(node => {
        if(node.value) {
            inputArr.push(node.value);
        } else {
            completeForm = false;
        }
    })
    if (completeForm) {

        let body = {
            invId: selectedInv,
            description: inputArr[0],
            costPer: inputArr[1],
            quantity: inputArr[2],
            unit: inputArr[3],
            lineTotal: +inputArr[4]
        }
        axios.post(`/createLineItem`, body)
        .then(res => {
        })
        getInvoice(selectedInv);
        inputFields[0].focus();
        inputFields.forEach(node => {
            node.value = '';
        })
        handleLineTotal(event);
    } else {
        alert('Complete all fields before submitting');
    }
};

const deleteLine = event => {
    const item = event.target.parentNode;
    if (item.parentNode.classList.contains('item-box')) {
        axios.delete(`deleteLine/?invId=${selectedInv}&itemId=${item.value}`)
            .then(res => getInvoice(selectedInv))
            .catch(err => console.log(err));
    } else if (item.parentNode.classList.contains('list-box')) {
        axios.delete(`deleteListItem/${item.value}`)
            .then(res => getInvoiceList())
            .catch(err => console.log(err));
    }
}

const renameField = event => {
    renameId = event.target.parentNode.value
    renameFrom = event.target.parentNode.querySelector('.name-space').textContent;
    console.log(renameFrom);
    event.target.parentNode.innerHTML = 
    `<input placeholder="${renameFrom}" type="text" class="i-field i-input inv-name">`
    //because values are being set dynamically I can't use querySelector. I have to select all list items, convert to array and then filter by value.
    const listItems = document.querySelectorAll(`.list-item`)
    const newTarget = [...listItems].filter(ele => {
        return ele.value === renameId
    });
    renameNode = newTarget[0].querySelector('.inv-name');
    // console.log(renameId, renameNode);
    renameNode.focus();
}

const updateName = event => {
    console.log(renameId, renameNode.value);
    if (renameNode.value) {
        const body = {
            id: renameId,
            newName: renameNode.value
        }
        axios.put(`/updateName`, body)
        .then(res => console.log('name updated'))
        .catch(err => console.log(err));
    }
    getInvoiceList();
}

const changeSelectedInv = id => {
    const listItems = document.querySelectorAll(`.list-item`)
    const listItemsArray = [...listItems]
    listItemsArray.forEach(ele => {
        if (ele.value === selectedInv) {
            ele.classList.remove('selected');
        };
        
        if (ele.value === id) {
            ele.classList.add('selected');
        };
    });
    // .filter(ele => {
        // return ele.value === selectedInv
    // });
    // console.log(listItemsArray);
    selectedInv = id;

}

//This is a catch all function for newly created HTML elements
let newTargets = event => {
    // console.log(event, event.pointerType);
    const ele = event.target;
    if (ele.classList.contains('list-item')) {
        console.log(ele.value);
        changeSelectedInv(ele.value);
        getInvoice(selectedInv);
        setLastViewed(ele.value);
    };

    if (ele.classList.contains('name-space')) {
        console.log(ele.parentNode.value);
        changeSelectedInv(ele.parentNode.value);
        getInvoice(selectedInv);
        setLastViewed(ele.parentNode.value);
    };

    if (ele.classList.contains('inv-submit')) {
        createInvoice(event);
    };

    if (ele.classList.contains('i-submit')) {
        createLineItem(event);
    };

    if (ele.classList.contains('i-delete')) {
        deleteLine(event);
    }

    if (ele.classList.contains('i-edit') && renameId === 0) {
        renameField(event);
    } else if (event.target !== renameNode && renameId > 0) {
        console.log(event.target, renameNode);
        updateName(event);
        renameId = 0;
    }
}

const keyListener = event => {
    if (event.key === 'Enter' && renameId > 0) {
        updateName(event);
        renameId = 0;
    }
}

getInvoiceList();


iCostPer.forEach(node => {
    node.addEventListener('input', handleLineTotal);
})
iQty.forEach(node => {
    node.addEventListener('input', handleLineTotal);
})

invInput.addEventListener('submit', createInvoice);
itemInput.addEventListener('submit', createLineItem);

//Listens anytime anything is clicked in the document. newTargets function deciphers the target.
document.addEventListener('click', newTargets);
document.addEventListener('keypress', keyListener);


