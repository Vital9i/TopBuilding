from pathlib import Path
import re,json,gzip,base64,html,zipfile
import subprocess
p=Path.cwd();out=p.parent;(out/'plans').mkdir(parents=True,exist_ok=True);(out/'assets').mkdir(exist_ok=True)
# A compact, drawn Cyrillic signature; independent of fonts and network.
glyph={
'С':('M19 5 C8 -1 1 8 2 20 C3 29 14 29 19 22',22),
'у':('M2 11 L1 21 Q1 28 7 22 L12 11 L7 31 Q4 40 0 36 Q-2 31 7 27 L16 21',16),
'в':('M2 25 Q-1 9 8 1 Q15 -3 12 8 Q10 14 2 17 Q14 8 13 18 Q12 29 2 25 L17 21',17),
'е':('M1 19 Q14 17 11 12 Q7 7 2 16 Q-2 28 9 26 L16 21',16),
'р':('M3 12 L-1 37 M3 17 Q11 6 14 14 Q17 27 4 26 L18 21',18),
'н':('M3 11 L1 26 M2 19 L12 17 M14 11 L11 24 Q11 28 18 21',18),
'о':('M10 11 Q1 9 1 21 Q1 30 10 24 Q17 17 10 11 L17 15',16),
'с':('M12 12 Q4 7 1 19 Q-1 31 11 24 L16 21',16),
'т':('M2 25 L5 11 M4 17 Q10 7 12 13 L10 25 M12 16 Q19 6 21 13 L19 24 Q19 28 25 21',25),
'ь':('M4 11 L1 23 Q3 30 11 22 Q16 14 3 18 L17 21',17),
'ю':('M3 11 L1 26 M2 19 L9 18 M18 11 Q8 8 9 22 Q10 30 18 23 Q23 16 18 11 L26 17',25),
'б':('M16 1 Q7 5 5 3 Q-1 12 1 24 Q5 31 12 22 Q18 8 7 12 Q0 15 1 23 L18 21',18),
'д':('M11 11 Q1 7 1 20 Q1 31 11 22 L14 9 L9 33 Q5 41 1 35 Q-1 30 10 27 L18 21',18),
'щ':('M3 11 L1 23 Q2 30 9 20 L12 11 L9 23 Q10 30 17 20 L20 11 L17 25 Q20 29 21 35 M17 25 L25 21',25),
' ':('',9)}
parts=[];x=2
for i,c in enumerate('С уверенностью в будущее'):
 d,w=glyph[c];parts.append(f'<path d="{d}" transform="translate({x},0) skewX(-9)"/>');x+=w
signature=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -3 {x+10} 46"><g fill="none" stroke="#b38b3d" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">'+''.join(parts)+'</g></svg>'
(out/'assets/slogan.svg').write_text(signature)
(out/'assets/three.min.js').write_bytes((p.parent/'assets/three.min.js').read_bytes())
brand='<img class="tbSignature" src="assets/slogan.svg" alt="С уверенностью в будущее">'
css='.tbSignature{display:block;width:240px;height:30px;object-fit:contain;object-position:left;margin-top:3px}header small{color:#D4AF37!important;letter-spacing:.16em}header{background:#1a1d29!important}header h1{font-family:Georgia,serif}@media(max-width:900px){.tbSignature{width:195px;height:25px}}'
names=['classic100-tour-plan1.html','classic100-tour-plan2.html','classic100-tour-plan3(2).html','classic100-tour-plan4(3).html','classic100-tour-plan5(1).html']
for n,name in enumerate(names,1):
 src=(p/'originals'/name).read_text();shell=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',src);shell=shell.replace('</style>',css+'</style>',1).replace('</h1>','</h1>'+brand,1)
 code=(p/f'app{n}.js').read_text();insert="raw.forEach(r=>{r.target=Number(((r.cells||[r]).reduce((v,c)=>v+c.w*c.d,0)*scale*scale).toFixed(2));r.measured=true;});\n";code=code.replace('scene.add(new THREE.HemisphereLight',insert+'scene.add(new THREE.HemisphereLight',1).replace('Проектная площадь','Площадь в модели');app=code.encode();payload=base64.b64encode(gzip.compress(app,mtime=0)).decode()
 loader='<script src="assets/three.min.js"></script><script>(async()=>{try{if(!window.THREE)throw Error("engine");const b=Uint8Array.from(atob("'+payload+'"),c=>c.charCodeAt(0));const s=document.createElement("script");s.textContent=await new Response(new Blob([b]).stream().pipeThrough(new DecompressionStream("gzip"))).text();document.body.appendChild(s);}catch(e){document.getElementById("loading").textContent="Не удалось запустить тур. Проверьте папку assets и откройте в актуальном браузере.";console.error(e)}})();</script>'
 (out/f'classic100-tour-plan{n}.html').write_text(shell.replace('</body>',loader+'</body>'))
