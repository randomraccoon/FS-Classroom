window.onload = ()=>{
  const NAV_BAR = document.querySelector('.nav-bar');
  const roomPath = window.location.pathname.replace(/\/student.*$/,'');
  NAV_BAR.innerHTML += `<a href="${roomPath}">Class</a>`;
}
