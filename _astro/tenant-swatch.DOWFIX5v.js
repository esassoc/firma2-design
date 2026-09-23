const s=t=>`oklch(${.62} ${.13} ${t})`,e=(t,a)=>{const n=Math.abs(((t-a)%360+360)%360);return n>180?360-n:n},o=(t,a)=>t.reduce((n,c)=>n===null||e(c.hue,a)<e(n.hue,a)?c:n,null);export{o as n,s as t};
