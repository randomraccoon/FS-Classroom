let fs = require('fs');
let bodyParser = require('body-parser');
let express = require('express');
let app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));
let port = process.env.PORT || 8000;

app.post('/classrooms/:classId/students/:studentId/scores/', (req, res)=>{
  let classId = parseInt(req.params.classId);
  let studentId = parseInt(req.params.studentId);
  let newScore = parseInt(req.body.newScore);
  if ((!newScore && newScore !== 0) || newScore < 0) {
    res.sendStatus(418);
    return;
  }
  fs.readFile('classrooms.json', 'utf8', (err, data) => {
    let classrooms = JSON.parse(data);

    // find student scores and push to array in classrooms
    let found = false;
    for (let r = 0; !found && r < classrooms.length; r++) {
      if (classrooms[r].id !== classId) continue;
      for (let s = 0; !found && s < classrooms[r].students.length; s++) {
        let thisStudent = classrooms[r].students[s];
        if (thisStudent.id !== studentId) continue;
        thisStudent.scores.push(newScore);
        found = true;
        thisStudent.grade = calculateGrade(thisStudent.scores);
      }
    }

    fs.writeFile('classrooms.json', JSON.stringify(classrooms,null,2), err=> {
      if (err) throw err;
      res.redirect(req.originalUrl.replace(/\/scores$/, '')); //TODO
    });
  });
});

app.get('/classrooms/:classId/students/:studentId', (req, res) => {
  let classId = parseInt(req.params.classId);
  let studentId = parseInt(req.params.studentId);
  fs.readFile('classrooms.json', 'utf8', (err, data) => {
    let classrooms = JSON.parse(data);
    let room = classrooms.filter(r => r.id === classId)[0];
    let student = room.students.filter(s => s.id === studentId)[0];
    if (!student) res.sendStatus(418);
    res.render('student', {
      classId: classId,
      student: student
    });
  });
});

app.get('/classrooms/:id', (req, res) => {
  let id = parseInt(req.params.id);
  fs.readFile('classrooms.json', 'utf8', (err, data) => {
    let classrooms = JSON.parse(data);
    let room = classrooms.filter(r => r.id === id)[0];
    if (!room) res.sendStatus(418);
    res.render('classroom', {
      room: room
    });
  });
});

app.get('/classrooms', (req, res) => {
  fs.readFile('classrooms.json', 'utf8', (err, data) => {
    let obj = JSON.parse(data);
    let classrooms = {
      classrooms: []
    };
    for (let room of obj) {
      classrooms.classrooms.push({
        id: room.id,
        subject: room.subject,
        classSize: room.students.length
      });
    }
    res.render('classrooms', classrooms);
  });

});

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log('Dang, you look nice! Nice x' + port + '.');
});

function calculateGrade(scores = []) {
  if (!scores.length) return '-';
  const percent = scores.reduce((a,b)=>a+b)/scores.length;
  if (percent >= 90) return 'A';
  if (percent >= 80) return 'B';
  if (percent >= 70) return 'C';
  if (percent >= 60) return 'D';
  return 'F';
}
