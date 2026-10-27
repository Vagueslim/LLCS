const shareButton = document.getElementById("share-button");
const shareStatus = document.getElementById("share-status");
const shareFallback = document.getElementById("share-fallback");
const shareText = document.getElementById("share-text");
// Canonical is the intended public destination; never copy localhost.
const shareMessage = [
  "พร้อมช่วย ≠ พร้อมปฏิบัติงาน",
  "ชวนดู LCCS — Life Connection Crisis System แนวคิดเชื่อมคน ข้อมูล และทรัพยากรในภาวะวิกฤต",
  document.querySelector('link[rel="canonical"]').href
].join("\n");
shareText.value = shareMessage;
shareButton.addEventListener("click", async () => {
  shareButton.disabled = true;
  shareStatus.textContent = "";
  try {
    await navigator.clipboard.writeText(shareMessage);
    shareFallback.hidden = true;
    shareStatus.textContent = "คัดลอกข้อความและลิงก์แล้ว";
  } catch {
    shareFallback.hidden = false;
    shareText.focus();
    shareText.select();
    shareStatus.textContent = "คัดลอกอัตโนมัติไม่ได้ กรุณาคัดลอกข้อความด้านล่าง";
  } finally {
    shareButton.disabled = false;
  }
});

// Progressive motion: content stays visible if scripts or observers fail.
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const motionTargets = document.querySelectorAll(".hero-art, .principles, .problem-grid, .closing");
let revealObserver;
function stopMotion() {
  revealObserver?.disconnect();
  motionTargets.forEach(target => target.classList.remove("motion-enter"));
  document.getAnimations().forEach(animation => animation.cancel());
}
if (!motionPreference.matches && "IntersectionObserver" in window) {
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add("motion-enter");
      revealObserver.unobserve(entry.target);
    }
  }, {threshold: .12});
  motionTargets.forEach(target => revealObserver.observe(target));
}
motionPreference.addEventListener("change", event => { if(event.matches) stopMotion(); });
window.addEventListener("pagehide", stopMotion, {once:true});

// Bridge the actual arrow exit/entry points in the cropped artwork.
const journey = document.querySelector(".concept-journey");
if (journey) {
  const ns = "http://www.w3.org/2000/svg";
  const layer = document.createElementNS(ns, "svg");
  layer.classList.add("concept-connectors");
  layer.setAttribute("aria-hidden", "true");
  layer.setAttribute("focusable", "false");
  const paths = [0,1].map(() => {
    const path = document.createElementNS(ns,"path");
    layer.append(path); return path;
  });
  journey.append(layer);
  const crops = [...journey.querySelectorAll(".concept-crop")];
  const point = (crop, sourceX, sourceY) => {
    const rect = crop.getBoundingClientRect();
    const parent = journey.getBoundingClientRect();
    const box = crop.viewBox.baseVal;
    return {x:rect.left-parent.left+(sourceX-box.x)*rect.width/box.width,
      y:rect.top-parent.top+(sourceY-box.y)*rect.height/box.height};
  };
  const drawConnections = () => {
    if (!crops[0]?.getBoundingClientRect().width) return;
    const bounds = journey.getBoundingClientRect();
    layer.setAttribute("viewBox", "0 0 "+bounds.width+" "+bounds.height);
    const anchors = [[point(crops[0],571,660),point(crops[1],559,650)],
                     [point(crops[1],540,1070),point(crops[2],563,990)]];
    anchors.forEach(([a,b],index) => {
      if (window.matchMedia("(max-width:600px)").matches) {
        // Follow the outer gutter while the explanation sits between scenes.
        const lane=bounds.width-3, bend=14;
        paths[index].setAttribute("d",
          "M "+a.x+" "+a.y+" C "+a.x+" "+(a.y+bend)+" "+lane+" "+(a.y+bend)+" "+lane+" "+(a.y+30)+
          " L "+lane+" "+(b.y-30)+" C "+lane+" "+(b.y-bend)+" "+b.x+" "+(b.y-bend)+" "+b.x+" "+b.y);
      } else {
        const reach=(b.y-a.y)*0.4;
        const slopes=index===0?[1.1,1.1]:[-0.4,-0.3];
        paths[index].setAttribute("d","M "+a.x+" "+a.y+" C "+(a.x+slopes[0]*reach)+" "+(a.y+reach)+" "+(b.x-slopes[1]*reach)+" "+(b.y-reach)+" "+b.x+" "+b.y);
      }
    });
  };
  const connectorObserver = new ResizeObserver(drawConnections);
  connectorObserver.observe(journey);
  crops.forEach(crop => connectorObserver.observe(crop));
  document.fonts.ready.then(drawConnections);
  window.addEventListener("pageshow",drawConnections);
}
