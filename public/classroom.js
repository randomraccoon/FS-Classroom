const STUDENT_LIST = document.querySelector('.student-list');

window.onload = ()=>{
  const SORT_CAT_SELECT = document.querySelector('.sort-category');
  SORT_CAT_SELECT.addEventListener('change',sortStudents);
}

function sortStudents(ev) {
  let category = ev.target.value.toLowerCase();
  let students = room.students.sort((a,b) => a[category] > b[category]);
  STUDENT_LIST.innerHTML = "";
  for (let student of students) {
    STUDENT_LIST.innerHTML += `<a href="/classrooms/${room.id}/students/${student.id}">${student.name} - ${student.grade}</a>`;
  }
}
