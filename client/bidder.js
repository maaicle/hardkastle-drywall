
const iSubmit = document.querySelectorAll('.i-submit');
const iCostPer = document.querySelectorAll('.i-cost-per');
const iQty = document.querySelectorAll('.i-quantity');
const lineTotal = document.querySelector('.i-line-total');
const itemBox = document.querySelector('.item-box');
const listBox = document.querySelector('.list-box');
const invName = document.querySelector('.inv-name');
const invInput = document.querySelector('.invoice-input');
const itemInput = document.querySelector('.item-input');

let selectedInv = 0;
let renameId = 0;
let renameValue = '';
let renameNode = null;

const getLastViewed = async () => {
    let lastViewed = 0;
    await axios.get('/lastViewed')
        .then(res => selectedInv = res.data[0].inv_id)
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
            selectedInv = res.data[0].inv_id
            res.data.forEach(ele => {
                const newSec = document.createElement('div');
                newSec.classList.add('list-item');
                newSec.classList.add('item');
                newSec.innerText = 'Hello This is a test';
                newSec.value = ele.inv_id;
                listBox.appendChild(newSec);
                newSec.innerHTML = 
                `
                ${ele.inv_name}
                <button class="i-edit">Rename</button>
                <button class="i-delete">Delete</button>
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
            //Create item lines
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
                    <button class="i-delete">Delete</button>
                `;
            })
            //Create total line
            let newTotal = document.createElement('section');
            newTotal.classList.add('item');
            newTotal.classList.add('invoice-total');
            itemBox.appendChild(newTotal);
            newTotal.innerHTML = `<div class="i-field i-total">${res.data[0].inv_total}</div>`;
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
    }
        
}

const createLineItem = event => {
    event.preventDefault();
    const inputFields = event.target.parentNode.querySelectorAll('.i-field')
    inputArr = [];
    inputFields.forEach(node => {
        inputArr.push(node.value);
        node.value = '';
    })
    handleLineTotal(event);
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
        getInvoice(selectedInv);
    })
};

const deleteLine = event => {
    const item = event.target.parentNode;
    if (item.parentNode.classList.contains('item-box')) {
        axios.delete(`deleteLine/${item.value}`)
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
    event.target.parentNode.innerHTML = 
    '<input placeholder="New Invoice" type="text" class="i-field i-input inv-name">'
    console.log(renameId);
    //because values are being set dynamically I can't use querySelector. I have to select all list items, convert to array and then filter by value.
    const listItems = document.querySelectorAll(`.list-item`)
    const newTarget = [...listItems].filter(ele => {
        return ele.value === renameId
    });
    renameNode = newTarget[0].querySelector('.inv-name');
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
        .then(res => getInvoiceList())
        .catch(err => console.log(err));
    } 
}

//This is a catch all function for newly created HTML elements
let newTargets = event => {
    // console.log(event, event.pointerType);
    const ele = event.target;
    if (ele.classList.contains('list-item')) {
        console.log(ele.value);
        selectedInv = ele.value;
        getInvoice(selectedInv);
        setLastViewed(ele.value);
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
        // getInvoiceList();
        renameId = 0;
    }
}

const keyListener = event => {
    if (event.key === 'Enter' && renameId > 0) {
        updateName(event);
        // getInvoiceList();
        renameId = 0;
    // } else if (event.key === 'Enter' && document.activeElement.parentNode === invInput) {
    //     event.preventDefault();
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


