(()=>{

const modules={resources:{title:'ทีมและทรัพยากร',sub:'ใครพร้อม และพร้อมทำงานอะไร',items:['ลงทะเบียนทีมกู้ภัย ยานพาหนะ และเครื่องจักร','แสดงข้อมูลผู้รับผิดชอบ คนใช้งาน อุปกรณ์ และข้อจำกัด','ให้ผู้รับผิดชอบทบทวนความพร้อมก่อนจัดงาน — การมีทรัพยากรยังไม่เท่ากับพร้อมปฏิบัติงาน']},supplies:{title:'สิ่งของและการส่งมอบ',sub:'ต้องการอะไร ของอยู่ไหน ใครรับต่อ',items:['เชื่อมความต้องการในพื้นที่กับสิ่งของที่มี เช่น อาหารแห้งและของจำเป็น','แสดงต้นทาง ปลายทาง และข้อมูลการจัดส่ง','ระบุผู้รับช่วงงานและข้อมูลที่ยังต้องยืนยัน']},shelter:{title:'คนและศูนย์พักพิง',sub:'มีคนเท่าไร และต้องดูแลอะไร',items:['รวบรวมจำนวนคนและความต้องการในศูนย์พักพิง','แยกยอดเจ้าหน้าที่ตรวจนับออกจากยอดยืนยันตัว','ให้ความสำคัญกับการเริ่มใช้งานของเจ้าหน้าที่ โดยยังไม่มีผลทดสอบยืนยันว่าเริ่มใช้งานได้เร็ว']}};
const dialog=document.querySelector('dialog');let opener;
document.querySelectorAll('[data-module]').forEach(button=>button.addEventListener('click',()=>{opener=button;const data=modules[button.dataset.module];dialog.querySelector('h3').textContent=data.title;dialog.querySelector('.dialog-sub').textContent=data.sub;dialog.querySelector('ul').replaceChildren(...data.items.map(text=>{const li=document.createElement('li');li.textContent=text;return li}));dialog.showModal()}));
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>opener?.focus());

})();