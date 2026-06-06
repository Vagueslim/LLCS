# LCCS - Life Connection Crisis System

เว็บไซต์ต้นแบบหน้าเดียวสำหรับอธิบาย LCCS ในฐานะระบบประสานงานภัยพิบัติที่เชื่อมสัญญาณจากประชาชน หน่วยงานรัฐ ทีมกู้ภัย ศูนย์พักพิง ทรัพยากร เงินช่วยเหลือ และประกันภัยให้เป็นภาพปฏิบัติการเดียว

## วิธีเปิดดูในเครื่อง

เปิดไฟล์ `index.html` ได้โดยตรงในเบราว์เซอร์ หรือใช้ local static server เพื่อให้ iframe และการตรวจ prototype ทำงานใกล้เคียง GitHub Pages:

```bash
python -m http.server 4173
```

จากนั้นเปิด:

```txt
http://localhost:4173/
```

ถ้ารันจากโฟลเดอร์หลักของโปรเจกต์ ให้เปิด:

```txt
http://localhost:4173/lccs-onepage/
```

## โครงสร้างไฟล์

```txt
lccs-onepage/
  index.html
  styles.css
  app.js
  data/
    cases.js
  prototypes/
    LCCS_Rapid_Onboarding_MCP.html
    LCCS_Stakeholder_Registration_ORC_Chart.html
    LCCS_Onboarding_Activity_Diagrams.html
    LCCS_Government_Console_API_User_Journey.html
    lccs_phone_simulation_actors.html
    lccs_shelter_checkin_family_search.html
  assets/
    placeholder-map.svg
    placeholder-network.svg
    lccs-layer-model.png
    lccs-route-map.png
    lccs-operational-gis.png
```

## วิธีอัปโหลดขึ้น GitHub Pages

1. นำโฟลเดอร์ `lccs-onepage` ไปไว้ใน repository
2. ตั้งค่า GitHub Pages ให้ publish จาก branch ที่ต้องการ
3. ถ้า publish จาก root ของ repository ให้ย้ายไฟล์ใน `lccs-onepage` ไปไว้ที่ root หรือเลือก publish จากโฟลเดอร์ที่ตรงกับโครงสร้าง repository
4. ตรวจสอบว่า path ของไฟล์ prototype ยังอยู่ใน `prototypes/` และ path ของ asset ยังอยู่ใน `assets/`

## วิธีเพิ่ม prototype HTML

วางไฟล์ HTML เพิ่มในโฟลเดอร์ `prototypes/` แล้วเพิ่มปุ่มใหม่ในส่วน `Prototype Playground` ของ `index.html` โดยระบุ `data-src` ให้ตรงกับ path ของไฟล์

ถ้าไฟล์ prototype ไม่มีอยู่ ระบบจะแสดงข้อความ:

```txt
Prototype file not found. Add this file to /prototypes/ to enable live preview.
```

## วิธีเพิ่มภาษาอังกฤษภายหลัง

ข้อมูล case อยู่ใน `data/cases.js` เพื่อแยกเนื้อหาออกจาก UI หลัก สามารถเพิ่ม field ภาษาอังกฤษ เช่น `titleEn`, `summaryEn`, `layersEn` คู่กับ field ภาษาไทยเดิม แล้วปรับ `app.js` ให้เลือกภาษาตามตัวแปรภาษาในอนาคต

สำหรับข้อความคงที่ใน `index.html` แนะนำให้ย้ายไปเป็น object ภาษาในไฟล์ข้อมูลใหม่ เช่น `data/i18n.js` เมื่อเริ่มทำระบบสองภาษา

## หมายเหตุด้านข้อมูล

ตัวเลขใน prototype ใช้เพื่อออกแบบการสื่อสารและโครงสร้างข้อมูล ต้องตรวจสอบก่อนใช้เผยแพร่ทางการ โดยเฉพาะข้อมูลประกันภัยให้ใช้คำว่า `reported claims`, `insured-loss estimate`, `not final paid amount`, `working figure` และ `verify before official publication`
