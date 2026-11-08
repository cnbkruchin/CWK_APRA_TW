/*
 * ตั้งค่าโหมดออนไลน์ (Firebase Realtime Database) — ดูวิธีทำทีละขั้นใน ONLINE.md
 *
 * - ปล่อย apiKey / databaseURL ว่างไว้ = ใช้งานแบบออฟไลน์ในเครื่อง (เหมือนเดิม)
 * - ใส่ค่าจาก Firebase แล้ว = ทุกเครื่องที่เปิดลิงก์เดิมเห็นข้อมูลชุดเดียวกันแบบสด
 * - ค่าเหล่านี้ไม่ใช่รหัสลับ ใส่ใน GitHub ได้ ความปลอดภัยมาจาก Rules และ "รหัสโค้ช" ใน Firebase
 */
window.CWK_ONLINE = {
  apiKey: '',        // เช่น 'AIzaSy...'
  databaseURL: '',   // เช่น 'https://cwk-apra-default-rtdb.asia-southeast1.firebasedatabase.app'
  room: 'apra2026',  // ชื่อห้องข้อมูล เปลี่ยนเมื่อต้องการเริ่มรายการแข่งใหม่
};
