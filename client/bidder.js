console.log('connected to bidder');

const iSubmit = document.querySelectorAll('.i-submit');
const iCostPer = document.querySelectorAll('.i-cost-per');
const iQty = document.querySelectorAll('.i-quantity');
const lineTotal = document.querySelector('.i-line-total');




let count = 0;
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
    console.log(body);
    axios.post(`/createLineItem`, body)
    .then(res => {
        console.log(res.data);
    })
};

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