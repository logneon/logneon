import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js';

// A sunlit alpine waterfront. All geometry and textures are local and procedural.
export function createEnvironment(scene, renderer) {
  let seed=8721;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const range=(a,b)=>a+(b-a)*random();
  const color=c=>new THREE.Color(c);
  const sunDirection=new THREE.Vector3(.45,.38,.80).normalize();
  scene.fog=new THREE.FogExp2('#b0d8e6',.00165);

  const skyMaterial=new THREE.ShaderMaterial({
    side:THREE.BackSide,depthWrite:false,toneMapped:false,uniforms:{uTime:{value:0},uSun:{value:sunDirection}},
    vertexShader:`varying vec3 vDirection; void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`
      varying vec3 vDirection;uniform float uTime;uniform vec3 uSun;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=noise(p)*a;p=mat2(1.6,1.2,-1.2,1.6)*p+13.7;a*=.5;}return v;}
      void main(){
        vec3 d=normalize(vDirection);float elevation=max(d.y,0.);
        vec3 horizon=vec3(.18,.62,.90),zenith=vec3(.002,.025,.24);
        vec3 sky=mix(horizon,zenith,pow(clamp(elevation*1.65,0.,1.),.40));
        float sunDot=max(dot(d,uSun),0.);
        sky+=vec3(1.,.75,.38)*pow(sunDot,28.)*.22;
        sky+=vec3(1.,.91,.70)*pow(sunDot,280.)*.7;
        sky+=vec3(3.,2.7,2.)*smoothstep(.9992,.9997,sunDot);
        if(d.y>.018){
          vec2 p=d.xz/(d.y+.19)*2.6+vec2(uTime*.003,0.);
          float shape=fbm(p),detail=fbm(p*3.2);
          float density=smoothstep(.47,.68,shape*.82+detail*.18);
          float lighting=clamp((fbm(p-vec2(.085,.13))-shape)*8.+.7,.2,1.);
          vec3 cloud=mix(vec3(.42,.59,.72),vec3(1.,.97,.91),lighting);
          cloud+=pow(1.-density,4.)*vec3(.14,.15,.14);
          float fade=smoothstep(.018,.08,d.y);
          sky=mix(sky,cloud,density*fade);
          float wisps=smoothstep(.57,.77,fbm(p*1.7+45.))*smoothstep(.18,.6,d.y)*.2;
          sky=mix(sky,vec3(.8,.88,.97),wisps);
        }
        gl_FragColor=vec4(sky,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  const sky=new THREE.Mesh(new THREE.SphereGeometry(1500,32,20),skyMaterial);sky.frustumCulled=false;sky.renderOrder=-10;scene.add(sky);
  scene.background=null;

  // A compact environment texture gives glass and paint blue-sky reflections.
  const envCanvas=document.createElement('canvas');envCanvas.width=512;envCanvas.height=256;
  const ec=envCanvas.getContext('2d'),eg=ec.createLinearGradient(0,0,0,256);
  eg.addColorStop(0,'#196aaf');eg.addColorStop(.35,'#9edcf3');eg.addColorStop(.5,'#e6f4ed');eg.addColorStop(.56,'#7caa84');eg.addColorStop(1,'#344d4a');ec.fillStyle=eg;ec.fillRect(0,0,512,256);
  for(let i=0;i<35;i++){ec.fillStyle='rgba(255,255,244,.22)';ec.beginPath();ec.ellipse(random()*512,25+random()*75,15+random()*50,3+random()*9,0,0,Math.PI*2);ec.fill();}
  const envTexture=new THREE.CanvasTexture(envCanvas);envTexture.mapping=THREE.EquirectangularReflectionMapping;envTexture.colorSpace=THREE.SRGBColorSpace;
  const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromEquirectangular(envTexture).texture;envTexture.dispose();pmrem.dispose();scene.environmentIntensity=.75;

  const unitBox=new THREE.BoxGeometry(1,1,1),materials=new Map();
  function material(c,metal=0){const key=c+metal;if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color:c,roughness:metal?.3:.9,metalness:metal}));return materials.get(key);}
  function box(parent,w,h,d,x,y,z,c,metal=0){const m=new THREE.Mesh(unitBox,material(c,metal));m.scale.set(w,h,d);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}

  // Soft cloud billboards, with noisy silhouettes and shaded sunlit lobes.
  const cloudCanvas=document.createElement('canvas');cloudCanvas.width=512;cloudCanvas.height=256;
  const cc=cloudCanvas.getContext('2d'),cloudPixels=cc.createImageData(512,256);
  const puffs=Array.from({length:18},(_,i)=>({x:70+i*21+range(-18,18),y:130-Math.sin(i/17*Math.PI)*55+range(-16,16),rx:range(33,62),ry:range(31,59)}));
  puffs.push({x:256,y:140,rx:174,ry:43},{x:230,y:103,rx:77,ry:64},{x:300,y:116,rx:71,ry:55});
  function hash(x,y){const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);}
  function noise(x,y){let ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);return THREE.MathUtils.lerp(THREE.MathUtils.lerp(hash(ix,iy),hash(ix+1,iy),fx),THREE.MathUtils.lerp(hash(ix,iy+1),hash(ix+1,iy+1),fx),fy);}
  for(let y=0;y<256;y++)for(let x=0;x<512;x++){
    let density=0;for(const p of puffs){const d=((x-p.x)/p.rx)**2+((y-p.y)/p.ry)**2;density=Math.max(density,1-d);}
    const n=noise(x*.035,y*.035)*.55+noise(x*.095,y*.095)*.3+noise(x*.23,y*.23)*.15;
    const alpha=THREE.MathUtils.smoothstep(density+(n-.5)*.34,0,.3);const shade=THREE.MathUtils.clamp((y-70)/110,0,1)*.25+(1-n)*.085;
    const at=(y*512+x)*4;cloudPixels.data[at]=255-shade*150;cloudPixels.data[at+1]=255-shade*105;cloudPixels.data[at+2]=255-shade*55;cloudPixels.data[at+3]=alpha*252;
  }
  cc.putImageData(cloudPixels,0,0);const cloudTexture=new THREE.CanvasTexture(cloudCanvas);cloudTexture.colorSpace=THREE.SRGBColorSpace;
  const clouds=new THREE.Group(),transform=new THREE.Object3D();
  for(let i=0;i<11;i++){const cm=new THREE.SpriteMaterial({map:cloudTexture,transparent:true,depthWrite:false,fog:false,toneMapped:false});const puff=new THREE.Sprite(cm);puff.position.set((i-5)*190,range(125,235),range(650,1050));const width=range(180,290);puff.scale.set(width,width*.5,1);clouds.add(puff);}scene.add(clouds);

  // Rugged continuous ridgelines, with altitude-based snow and rock colouring.
  const mountainGeometry=new THREE.PlaneGeometry(2900,850,150,44);mountainGeometry.rotateX(-Math.PI/2);
  const pos=mountainGeometry.attributes.position,vertexColors=[];
  function ridge(x){return 95+Math.pow(Math.abs(Math.sin(x*.0037+.8)),3)*190+Math.pow(Math.abs(Math.sin(x*.0081)),6)*95;}
  for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i),depth=(z+425)/850;const rough=Math.sin(x*.034+z*.027)*13+Math.sin(x*.083-z*.053)*6;
    const height=-32+Math.sin(Math.PI*depth)*ridge(x)+rough*Math.sin(Math.PI*depth);pos.setY(i,height);
    const c=color(height>178+Math.sin(x*.025)*16?'#e4eef0':height>105?'#7d979a':height>50?'#527f80':'#639589');c.multiplyScalar(.93+random()*.13);vertexColors.push(c.r,c.g,c.b);}
  mountainGeometry.setAttribute('color',new THREE.Float32BufferAttribute(vertexColors,3));mountainGeometry.computeVertexNormals();
  const mountains=new THREE.Mesh(mountainGeometry,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,metalness:0,fog:false}));mountains.position.set(0,-7,1100);mountains.scale.y=.72;scene.add(mountains);

  // Lake surface with animated wave normals and glints; the road remains level.
  const waterMaterial=new THREE.ShaderMaterial({uniforms:{uTime:{value:0}},transparent:false,
    vertexShader:`varying vec3 vWorld;void main(){vec4 w=modelMatrix*vec4(position,1.);vWorld=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader:`varying vec3 vWorld;uniform float uTime;
    void main(){vec2 p=vWorld.xz;float a=sin(p.x*.16+p.y*.24+uTime*1.2);float b=sin(p.x*.41-p.y*.32+uTime*.7);float c=sin(p.x*.073+p.y*.057-uTime*.3);float wave=a*.45+b*.2+c*.35;vec3 col=mix(vec3(.018,.29,.40),vec3(.035,.62,.68),wave*.5+.5);float glint=pow(max(0.,sin(p.x*.65+p.y*.7+uTime)*sin(p.x*.29-p.y*.16)),18.);col+=vec3(.6,.8,.75)*glint*.65;float haze=smoothstep(280.,1450.,distance(cameraPosition,vWorld));col=mix(col,vec3(.55,.77,.82),haze*.8);gl_FragColor=vec4(col,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    }`});
  const lake=new THREE.Mesh(new THREE.PlaneGeometry(2800,2600),waterMaterial);lake.rotation.x=-Math.PI/2;lake.position.set(0,-31,650);scene.add(lake);
  // Raised landscaped banks and a waterfront district below the highway.
  box(scene,420,7,1800,258,-29,730,'#75946c');box(scene,65,1.2,1400,0,-1.15,540,'#608754');
  for(const side of [-1,1]){box(scene,21,.3,1400,side*18.5,-.55,540,'#789254');box(scene,.65,.32,1400,side*8.05,-.12,540,'#d1c8aa');box(scene,2.8,.2,1400,side*10.25,-.3,540,'#c9bf9b');}
  box(scene,2,.3,1800,48,-25.2,730,'#e5d6b5');

  // Window texture has hundreds of lit / reflective panes with thin mullions.
  function facadeTexture(base){const canvas=document.createElement('canvas');canvas.width=128;canvas.height=256;const c=canvas.getContext('2d');c.fillStyle=base;c.fillRect(0,0,128,256);
    for(let y=0;y<256;y+=16)for(let x=0;x<128;x+=16){c.fillStyle=['#427b99','#689dae','#9ebfbd','#2a617e','#d9d9ae'][Math.floor(random()*5)];c.fillRect(x+2,y+2,12,12);c.fillStyle='#effff329';c.fillRect(x+3,y+2,2,11);}
    const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());return t;}
  const glass=[new THREE.MeshStandardMaterial({map:facadeTexture('#a5c2c2'),color:'#b2e0e9',metalness:.58,roughness:.26}),new THREE.MeshStandardMaterial({map:facadeTexture('#e6dccc'),color:'#e9e2d0',metalness:.4,roughness:.32}),new THREE.MeshStandardMaterial({map:facadeTexture('#467888'),color:'#71b9cb',metalness:.6,roughness:.23})];
  const city=new THREE.Group();scene.add(city);const buildings=[];
  for(let i=0;i<106;i++){
    const g=new THREE.Group(),h=range(18,76)*(i%13===0?1.5:1),w=range(9,19),d=range(10,23),side=i%4===0?-1:1;
    g.position.set(side*(range(62,310)), -25,range(60,1120));const baseZ=g.position.z;
    const tower=new THREE.Mesh(unitBox,glass[i%3]);tower.scale.set(w,h,d);tower.position.y=h/2;tower.castShadow=true;tower.receiveShadow=true;g.add(tower);
    box(g,w+2.4,2,d+2.4,0,1,0,'#e9dfc8');box(g,w+1,.7,d+1,0,h,0,'#f0eadc');
    if(i%3===0){box(g,w*.75,7,d*.76,0,h+3.6,0,'#a7c5c5',.5);box(g,w*.82,.5,d*.82,0,h+7.3,0,'#e4e9d6');}
    for(const x of [-w/2,w/2])box(g,.4,h+.4,d+.3,x,h/2,0,'#e6e5d8');
    if(i%4===0)for(let y=10;y<h-2;y+=9){box(g,w+1,.38,d+1,0,y,0,'#dedecb');box(g,w*.65,.5,1,0,y+.3,-d/2-.2,'#497846');}
    if(i%9===0)box(g,.26,13,.26,0,h+7,0,'#d3ded6',.5);
    city.add(g);buildings.push({mesh:g,z:baseZ});
  }
  // A recognisable waterfront landmark: tapering glass tower and crown.
  const landmark=new THREE.Group();landmark.position.set(125,-25,440);city.add(landmark);
  for(let i=0;i<6;i++){const size=26-i*2.4;const m=new THREE.Mesh(unitBox,glass[2]);m.scale.set(size,20,size);m.position.y=10+i*19;landmark.add(m);box(landmark,size+1,.7,size+1,0,20+i*19,0,'#d8e9dd');}
  box(landmark,1,30,1,0,129,0,'#e3ecdb',.55);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(18,.55,8,48),material('#e0f0dc',.4));ring.rotation.x=Math.PI/2;ring.position.y=94;landmark.add(ring);
  // Harbour promenades, piers and sailboats.
  const piers=[];for(let i=0;i<12;i++){const z=100+i*88;piers.push({mesh:box(scene,48,.8,5,23,-27,z,'#decaaa'),z});piers.push({mesh:box(scene,4,1,33,1,-27,z+14,'#e4d8b8'),z:z+14});}
  const boats=new THREE.Group();scene.add(boats);
  for(let i=0;i<14;i++){const g=new THREE.Group();g.position.set(range(-260,-65),-30.5,range(60,1000));box(g,2,.7,7,0,0,0,'#f3ecda');box(g,.12,10,.12,0,5,0,'#c3cbbf');const sailGeo=new THREE.BufferGeometry();sailGeo.setAttribute('position',new THREE.Float32BufferAttribute([0,1,0,0,10,0,0,1,4.1],3));sailGeo.computeVertexNormals();g.add(new THREE.Mesh(sailGeo,new THREE.MeshStandardMaterial({color:'#fff9e6',side:THREE.DoubleSide})));g.rotation.y=random();g.userData.startZ=g.position.z;boats.add(g);}

  // Instanced trees: detailed broadleaf crowns and layered alpine firs.
  const treeRecords=[];for(let i=0;i<190;i++){const side=i%2?1:-1;treeRecords.push({x:side*range(13,29),z:range(-40,1060),y:-.5,scale:range(.7,1.5),pine:i%4===0});}
  for(let i=0;i<95;i++)treeRecords.push({x:range(50,370),z:range(20,1150),y:-25,scale:range(.8,1.8),pine:i%3===0});
  const trunkGeo=new THREE.CylinderGeometry(.13,.24,1,7),leafGeo=new THREE.IcosahedronGeometry(1,1),pineGeo=new THREE.ConeGeometry(1,1,9);
  const trunks=new THREE.InstancedMesh(trunkGeo,material('#7c6850'),treeRecords.length),leaves=new THREE.InstancedMesh(leafGeo,new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1}),treeRecords.length*13),firs=new THREE.InstancedMesh(pineGeo,new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1}),treeRecords.length*4);
  const leafParts=[],firParts=[];
  treeRecords.forEach((t,index)=>{if(t.pine){for(let j=0;j<4;j++)firParts.push({tree:index,x:0,y:2.7+j*1.3,z:0,sx:2.2-j*.35,sy:3.5-j*.28,sz:2.2-j*.35,c:['#325e46','#3c704d','#54834f'][j%3]});}else{for(let j=0;j<13;j++)leafParts.push({tree:index,x:range(-1.8,1.8),y:range(3.2,5.8),z:range(-1.65,1.65),sx:range(1.1,1.85),sy:range(1.2,1.9),sz:range(1.1,1.9),c:['#4d793d','#679545','#3a6e3c','#83a352','#567f35'][j%5]});}});
  leaves.count=leafParts.length;firs.count=firParts.length;trunks.castShadow=leaves.castShadow=firs.castShadow=true;trunks.receiveShadow=leaves.receiveShadow=firs.receiveShadow=true;scene.add(trunks,leaves,firs);
  leafParts.forEach((p,i)=>leaves.setColorAt(i,color(p.c)));firParts.forEach((p,i)=>firs.setColorAt(i,color(p.c)));
  const shrubs=new THREE.InstancedMesh(leafGeo,material('#6c8f45'),220);scene.add(shrubs);shrubs.castShadow=true;
  const shrubRecords=Array.from({length:220},(_,i)=>({x:(i%2?1:-1)*range(11.7,12.5),z:range(-40,1060),s:range(.35,.75)}));
  // Small wildflower beds bring colour into the close roadside scenery.
  const flowers=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.12,0),new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.8}),300);scene.add(flowers);
  const flowerRecords=Array.from({length:300},(_,i)=>({x:(i%2?1:-1)*range(8.5,8.95),z:range(-40,900),y:range(-.03,.24)}));flowerRecords.forEach((_,i)=>flowers.setColorAt(i,color(['#fff4bf','#edbcdb','#b9a9df','#edca76'][i%4])));
  const birds=new THREE.Group();scene.add(birds);for(let i=0;i<12;i++){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([-1.6,0,0,0,-.3,0,0,-.3,0,1.6,0,0],3));const b=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:'#476a7d'}));b.position.set(range(-90,90),range(30,60),range(160,350));birds.add(b);}

  const wrap=(z,d,span=1100)=>((z-d+40)%span+span)%span-40;
  let lastDistance=Infinity;
  function update(distance,time){skyMaterial.uniforms.uTime.value=time;waterMaterial.uniforms.uTime.value=time;clouds.position.x=Math.sin(time*.006)*12;
    birds.children.forEach((b,i)=>{b.rotation.z=Math.sin(time*2+i)*.1;b.position.x+=Math.sin(time*.1+i)*.012;});
    if(Math.abs(distance-lastDistance)<.025)return;lastDistance=distance;
    piers.forEach(p=>p.mesh.position.z=wrap(p.z,distance*.5,1220));boats.children.forEach(b=>b.position.z=wrap(b.userData.startZ,distance*.35,1220));
    buildings.forEach(b=>b.mesh.position.z=wrap(b.z,distance*.5,1220));landmark.position.z=wrap(440,distance*.22,1550);
    treeRecords.forEach((t,i)=>{transform.position.set(t.x,t.y+2*t.scale,wrap(t.z,distance));transform.scale.set(t.scale,4*t.scale,t.scale);transform.rotation.set(0,0,0);transform.updateMatrix();trunks.setMatrixAt(i,transform.matrix);});
    function updateFoliage(parts,mesh){parts.forEach((p,i)=>{const t=treeRecords[p.tree],s=t.scale;transform.position.set(t.x+p.x*s,t.y+p.y*s,wrap(t.z,distance)+p.z*s);transform.scale.set(p.sx*s,p.sy*s,p.sz*s);transform.rotation.set(0,p.tree*2.4,0);transform.updateMatrix();mesh.setMatrixAt(i,transform.matrix);});mesh.instanceMatrix.needsUpdate=true;}
    updateFoliage(leafParts,leaves);updateFoliage(firParts,firs);trunks.instanceMatrix.needsUpdate=true;
    shrubRecords.forEach((p,i)=>{transform.position.set(p.x,p.s*.5-.35,wrap(p.z,distance));transform.scale.set(p.s,p.s,p.s);transform.updateMatrix();shrubs.setMatrixAt(i,transform.matrix);});shrubs.instanceMatrix.needsUpdate=true;
    flowerRecords.forEach((p,i)=>{transform.position.set(p.x,p.y,wrap(p.z,distance));transform.scale.set(1,1,1);transform.updateMatrix();flowers.setMatrixAt(i,transform.matrix);});flowers.instanceMatrix.needsUpdate=true;
  }
  // Bounds are fixed for the entire wrapping scenery, avoiding per-frame recomputation.
  for(const mesh of [trunks,leaves,firs,shrubs,flowers])mesh.frustumCulled=false;
  update(0,0);
  return {update};
}
