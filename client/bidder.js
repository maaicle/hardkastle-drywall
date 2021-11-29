
const iSubmit = document.querySelectorAll('.i-submit');
const iCostPer = document.querySelectorAll('.i-cost-per');
const iQty = document.querySelectorAll('.i-quantity');
const lineTotal = document.querySelector('.i-line-total');
const itemBox = document.querySelector('.item-box');
const listBox = document.querySelector('.list-box');

let selectedInv = 0;

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
                let newSec = document.createElement('button');
                newSec.classList.add('list-item');
                newSec.classList.add('item');
                newSec.innerText = 'Hello This is a test';
                newSec.value = ele.inv_id;
                listBox.appendChild(newSec);
                newSec.innerHTML = 
                `
                ${ele.inv_name}
                <button class="i-edit">Edit</button>
                <button class="i-delete">Delete</button>
                `;
            })
            console.log(selectedInv);
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
                itemBox.appendChild(newSec);
                newSec.innerHTML =
                `
                    <div class="i-field i-description">${ele.i_description}</div>
                    <div class="i-field i-cost-per">${ele.i_cost}</div>
                    <div class="i-field i-quantity">${ele.i_qty}</div>
                    <div class="i-field i-unit">${ele.i_unit}</div>
                    <div class="i-field i-line-total">${ele.i_line_total}</div>
                    <button class="i-edit">Edit</button>
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
    const invNameInput = event.target.parentNode.querySelector('.inv-name');
    console.log(invNameInput.value);
    await axios.post(`/createInvoice/${invNameInput.value}`)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    
}

const createLineItem = event => {
    const inputFields = event.target.parentNode.querySelectorAll('.i-field')
    inputArr = [];
    inputFields.forEach(node => {
        inputArr.push(node.value);
    })
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

//This is a catch all function for newly created HTML elements
let newTargets = event => {
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
        console.log('delete button');
    }
}

getInvoiceList();


iCostPer.forEach(node => {
    node.addEventListener('input', handleLineTotal);
})
iQty.forEach(node => {
    node.addEventListener('input', handleLineTotal);
})
// iSubmit.forEach(node => {
//     node.addEventListener('click', handleSubmit);
// });

//Listens anytime anything is clicked in the document. newTargets function deciphers the target.
document.addEventListener('click', newTargets);


