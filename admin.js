if (sessionStorage.getItem("admin_auth") !== "true") {
  window.location.href = "index.html";
}

function logoutAdmin(){
  sessionStorage.removeItem("admin_auth");
  window.location.href = "index.html";
}
