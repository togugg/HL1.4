keyParts = ["test","hey"]

x = keyParts.map(part => JSON.stringify(part)).join(':')
x = x.replace(/\"/g,"");
console.log(x.split(':'))