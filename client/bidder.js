const iSubmit = document.querySelectorAll('.i-submit');
const iCostPer = document.querySelectorAll('.i-cost-per');
const iQty = document.querySelectorAll('.i-quantity');
const lineTotal = document.querySelector('.i-line-total');
const itemBox = document.querySelector('.item-box');
const listBox = document.querySelector('.list-box');

const getInvoiceList = () => {
    listBox.innerHTML = '';
    console.log(listBox);
    axios.get('/getInvoiceList')
        .then(res => {
            //Create list items
            res.data.forEach(ele => {
                let newSec = document.createElement('section');
                newSec.classList.add('item');
                listBox.appendChild(newSec);
                newSec.innerHTML = 
                `
                <p class= inv-name>${ele.inv_name}</p>
                <button class="i-edit">Edit</button>
                <button class="i-delete">Delete</button>
                `                
            })
        })
}

const getInvoice = () => {
    itemBox.innerHTML = '';
    axios.get('/getInvoice/1')
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

// let count = 0;
const handleLineTotal = event => {
    let targetCost = event.target.parentNode.querySelector('.i-cost-per').value;
    let targetQty = event.target.parentNode.querySelector('.i-quantity').value;
    lineTotal.textContent = (targetCost * targetQty).toFixed(2);
}

const handleSubmit = event => {
    const inputFields = event.target.parentNode.querySelectorAll('.i-input')
    inputArr = [];
    inputFields.forEach(node => {
        inputArr.push(node.value);
    })
    let body = {
        description: inputArr[0],
        costPer: inputArr[1],
        quantity: inputArr[2],
        unit: inputArr[3]
    }
    axios.post(`/createLineItem`, body)
    .then(res => {
        console.log(res.data);
        let newDiv = document.createElement('div');
        newDiv.classList.add('test');
        itemBox.appendChild(newDiv);
        newDiv.textContent=res.data.description;

    })
};

getInvoiceList();
getInvoice();

iCostPer.forEach(node => {
    node.addEventListener('input', handleLineTotal);
})
iQty.forEach(node => {
    node.addEventListener('input', handleLineTotal);
})
iSubmit.forEach(node => {
    node.addEventListener('click', handleSubmit);
});



// iDescrip.addEventListener('click', event => console.log('description clicked'));