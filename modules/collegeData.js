const fs = require("fs");


class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        fs.readFile('./data/courses.json','utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses"); return;
            }

            fs.readFile('./data/students.json','utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students"); 
                    return;
                }
            
        
                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
        if (dataCollection.students.length == 0) {
            reject("query returned 0 results"); 
            return;
        }

        resolve(dataCollection.students);
    })
}

module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].TA == true) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); 
            return;
        }

        resolve(filteredStudents);
    });
};

module.exports.getCourses = function(){
   return new Promise((resolve,reject)=>{
    if (dataCollection.courses.length == 0) {
        reject("query returned 0 results"); 
        return;
    }

    resolve(dataCollection.courses);
   });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var foundStudent = null;

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == num) {
                foundStudent = dataCollection.students[i];
            }
        }

        if (!foundStudent) {
            reject("query returned 0 results"); 
            return;
        }

        resolve(foundStudent);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].course == course) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); 
            return;
        }

        resolve(filteredStudents);
    });
};
module.exports.getCourseById = function (id) {
    return new Promise((resolve,reject) => {
        for (const course of dataCollection.courses){

          const courseId = parseInt(id);
            if(course.courseId === courseId){
                resolve(course);
                return;
            }
        }
        reject("Query returned 0 results.");
    });
}


/*module.exports.updateStudent = function (updatedStudent) {
  return new Promise((resolve, reject) => {
    const index = students.findIndex((student) => student.studentNum === studentData.studentNum);

    if (index !== -1) {
     
      students[index].firstName = studentData.firstName;
      students[index].lastName = studentData.lastName;
      students[index].email = studentData.email;
      students[index].address.street = studentData.addressStreet;
      students[index].address.city = studentData.addressCity;
      students[index].address.province = studentData.addressProvince;
      students[index].TA = studentData.TA === "on";
      students[index].status = studentData.status;
      students[index].course = parseInt(studentData.course); 
      resolve();
    } else {
      // If no student is found with the given studentNum
      reject("Student not found");
    }
  });
}
*/
module.exports.updateStudent = function (updatedStudent) {
  return new Promise((resolve, reject) => {
    const studentNum = parseInt(updatedStudent.studentNum);
   
    const index = dataCollection.students.findIndex((student) => student.studentNum ===studentNum);
 

    if (index !== -1) {
      dataCollection.students[index].firstName = updatedStudent.firstName;
      dataCollection.students[index].lastName = updatedStudent.lastName;
      dataCollection.students[index].email = updatedStudent.email;
      dataCollection.students[index].addressStreet = updatedStudent.addressStreet;
      dataCollection.students[index].addressCity = updatedStudent.addressCity;
      dataCollection.students[index].addressProvince = updatedStudent.addressProvince;
      dataCollection.students[index].TA = updatedStudent.TA === "on";
      dataCollection.students[index].status = updatedStudent.status;
      dataCollection.students[index].course = parseInt(updatedStudent.course);
      resolve();
    } else {
      // If no student is found with the given studentNum
      reject(new Error("Student not found"));
    }
  });
};







