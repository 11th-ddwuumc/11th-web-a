const message = document.querySelector("#message");
const cheerButton = document.querySelector("#cheer-button");

cheerButton.addEventListener("click", function () {
  message.textContent = "느리더라도 포기하지 않고 꾸준히 나아가자! 아자아자!";
});
