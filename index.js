const express = require("express");
const Joi = require("joi");
const app = express();
//adding a piece of middleware to convert body in json objec
app.use(express.json());

app.use((req, res, next) => {
  console.log("Received request");
  next();
  console.log("After everything");
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
  });
  return schema.validate(course);
}

const courses = [
  {
    id: 1,
    name: "course1",
  },
  {
    id: 2,
    name: "course2",
  },
  {
    id: 3,
    name: "course3",
  },
];

//get method gets two arguments url and callback function
app.get("/", (req, res) => {
  res.send("Hello World");
});

const coursesRouter = express.Router(); // ideally this would go to another file

app.use("/api/courses", coursesRouter);

coursesRouter.get("/", (req, res) => {
  res.send(courses);
});

coursesRouter.get("/:id", (req, res) => {
  const singleCourse = courses.find((c) => c.id === parseInt(req.params.id));
  if (!singleCourse) {
    return res.status(404).send("Cours with this id was not found");
  }
  res.send(singleCourse);
});

//Creating a new course and add it on the courses object
coursesRouter.post("/", (req, res) => {
  const { error } = validateCourse(req.body);

  if (error) {
    return req.status(404).send(result.error.details[0].message);
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

coursesRouter.put("/:id", (req, res) => {
  //Look up for the course
  //If not existing return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send("Cours with this id was not found");
  }

  //Validate
  //If invalide retunr 400 - bad reques
  const { error } = validateCourse(req.body);
  if (error) {
    return req.status(404).send(result.error.details[0].message);
  }
  //Update Course
  course.name = req.body.name;
  //Return updated course
  res.send(course);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening in port ${port}`));

// app.post()
// app.put()
// app.delete()
//Input Validation
