/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: LAVANYA SASIKALA Student ID: 156621211 Date: 22/07/2023
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var collegeData = require("./modules/collegeData.js");  //importing collegeData.js module.
var app = express();





app.engine('.hbs', exphbs.engine(
    { extname: '.hbs',
      defaultLayout: 'main',
      helpers:{
      navLink: function(url, options){
        return '<li' + 
            ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
            '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    }
}
}


));

app.set('view engine', '.hbs');

//app.set("views", path.join(__dirname, "views"));


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));   // Body-parser middleware

// setup a 'route' to listen on the default url path
app.get("/students", (req, res) => {
    // Retrieving all students
    collegeData.getAllStudents()
    .then((students)=>{
        if(req.query.course){
            //If query parameter course is provided, filter students by course.
            return collegeData.getStudentsByCourse(parseInt(req.query.course));
        }
        else{
            //If no query parameter, return all students
            return students;
        }
    })
    .then((filteredStudents)=>{
        if(filteredStudents.length===0){
            //If no data found, render "students" view with he message e "No results found".
            res.render("students",{message:"No results found"});
        } else{
            //Render students view with the students data.
            res.render("students",{students:filteredStudents});
        }
    })
    .catch((err)=> {
        //If an error occured,  "students" view with he message e "No results found".
        res.render("students",{students:filteredStudents});
    });
    
});
/*app.get("/tas", (req,res)=>{
    collegeData.getTAs()
    //Retrieve all teaching assistants
        .then((tas) => {
        if(tas.length === 0){
            //If No TAs found, return the message No results.
            res.json({message:"no results"});
        } else{
            //Return TAs

            res.json(tas);
    }
})
        .catch((error) =>{
            //If an error occured, return the message no results
        res.json({message : "no results"});
    });

});
*/
app.get("/courses",(req,res) =>{
    collegeData.getCourses()
    //Retrieve courses
    .then(courses => {
        //Return the courses
        res.render("courses", {courses:courses });
    })
    .catch(() => {
        //If an error occurs, return the error message.
        res.render("courses",{ message : "No results"});
    });
});
app.get("/student/:num", (req,res) =>{
    const studentNum = req.params.num;
    //retrieve the student number from the request and gte the student by the number.
    collegeData.getStudentByNum(studentNum)
    .then(student => {
        //Return the student number.
        res.render("student", {student});
    })
    .catch(() => {
        //If error, return a message.
        res.render("student", {message : "Student Not Found"});
    });
    
});

app.get("/course/:id", (req,res) => {
    const courseId =req.params.id;
    collegeData.getCourseById(courseId)
    .then((course) => {
        console.log(course);
    res.render("course",{course});
    })
    .catch((error) => {
        console.log(error);
        res.render("course", {message: error});
    });
});


app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
    next();
});

app.get ("/", (req,res) =>{
    //const filePath = path.join(__dirname,"views","home.html");  //File path for home.html
    res.render("home");
});
app.get("/about", (req,res) =>{
    //const filePath = path.join(__dirname,"views","about.html");   //File path for about.html
    res.render("about");
});
app.get("/htmlDemo", (req,res) =>{
    //const filePath = path.join(__dirname,"views","htmlDemo.html");  //File path for htmlDemo.html
    res.render("htmlDemo");
});
app.get("/students/add", (req, res) => {
    //const filePath = path.join(__dirname, "views", "addStudent.html");   //File path for addStudent.html
    res.render("addStudent");
  });
app.post("/students/add", (req, res) => {
    const studentData = req.body;
  
    collegeData.addStudent(studentData)     //Calling addStudent function from collegeData module to add the student
      .then(() => {
        res.redirect("/students");         //If successfully added, redirect to the /students page
      })
      .catch((err) => {
        res.status(500).json({ error: err });  //If not, dispaly the error message.
      });
  });



app.post("/student/update", (req, res) => {
    const updatedStudent = req.body; // Get the submitted form data
    console.log("Received updated student data:", updatedStudent);
  
    collegeData.updateStudent(updatedStudent) // Call the updateStudent function with the data
      .then(() => {
        console.log("Student updated successfully");
        res.redirect("/students");
      })
      .catch((error) => {
        console.error("Error updating student:", error.message);
        res.redirect("/students");
      });
  });


app.use((req,res) =>{
    res.status(404).send("Page Not Found");    //Message if there is no matching routes
});

// setup http server to listen on HTTP_PORT
collegeData.initialize()
.then(() =>{
    app.listen(HTTP_PORT,()=>{console.log("Server listening on port:"+HTTP_PORT)
});
})
.catch((err) => {

    console.error("Error initializin data.",err);   //Message to dispaly if the data initialization fails.
});
