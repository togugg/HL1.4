let x = []
x.push({
    eins: "hey",
    zwei: ""
})

let y = x[x.length-1]
y.zwei = "mo"
console.log(y)
console.log(x[x.length-1])