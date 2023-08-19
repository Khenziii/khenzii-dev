// Create a new Date object
var currentDate = new Date();

console.log(currentDate)

// Get the local time components
var localYear = currentDate.getFullYear();
var localMonth = currentDate.getMonth();
var localDay = currentDate.getDate()
var localHours = currentDate.getHours();
var localMinutes = currentDate.getMinutes();
var localSeconds = currentDate.getSeconds();

console.log(localYear)
console.log(localMonth)
console.log(localDay)
console.log(localHours)
console.log(localMinutes)
console.log(localSeconds)

console.log(localDay + "/" + localMonth + "/" + localYear.toString().slice(-2) + " - " + localHours + ":" + localMinutes + ":" + localSeconds)