(function(){
const canvas = document.getElementById('chatCanvas');
if(!canvas) return;
const ctx = canvas.getContext('2d');
let w = 0, h = 0, dpr = window.devicePixelRatio || 1;
// boost mode control (triggered by the + button)
let boostUntil = 0; // timestamp in ms until which we accelerate generation

function resize(){
	dpr = window.devicePixelRatio || 1;
	// Clear inline sizes so CSS (including media queries) can recalc dimensions
	canvas.style.width = '';
	canvas.style.height = '';
	// Read computed CSS sizes (allowing our responsive CSS to take effect)
	const cs = getComputedStyle(canvas);
	const cssW = parseFloat(cs.width) || canvas.clientWidth || 0;
	const cssH = parseFloat(cs.height) || canvas.clientHeight || 0;
	w = Math.max(0, cssW);
	h = Math.max(0, cssH);
	// Lock CSS pixel size for stable drawing, then set device pixel dimensions
	canvas.style.width = w + 'px';
	canvas.style.height = h + 'px';
	canvas.width = Math.max(1, Math.round(w * dpr));
	canvas.height = Math.max(1, Math.round(h * dpr));
	// reset transform to map drawing coordinates to CSS pixels
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener('resize', resize);
// ensure resize runs after layout is stable
requestAnimationFrame(resize);

// easing helpers
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }
function easeOutElastic(t){
	const p = 0.3;
	return Math.pow(2, -10 * t) * Math.sin((t - p/4) * (2 * Math.PI) / p) + 1;
}

// Enhanced message class with reveal animations and animated profile block
class Msg {
	constructor(){
		this.w = 500;
		this.h = 0;
		this.maxH = 76 + Math.random()*64; // variable height
		this.x = 0; // computed each frame
		this.y = 0;
		this.created = performance.now();
		// profile color - more saturated range
		this.color = `hsl(${Math.floor(Math.random()*360)}, ${60 + Math.random()*20}%, ${45 + Math.random()*15}%)`;
		this.seed = Math.random();
		this.lines = 2 + Math.floor(Math.random()*2); // 2 or 3 lines
		this.nameWidth = 0; // animated
		this.age = 0;
	}
	update(t){
		this.age = (t - this.created)/1000; // seconds
		// determine reveal progress (fast pop then settle)
		const popDur = 0.45;
		const p = clamp(this.age / popDur, 0, 1);
		const pop = easeOutElastic(p < 1 ? p : 1);
		this.pop = pop; // used for visual bounce
		this.h = Math.min(this.maxH, this.maxH * (p));
		// name bar reveal slightly after pop starts
		this.nameWidth = easeOutCubic(clamp((this.age - 0.05)/0.35, 0, 1));
		return this.h > 0;
	}
	render(ctx, t){
		ctx.save();
		// bubble pop + slight rotation for new messages
		const rot = Math.sin((t - this.created)/300 + this.seed*10) * 0.02 * this.pop;
		const popOffset = -8 * this.pop; // slight upward pop
		ctx.translate(this.x + this.w*0.5, this.y + popOffset + this.h*0.5);
		ctx.rotate(rot);
		ctx.translate(- (this.x + this.w*0.5), - (this.y + popOffset + this.h*0.5));

		// bubble background
		ctx.fillStyle = 'rgba(20,20,20,0.08)';
		roundRect(ctx, this.x, this.y + popOffset, this.w, this.h, 10);
		ctx.fill();

		// profile: animated colored square that bounces/rotates
		const px = this.x + 12;
		const py = this.y + 12 + popOffset;
		const pSize = 40;
		// bounce + rotate for profile
		const bounce = Math.sin((t - this.created)/220 + this.seed*6) * 4 * (0.6 + 0.4*this.pop);
		const prot = Math.sin((t - this.created)/420 + this.seed*3) * 0.35 * (0.5 + 0.5*this.pop);
		ctx.save();
		ctx.translate(px + pSize/2, py + pSize/2 + bounce);
		ctx.rotate(prot);
		ctx.fillStyle = this.color;
		// draw slightly rounded square
		roundRect(ctx, -pSize/2, -pSize/2, pSize, pSize, 6);
		ctx.fill();
		// small highlight circle to hint at avatar
		ctx.fillStyle = 'rgba(255,255,255,0.12)';
		ctx.beginPath();
		ctx.arc(-pSize/4, -pSize/4, 6, 0, Math.PI*2);
		ctx.fill();
		ctx.restore();

		// name bar (white) with reveal animation
		const nameX = this.x + 64;
		const nameY = this.y + 14 + popOffset;
		const fullNameW = 120;
		ctx.fillStyle = 'rgba(255,255,255,0.96)';
		roundRect(ctx, nameX, nameY, fullNameW * this.nameWidth, 12, 6);
		ctx.fill();

		// text lines with progressive reveal
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		const lineBaseX = nameX;
		let lineY = this.y + 34 + popOffset;
		const maxLineW = Math.min(300, this.w - 84);
		for(let i=0;i<this.lines;i++){
			// stagger reveal for each line
			const delay = i * 0.08;
			const duration = 0.36;
			const prog = clamp((this.age - delay) / duration, 0, 1);
			const eased = easeOutCubic(prog);
			const lineW = maxLineW * eased;
			// draw rounded rectangle as text line
			roundRect(ctx, lineBaseX, lineY, lineW, 8, 4);
			ctx.fill();
			lineY += 12 + 6;
		}

		ctx.restore();
	}
}

function roundRect(ctx, x, y, w, h, r){
	ctx.beginPath();
	ctx.moveTo(x+r, y);
	ctx.arcTo(x+w, y, x+w, y+h, r);
	ctx.arcTo(x+w, y+h, x, y+h, r);
	ctx.arcTo(x, y+h, x, y, r);
	ctx.arcTo(x, y, x+w, y, r);
	ctx.closePath();
}

let messages = [];
let lastAdd = 0;

function loop(t){
	// clear whole canvas using CSS pixel size
	ctx.clearRect(0, 0, w, h);

	// layout messages bottom-up (leave 18px bottom padding)
	let cursorY = h - 18; // start from bottom padding
	for(let i = messages.length - 1; i >= 0; i--){
		const m = messages[i];
		if(!m.update(t)) continue;
		m.w = Math.min(520, w * 0.86);
		m.x = (w - m.w) * 0.5;
		// position so messages stack upward with 12px gap
		cursorY -= (m.h + 12);
		m.y = cursorY;
		m.render(ctx, t);
	}

	// accelerate generation while in boost mode
	const fast = (t < boostUntil);
	const interval = fast ? 140 : (700 + Math.random()*1000);
	if(t - lastAdd > interval){
		messages.push(new Msg());
		lastAdd = t;
		// limit
		const cap = fast ? 10 : 6;
		if(messages.length>cap) messages.shift();
	}

	requestAnimationFrame(loop);
}

// Bind the + button to trigger a short burst/boost directly within scope
const btn = document.querySelector('.footer-chat-wrapper .input-btn');
if(btn){
	const boostNow = (durationMs = 2500, burstCount = 2)=>{
		const now = performance.now();
		boostUntil = Math.max(boostUntil, now + durationMs);
		// Immediate burst messages
		for(let i=0;i<burstCount;i++){
			messages.push(new Msg());
		}
		// Cap to avoid overflow
		if(messages.length > 10) messages.splice(0, messages.length - 10);
		// Ensure next frame continues fast adds quickly
		lastAdd = -1e9;
	};
	btn.addEventListener('click', (e)=>{
		e.preventDefault();
		boostNow(2500, 2);
	});
}

requestAnimationFrame(loop);
})();
