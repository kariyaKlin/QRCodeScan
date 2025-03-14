// เลือก video element
const videoElement = document.getElementById("preview");
const resultElement = document.getElementById("result");

// ฟังก์ชันสำหรับเริ่มใช้งานกล้อง
function startScanner() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // ขอการเข้าถึงกล้อง
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(function(stream) {
        // นำสตรีมของกล้องไปใช้กับ video element
        videoElement.srcObject = stream;

        // เริ่มเล่นวิดีโอ
        videoElement.play();

        // เรียกใช้ฟังก์ชันในการสแกน QR code
        requestAnimationFrame(scanQRCode);
      })
      .catch(function(error) {
        resultElement.textContent = "Error accessing camera: " + error.message;
      });
  } else {
    resultElement.textContent = "Camera not available on this device.";
  }
}

// ฟังก์ชันสแกน QR code
function scanQRCode() {
  if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
    // สร้าง canvas เพื่อจับภาพจาก video stream
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // รับข้อมูลภาพจาก canvas
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // ใช้ jsQR เพื่ออ่าน QR Code จากภาพ
    const decodedQR = jsQR(imageData.data, canvas.width, canvas.height);

    if (decodedQR) {
      // ถ้าพบ QR code จะแสดงผลลัพธ์
      resultElement.textContent = "QR Code Result: " + decodedQR.data;
    }
  }

  // เรียกการสแกนใหม่ต่อไป
  requestAnimationFrame(scanQRCode);
}

// เริ่มต้นการสแกนเมื่อหน้าเว็บโหลด
window.onload = startScanner;