# Export exact top footprints in a shared editorial style, with model-derived floor areas.
for n in range(1,6):
 data=json.loads((p/f'scene{n}.json').read_text());W,D=data['W'],data['D'];k=min(930/(W+.6),780/(D+3.4));ox=65+(930-W*k)/2;oy=200
 def pt(x,z):return ox+x*k,oy+(D-z)*k
 elements=['<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1120" viewBox="0 0 1600 1120">','<rect width="1600" height="1120" fill="#faf8f3"/>','<rect width="1600" height="12" fill="#1a1d29"/>']
 def txt(x,y,t,size=20,fill='#1a1d29',anchor='start',weight='normal'):
  elements.append(f'<text x="{x}" y="{y}" fill="{fill}" font-family="DejaVu Sans,sans-serif" font-size="{size}" text-anchor="{anchor}" font-weight="{weight}">{html.escape(t)}</text>')
 txt(65,65,'TOP BUILDING',20,weight='bold');txt(65,123,'Классик 100',47);txt(1535,65,f'ПЛАНИРОВКА 0{n}',18,anchor='end');txt(1535,117,'100 м² · 1 этаж · 3 спальни',23,anchor='end');elements.append('<path d="M65 153 H1535" stroke="#D4AF37"/>')
 for obj in data['polygons']:
  pts=' '.join(f'{a:.2f},{b:.2f}' for a,b in [pt(*v) for v in obj['points']]);elements.append(f'<polygon points="{pts}" fill="{obj["color"]}" stroke="#303945" stroke-opacity=".12" stroke-width=".5"/>')
 entry=[5.15,5.05,7.35,6.72,6.625][n-1];ex,ey=pt(entry,D);elements.append(f'<path d="M{ex} {ey-25} V{ey-6} m-5 -6 l5 6 5 -6" fill="none" stroke="#aa8239" stroke-width="2"/>');txt(round(ex,2),round(ey-31,2),'ВХОД',11,'#aa8239','middle')
 rooms=data['rooms'];
 for i,r in enumerate(rooms,1):
  x,z=r['p'];a,b=pt(x,z);elements.append(f'<circle cx="{a:.2f}" cy="{b:.2f}" r="13" fill="#1a1d29" stroke="#d4af37" stroke-width="1.5"/>');txt(round(a,2),round(b+4.5,2),str(i),13,'#ffffff','middle','bold')
 txt(1060,228,'ПОМЕЩЕНИЯ',17,weight='bold');txt(1515,228,'м²',17,anchor='end');
 for i,r in enumerate(rooms,1):
  y=280+(i-1)*62
  elements.append(f'<path d="M1060 {y+24} H1515" stroke="#dfd9ce"/>');txt(1060,y,str(i),16,'#aa8239');name=r['name'].replace('Котельная-постирочная','Постирочная / котельная').replace('Прихожая-коридор','Прихожая / коридор');txt(1090,y,name,17);txt(1515,y,f'{r["area"]:.2f}'.replace('.',','),18,anchor='end')
 y=280+len(rooms)*62;elements.append(f'<rect x="1045" y="{y-24}" width="490" height="54" rx="4" fill="#1a1d29"/>');txt(1065,y+10,'Площадь помещений',18,'#ffffff');txt(1515,y+10,'100,00',22,'#D4AF37',anchor='end',weight='bold')
 txt(1060,y+67,'Терраса — отдельно от площади дома',15,'#686d76');txt(65,1040,'Расстановка и проёмы соответствуют 3D-туру №'+str(n)+'.',17);txt(65,1070,'Площади рассчитаны по модели. Эскиз для выбора планировки, не рабочий чертёж.',15,'#686d76')
 inner=signature[signature.index('<g'):signature.rindex('</svg>')];elements.append(f'<g transform="translate(1100,980) scale(.94)">{inner}</g>');elements.append('</svg>');svg=''.join(elements);(out/f'plans/classic100-plan{n}.svg').write_text(svg);subprocess.run(['inkscape',str(out/f'plans/classic100-plan{n}.svg'),'--export-type=png','--export-width=2000','--export-filename='+str(out/f'plans/classic100-plan{n}.png')],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
print('HTML sizes',[(f.name,f.stat().st_size) for f in out.glob('*.html')]);assert 30000<=(out/'classic100-tour-plan5.html').stat().st_size<=40000
