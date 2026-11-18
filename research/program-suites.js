(()=>{

const modules={resources:{title:'ทีมและทรัพยากร',sub:'ใครพร้อม และพร้อมทำงานอะไร — มองคนใช้งาน อุปกรณ์ และข้อจำกัดควบคู่กับทรัพยากรที่มี',items:['ลงทะเบียนทีมกู้ภัย ยานพาหนะ และเครื่องจักร','แสดงข้อมูลผู้รับผิดชอบ คนใช้งาน อุปกรณ์ และข้อจำกัด','ให้ผู้รับผิดชอบทบทวนความพร้อมก่อนจัดงาน — การมีทรัพยากรยังไม่เท่ากับพร้อมปฏิบัติงาน']},supplies:{title:'สิ่งของและการส่งมอบ',sub:'ต้องการอะไร ของอยู่ไหน ใครรับต่อ — เชื่อมความต้องการกับสิ่งของ การขนส่ง และผู้รับช่วงงาน',items:['เชื่อมความต้องการในพื้นที่กับสิ่งของที่มี เช่น อาหารแห้งและของจำเป็น','แสดงต้นทาง ปลายทาง และข้อมูลการจัดส่ง','ระบุผู้รับช่วงงานและข้อมูลที่ยังต้องยืนยัน']},shelter:{title:'คนและศูนย์พักพิง',sub:'มีคนเท่าไร และต้องดูแลอะไร — แยกยอดเจ้าหน้าที่ตรวจนับกับยอดยืนยันตัว พร้อมความต้องการดูแล',items:['รวบรวมจำนวนคนและความต้องการในศูนย์พักพิง','แยกยอดเจ้าหน้าที่ตรวจนับออกจากยอดยืนยันตัว','ให้ความสำคัญกับการเริ่มใช้งานของเจ้าหน้าที่ โดยยังไม่มีผลทดสอบยืนยันว่าเริ่มใช้งานได้เร็ว']}};
const dialog=document.querySelector('dialog');let opener;
const moduleItems=dialog.querySelector('ul');
const supportsModuleScenes=moduleItems.classList.contains('module-items');
const moduleScenes={resources:[
  {src:'research/assets/resource-registration-3d-v1.png',alt:'ภาพประกอบแนวคิดทีมกู้ภัยลงทะเบียนกับเจ้าหน้าที่ พร้อมยานพาหนะและเครื่องจักร'},
  {src:'research/assets/resource-details-3d-v1.png',alt:'ภาพประกอบแนวคิดการรวบรวมข้อมูลผู้รับผิดชอบ คนใช้งาน อุปกรณ์ และข้อจำกัดของทรัพยากร'},
  {src:'research/assets/resource-readiness-3d-v1.png',alt:'ภาพประกอบแนวคิดผู้รับผิดชอบร่วมกันทบทวนข้อมูลความพร้อมก่อนจัดงาน'}
],supplies:[
  {src:'research/assets/supplies-needs-3d-v1.png',alt:'ภาพประกอบแนวคิดเจ้าหน้าที่ทบทวนความต้องการในพื้นที่ร่วมกับอาหารแห้งและสิ่งของจำเป็นที่มี'},
  {src:'research/assets/supplies-dispatch-3d-v1.png',alt:'ภาพประกอบแนวคิดการทบทวนต้นทาง ปลายทาง และข้อมูลจัดส่งสิ่งของกับทีมขนส่ง'},
  {src:'research/assets/supplies-handover-3d-v1.png',alt:'ภาพประกอบแนวคิดผู้ส่งและผู้รับช่วงงานทบทวนสิ่งของและข้อมูลที่ยังต้องยืนยัน'}
],shelter:[
  {src:'research/assets/shelter-needs-3d-v1.png',alt:'ภาพประกอบแนวคิดเจ้าหน้าที่รวบรวมจำนวนคนและความต้องการดูแลในศูนย์พักพิง'},
  {src:'research/assets/shelter-counts-3d-v1.png',alt:'ภาพประกอบแนวคิดเจ้าหน้าที่ทบทวนข้อมูลสองชุด โดยแยกยอดตรวจนับออกจากยอดยืนยันตัว'},
  {src:'research/assets/shelter-staff-start-3d-v1.png',alt:'ภาพประกอบแนวคิดเจ้าหน้าที่เรียนรู้การเริ่มใช้งานเครื่องมือร่วมกับผู้แนะนำ'}
]};
function renderModuleItems(data,scenes){
  const withScenes=Boolean(scenes);
  dialog.classList.toggle('has-module-scenes',withScenes);
  moduleItems.classList.toggle('module-scene-grid',withScenes);
  moduleItems.replaceChildren(...data.items.map((text,index)=>{
    const li=document.createElement('li');
    if(!withScenes){li.textContent=text;return li}
    li.className='module-scene';
    const figure=document.createElement('figure');
    const img=document.createElement('img');
    img.src=scenes[index].src;
    img.alt=scenes[index].alt;
    img.width=1536;
    img.height=1024;
    img.decoding='async';
    const caption=document.createElement('figcaption');
    const number=document.createElement('span');
    number.className='module-scene-number';
    number.textContent=String(index+1).padStart(2,'0');
    number.setAttribute('aria-hidden','true');
    const description=document.createElement('p');
    description.textContent=text;
    caption.append(number,description);
    figure.append(img,caption);
    li.append(figure);
    return li;
  }));
}
document.querySelectorAll('[data-module]').forEach(button=>button.addEventListener('click',()=>{
  opener=button;
  const data=modules[button.dataset.module];
  dialog.querySelector('h3').textContent=data.title;
  dialog.querySelector('.dialog-sub').textContent=data.sub;
  renderModuleItems(data,supportsModuleScenes?moduleScenes[button.dataset.module]:null);
  dialog.showModal();
  dialog.scrollTop=0;
}));
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{
  if(dialog.classList.contains('has-module-scenes')){
    moduleItems.replaceChildren();
    moduleItems.classList.remove('module-scene-grid');
    dialog.classList.remove('has-module-scenes');
  }
  opener?.focus();
});

})();
