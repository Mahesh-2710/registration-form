let clickCount = 0;

const whatsappBtn = document.getElementById('whatsappBtn');
const counter = document.getElementById('counter');
const form = document.getElementById('regForm');
const message = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

// 🔁 Replace this with your real Web App URL from Apps Script
const scriptURL = "https://script.google.com/macros/s/AKfycbzdOkuo6QTAroCqTr-ckuCSuAN25qlY1k8QKxU8igWeLC1hqWWvbgHzELeAiId_DLS11A/exec";


// 🛑 Prevent multiple submissions
if (localStorage.getItem('submitted') === 'true') {
  disableForm();
}

// ▶️ WhatsApp Sharing Logic
whatsappBtn.addEventListener('click', () => {
  if (clickCount < 5) {
    clickCount++;
    counter.textContent = `Click count: ${clickCount}/5`;
    
    const message = encodeURIComponent("Hey Buddy, Join Tech For Girls Community!");
    const whatsappURL = `https://wa.me/?text=${message}`;
    window.open(whatsappURL, '_blank');

    if (clickCount === 5) {
      alert("Sharing complete. Please continue.");
    }
  }
});

// ▶️ Form Submit Logic
form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (clickCount < 5) {
    alert("Please complete WhatsApp sharing (5/5 clicks).");
    return;
  }

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const college = document.getElementById('college').value.trim();
  const fileInput = document.getElementById('screenshot');
  const file = fileInput.files[0];

  if (!file) {
    alert("Please upload a screenshot.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    const base64 = event.target.result.split(',')[1];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("college", college);
    formData.append("fileName", file.name);
    formData.append("fileType", file.type);
    formData.append("fileData", base64);

    fetch(scriptURL, {
      method: "POST",
      body: formData
    })
      .then(response => response.text())
      .then(result => {
        console.log("Success:", result);
        message.style.display = "block";
        localStorage.setItem("submitted", "true");
        disableForm();
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
      });
  };

  reader.readAsDataURL(file);
});

// 🔒 Disable Form After Submission
function disableForm() {
  document.querySelectorAll("input, button").forEach(el => el.disabled = true);
  message.style.display = "block";
}
