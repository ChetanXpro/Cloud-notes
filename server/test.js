const university = require("./data/university");
const selectedUniversity = "Delhi university";
for (const key in university) {
}


const course = university[selectedUniversity].course
console.log(course)

// university[selectedUniversity].semester.forEach((i) => {
//   console.log("Sem", i);
// });
// university[selectedUniversity].subject.forEach((i) => {
//   console.log("Subject", i);
// });
