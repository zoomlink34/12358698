const firebaseConfig = { databaseURL: "https://m-legacy-5cf2b-default-rtdb.firebaseio.com/" };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const mCanvas = document.getElementById('mainCanvas');
const fCanvas = document.getElementById('fireCanvas');
const mCtx = mCanvas.getContext('2d');
const fCtx = fCanvas.getContext('2d');

mCanvas.width = fCanvas.width = 10000; 
mCanvas.height = fCanvas.height = 10000;

let particles = [];
mCanvas.onmousemove = (e) => {
    const rect = mCanvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (rect.width/mCanvas.width);
    const y = (e.clientY - rect.top) / (rect.height/mCanvas.height);
    for(let i=0; i<6; i++) particles.push({x, y, vx:(Math.random()-0.5)*20, vy:(Math.random()-0.5)*20, life:25});
};

function animate() {
    fCtx.clearRect(0,0,10000,10000);
    particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.life--;
        fCtx.fillStyle = `rgba(0, 255, 204, ${p.life/25})`;
        fCtx.fillRect(p.x, p.y, 15, 15);
        if(p.life <= 0) particles.splice(i, 1);
    });
    requestAnimationFrame(animate);
}
animate();

db.ref('pixels').on('value', snap => {
    const data = snap.val() || {};
    Object.keys(data).forEach(id => {
        let p = data[id];
        let img = new Image(); img.src = p.imageUrl;
        img.onload = () => mCtx.drawImage(img, ((id-1)%160)*200, Math.floor((id-1)/160)*200, 200, 200);
    });
});

function searchHome() {
    let num = document.getElementById('searchSlot').value;
    if(num >= 1 && num <= 25600) alert("Navigating to Slot #" + num);
}
