//-------------------------------------------------------------------
// aes, parte de CryptoJS
//-------------------------------------------------------------------
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(u,p){var d={},l=d.lib={},s=function(){},t=l.Base={extend:function(a){s.prototype=this;var c=new s;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
r=l.WordArray=t.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=p?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,e=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var k=0;k<a;k++)c[j+k>>>2]|=(e[k>>>2]>>>24-8*(k%4)&255)<<24-8*((j+k)%4);else if(65535<e.length)for(k=0;k<a;k+=4)c[j+k>>>2]=e[k>>>2];else c.push.apply(c,e);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=t.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],e=0;e<a;e+=4)c.push(4294967296*u.random()|0);return new r.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++){var k=c[j>>>2]>>>24-8*(j%4)&255;e.push((k>>>4).toString(16));e.push((k&15).toString(16))}return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j+=2)e[j>>>3]|=parseInt(a.substr(j,
2),16)<<24-4*(j%8);return new r.init(e,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++)e.push(String.fromCharCode(c[j>>>2]>>>24-8*(j%4)&255));return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j++)e[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new r.init(e,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},
q=l.BufferedBlockAlgorithm=t.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,e=c.words,j=c.sigBytes,k=this.blockSize,b=j/(4*k),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*k;j=u.min(4*a,j);if(a){for(var q=0;q<a;q+=k)this._doProcessBlock(e,q);q=e.splice(0,a);c.sigBytes-=j}return new r.init(q,j)},clone:function(){var a=t.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=q.extend({cfg:t.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){q.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,e){return(new a.init(e)).finalize(b)}},_createHmacHelper:function(a){return function(b,e){return(new n.HMAC.init(a,
e)).finalize(b)}}});var n=d.algo={};return d}(Math);
(function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
(function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
l)}})();
CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();
(function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();


//-------------------------------------------------------------------
// passphraseGenerator
//-------------------------------------------------------------------

var xkcd_pw_gen_wordlist = [
"ability","able","aboard","about","above","accept","accident","according",
"account","accurate","acres","across","act","action","active","activity",
"actual","actually","add","addition","additional","adjective","adult","adventure",
"advice","affect","afraid","after","afternoon","again","against","age",
"ago","agree","ahead","aid","air","airplane","alike","alive",
"all","allow","almost","alone","along","aloud","alphabet","already",
"also","although","am","among","amount","ancient","angle","angry",
"animal","announced","another","answer","ants","any","anybody","anyone",
"anything","anyway","anywhere","apart","apartment","appearance","apple","applied",
"appropriate","are","area","arm","army","around","arrange","arrangement",
"arrive","arrow","art","article","as","aside","ask","asleep",
"at","ate","atmosphere","atom","atomic","attached","attack","attempt",
"attention","audience","author","automobile","available","average","avoid","aware",
"away","baby","back","bad","badly","bag","balance","ball",
"balloon","band","bank","bar","bare","bark","barn","base",
"baseball","basic","basis","basket","bat","battle","be","bean",
"bear","beat","beautiful","beauty","became","because","become","becoming",
"bee","been","before","began","beginning","begun","behavior","behind",
"being","believed","bell","belong","below","belt","bend","beneath",
"bent","beside","best","bet","better","between","beyond","bicycle",
"bigger","biggest","bill","birds","birth","birthday","bit","bite",
"black","blank","blanket","blew","blind","block","blood","blow",
"blue","board","boat","body","bone","book","border","born",
"both","bottle","bottom","bound","bow","bowl","box","boy",
"brain","branch","brass","brave","bread","break","breakfast","breath",
"breathe","breathing","breeze","brick","bridge","brief","bright","bring",
"broad","broke","broken","brother","brought","brown","brush","buffalo",
"build","building","built","buried","burn","burst","bus","bush",
"business","busy","but","butter","buy","by","cabin","cage",
"cake","call","calm","came","camera","camp","can","canal",
"cannot","cap","capital","captain","captured","car","carbon","card",
"care","careful","carefully","carried","carry","case","cast","castle",
"cat","catch","cattle","caught","cause","cave","cell","cent",
"center","central","century","certain","certainly","chain","chair","chamber",
"chance","change","changing","chapter","character","characteristic","charge","chart",
"check","cheese","chemical","chest","chicken","chief","child","children",
"choice","choose","chose","chosen","church","circle","circus","citizen",
"city","class","classroom","claws","clay","clean","clear","clearly",
"climate","climb","clock","close","closely","closer","cloth","clothes",
"clothing","cloud","club","coach","coal","coast","coat","coffee",
"cold","collect","college","colony","color","column","combination","combine",
"come","comfortable","coming","command","common","community","company","compare",
"compass","complete","completely","complex","composed","composition","compound","concerned",
"condition","congress","connected","consider","consist","consonant","constantly","construction",
"contain","continent","continued","contrast","control","conversation","cook","cookies",
"cool","copper","copy","corn","corner","correct","correctly","cost",
"cotton","could","count","country","couple","courage","course","court",
"cover","cow","cowboy","crack","cream","create","creature","crew",
"crop","cross","crowd","cry","cup","curious","current","curve",
"customs","cut","cutting","daily","damage","dance","danger","dangerous",
"dark","darkness","date","daughter","dawn","day","dead","deal",
"dear","death","decide","declared","deep","deeply","deer","definition",
"degree","depend","depth","describe","desert","design","desk","detail",
"determine","develop","development","diagram","diameter","did","die","differ",
"difference","different","difficult","difficulty","dig","dinner","direct","direction",
"directly","dirt","dirty","disappear","discover","discovery","discuss","discussion",
"disease","dish","distance","distant","divide","division","do","doctor",
"does","dog","doing","doll","dollar","done","donkey","door",
"dot","double","doubt","down","dozen","draw","drawn","dream",
"dress","drew","dried","drink","drive","driven","driver","driving",
"drop","dropped","drove","dry","duck","due","dug","dull",
"during","dust","duty","each","eager","ear","earlier","early",
"earn","earth","easier","easily","east","easy","eat","eaten",
"edge","education","effect","effort","egg","eight","either","electric",
"electricity","element","elephant","eleven","else","empty","end","enemy",
"energy","engine","engineer","enjoy","enough","enter","entire","entirely",
"environment","equal","equally","equator","equipment","escape","especially","essential",
"establish","even","evening","event","eventually","ever","every","everybody",
"everyone","everything","everywhere","evidence","exact","exactly","examine","example",
"excellent","except","exchange","excited","excitement","exciting","exclaimed","exercise",
"exist","expect","experience","experiment","explain","explanation","explore","express",
"expression","extra","eye","face","facing","fact","factor","factory",
"failed","fair","fairly","fall","fallen","familiar","family","famous",
"far","farm","farmer","farther","fast","fastened","faster","fat",
"father","favorite","fear","feathers","feature","fed","feed","feel",
"feet","fell","fellow","felt","fence","few","fewer","field",
"fierce","fifteen","fifth","fifty","fight","fighting","figure","fill",
"film","final","finally","find","fine","finest","finger","finish",
"fire","fireplace","firm","first","fish","five","fix","flag",
"flame","flat","flew","flies","flight","floating","floor","flow",
"flower","fly","fog","folks","follow","food","foot","football",
"for","force","foreign","forest","forget","forgot","forgotten","form",
"former","fort","forth","forty","forward","fought","found","four",
"fourth","fox","frame","free","freedom","frequently","fresh","friend",
"friendly","frighten","frog","from","front","frozen","fruit","fuel",
"full","fully","fun","function","funny","fur","furniture","further",
"future","gain","game","garage","garden","gas","gasoline","gate",
"gather","gave","general","generally","gentle","gently","get","getting",
"giant","gift","girl","give","given","giving","glad","glass",
"globe","go","goes","gold","golden","gone","good","goose",
"got","government","grabbed","grade","gradually","grain","grandfather","grandmother",
"graph","grass","gravity","gray","great","greater","greatest","greatly",
"green","grew","ground","group","grow","grown","growth","guard",
"guess","guide","gulf","gun","habit","had","hair","half",
"halfway","hall","hand","handle","handsome","hang","happen","happened",
"happily","happy","harbor","hard","harder","hardly","has","hat",
"have","having","hay","he","headed","heading","health","heard",
"hearing","heart","heat","heavy","height","held","hello","help",
"helpful","her","herd","here","herself","hidden","hide","high",
"higher","highest","highway","hill","him","himself","his","history",
"hit","hold","hole","hollow","home","honor","hope","horn",
"horse","hospital","hot","hour","house","how","however","huge",
"human","hundred","hung","hungry","hunt","hunter","hurried","hurry",
"hurt","husband","ice","idea","identity","if","ill","image",
"imagine","immediately","importance","important","impossible","improve","in","inch",
"include","including","income","increase","indeed","independent","indicate","individual",
"industrial","industry","influence","information","inside","instance","instant","instead",
"instrument","interest","interior","into","introduced","invented","involved","iron",
"is","island","it","its","itself","jack","jar","jet",
"job","join","joined","journey","joy","judge","jump","jungle",
"just","keep","kept","key","kids","kill","kind","kitchen",
"knew","knife","know","knowledge","known","label","labor","lack",
"lady","laid","lake","lamp","land","language","large","larger",
"largest","last","late","later","laugh","law","lay","layers",
"lead","leader","leaf","learn","least","leather","leave","leaving",
"led","left","leg","length","lesson","let","letter","level",
"library","lie","life","lift","light","like","likely","limited",
"line","lion","lips","liquid","list","listen","little","live",
"living","load","local","locate","location","log","lonely","long",
"longer","look","loose","lose","loss","lost","lot","loud",
"love","lovely","low","lower","luck","lucky","lunch","lungs",
"lying","machine","machinery","mad","made","magic","magnet","mail",
"main","mainly","major","make","making","man","managed","manner",
"manufacturing","many","map","mark","market","married","mass","massage",
"master","material","mathematics","matter","may","maybe","me","meal",
"mean","means","meant","measure","meat","medicine","meet","melted",
"member","memory","men","mental","merely","met","metal","method",
"mice","middle","might","mighty","mile","military","milk","mill",
"mind","mine","minerals","minute","mirror","missing","mission","mistake",
"mix","mixture","model","modern","molecular","moment","money","monkey",
"month","mood","moon","more","morning","most","mostly","mother",
"motion","motor","mountain","mouse","mouth","move","movement","movie",
"moving","mud","muscle","music","musical","must","my","myself",
"mysterious","nails","name","nation","national","native","natural","naturally",
"nature","near","nearby","nearer","nearest","nearly","necessary","neck",
"needed","needle","needs","negative","neighbor","neighborhood","nervous","nest",
"never","new","news","newspaper","next","nice","night","nine",
"no","nobody","nodded","noise","none","noon","nor","north",
"nose","not","note","noted","nothing","notice","noun","now",
"number","numeral","nuts","object","observe","obtain","occasionally","occur",
"ocean","of","off","offer","office","officer","official","oil",
"old","older","oldest","on","once","one","only","onto",
"open","operation","opinion","opportunity","opposite","or","orange","orbit",
"order","ordinary","organization","organized","origin","original","other","ought",
"our","ourselves","out","outer","outline","outside","over","own",
"owner","oxygen","pack","package","page","paid","pain","paint",
"pair","palace","pale","pan","paper","paragraph","parallel","parent",
"park","part","particles","particular","particularly","partly","parts","party",
"pass","passage","past","path","pattern","pay","peace","pen",
"pencil","people","per","percent","perfect","perfectly","perhaps","period",
"person","personal","pet","phrase","physical","piano","pick","picture",
"pictured","pie","piece","pig","pile","pilot","pine","pink",
"pipe","pitch","place","plain","plan","plane","planet","planned",
"planning","plant","plastic","plate","plates","play","pleasant","please",
"pleasure","plenty","plural","plus","pocket","poem","poet","poetry",
"point","pole","police","policeman","political","pond","pony","pool",
"poor","popular","population","porch","port","position","positive","possible",
"possibly","post","pot","potatoes","pound","pour","powder","power",
"powerful","practical","practice","prepare","present","president","press","pressure",
"pretty","prevent","previous","price","pride","primitive","principal","principle",
"printed","private","prize","probably","problem","process","produce","product",
"production","program","progress","promised","proper","properly","property","protection",
"proud","prove","provide","public","pull","pupil","pure","purple",
"purpose","push","put","putting","quarter","queen","question","quick",
"quickly","quiet","quietly","quite","rabbit","race","radio","railroad",
"rain","raise","ran","ranch","range","rapidly","rate","rather",
"raw","rays","reach","read","reader","ready","real","realize",
"rear","reason","recall","receive","recent","recently","recognize","record",
"red","refer","refused","region","regular","related","relationship","religious",
"remain","remarkable","remember","remove","repeat","replace","replied","report",
"represent","require","research","respect","rest","result","return","review",
"rhyme","rhythm","rice","rich","ride","riding","right","ring",
"rise","rising","river","road","roar","rock","rocket","rocky",
"rod","roll","roof","room","root","rope","rose","rough",
"round","route","row","rubbed","rubber","rule","ruler","run",
"running","rush","sad","saddle","safe","safety","said","sail",
"sale","salmon","salt","same","sand","sang","sat","satellites",
"satisfied","save","saved","saw","say","scale","scared","scene",
"school","science","scientific","scientist","score","screen","sea","search",
"season","seat","second","secret","section","see","seed","seeing",
"seems","seen","seldom","select","selection","sell","send","sense",
"sent","sentence","separate","series","serious","serve","service","sets",
"setting","settle","settlers","seven","several","shade","shadow","shake",
"shaking","shall","shallow","shape","share","sharp","she","sheep",
"sheet","shelf","shells","shelter","shine","shinning","ship","shirt",
"shoe","shoot","shop","shore","short","shorter","shot","should",
"shoulder","shout","show","shown","shut","sick","sides","sight",
"sign","signal","silence","silent","silk","silly","silver","similar",
"simple","simplest","simply","since","sing","single","sink","sister",
"sit","sitting","situation","six","size","skill","skin","sky",
"slabs","slave","sleep","slept","slide","slight","slightly","slip",
"slipped","slope","slow","slowly","small","smaller","smallest","smell",
"smile","smoke","smooth","snake","snow","so","soap","social",
"society","soft","softly","soil","solar","sold","soldier","solid",
"solution","solve","some","somebody","somehow","someone","something","sometime",
"somewhere","son","song","soon","sort","sound","source","south",
"southern","space","speak","special","species","specific","speech","speed",
"spell","spend","spent","spider","spin","spirit","spite","split",
"spoken","sport","spread","spring","square","stage","stairs","stand",
"standard","star","stared","start","state","statement","station","stay",
"steady","steam","steel","steep","stems","step","stepped","stick",
"stiff","still","stock","stomach","stone","stood","stop","stopped",
"store","storm","story","stove","straight","strange","stranger","straw",
"stream","street","strength","stretch","strike","string","strip","strong",
"stronger","struck","structure","struggle","stuck","student","studied","studying",
"subject","substance","success","successful","such","sudden","suddenly","sugar",
"suggest","suit","sum","summer","sun","sunlight","supper","supply",
"support","suppose","sure","surface","surprise","surrounded","swam","sweet",
"swept","swim","swimming","swing","swung","syllable","symbol","system",
"table","tail","take","taken","tales","talk","tall","tank",
"tape","task","taste","taught","tax","tea","teach","teacher",
"team","tears","teeth","telephone","television","tell","temperature","ten",
"tent","term","terrible","test","than","thank","that","thee",
"them","themselves","then","theory","there","therefore","these","they",
"thick","thin","thing","think","third","thirty","this","those",
"thou","though","thought","thousand","thread","three","threw","throat",
"through","throughout","throw","thrown","thumb","thus","thy","tide",
"tie","tight","tightly","till","time","tin","tiny","tip",
"tired","title","to","tobacco","today","together","told","tomorrow",
"tone","tongue","tonight","too","took","tool","top","topic",
"torn","total","touch","toward","tower","town","toy","trace",
"track","trade","traffic","trail","train","transportation","trap","travel",
"treated","tree","triangle","tribe","trick","tried","trip","troops",
"tropical","trouble","truck","trunk","truth","try","tube","tune",
"turn","twelve","twenty","twice","two","type","typical","uncle",
"under","underline","understanding","unhappy","union","unit","universe","unknown",
"unless","until","unusual","up","upon","upper","upward","us",
"use","useful","using","usual","usually","valley","valuable","value",
"vapor","variety","various","vast","vegetable","verb","vertical","very",
"vessels","victory","view","village","visit","visitor","voice","volume",
"vote","vowel","voyage","wagon","wait","walk","wall","want",
"war","warm","warn","was","wash","waste","watch","water",
"wave","way","we","weak","wealth","wear","weather","week",
"weigh","weight","welcome","well","went","were","west","western",
"wet","whale","what","whatever","wheat","wheel","when","whenever",
"where","wherever","whether","which","while","whispered","whistle","white",
"who","whole","whom","whose","why","wide","widely","wife",
"wild","will","willing","win","wind","window","wing","winter",
"wire","wise","wish","with","within","without","wolf","women",
"won","wonder","wonderful","wood","wooden","wool","word","wore",
"work","worker","world","worried","worry","worse","worth","would",
"wrapped","write","writer","writing","written","wrong","wrote","yard",
"year","yellow","yes","yesterday","yet","you","young","younger",
"your","yourself","youth","zero","zoo"
];

// Return a pseudorandom string
function xkcd_pw_gen_server_hash(len) {
	var charSet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789&%.#$';
	var randomString = '';
	for (var i = 0; i < len; i++) {
		var randomPoz = Math.floor(Math.random() * charSet.length);
		randomString += charSet.substring(randomPoz,randomPoz+1);
	}
	return randomString;
}

// Get some entropy from the system clock:
function xkcd_pw_gen_time_ent() {
	var d = 1 * new Date();
	var i = 0;
	while (1 * new Date() == d)
	    i++; // Measure iterations until next tick
	return "" + d + i;
}

// Return a pseudorandom array of four 32-bit integers:
function xkcd_pw_gen_create_hash() {
	// Entropy string built in a manner inspired by David Finch:
	var entropy = _seed + xkcd_pw_gen_time_ent(); // _seed lo genera el servidor aleatoriamente
	entropy += navigator.userAgent + Math.random() + Math.random() + screen.width + screen.height;
	if (document.all) {
	  entropy = entropy + document.body.clientWidth + document.body.clientHeight + document.body.scrollWidth + document.body.scrollHeight;	
	} else {
		entropy = entropy + window.innerWidth + window.innerHeight + window.width + window.height;
entropy += xkcd_pw_gen_time_ent();
	}

	// Hash and convert to 32-bit integers:
	var hexString = CryptoJS.MD5(entropy).toString();
	var result = [];
	for (var i = 0; i < 32; i += 8) {
	  result.push(parseInt(hexString.substr(i, 8), 16));
	}
	return result;
}

// Generate a new passphrase and update the document:
function xkcd_pw_gen(len) {
	var length = len || 4;
	var hash = xkcd_pw_gen_create_hash();
	var choices = [];
	for (var w = 0; w < length; w++) {
	    var jsRandom = Math.floor(Math.random() * 0x100000000);
	    var index = ((jsRandom ^ hash[w]) + 0x100000000) % xkcd_pw_gen_wordlist.length;
	    choices.push(xkcd_pw_gen_wordlist[index]);
	}
	return choices.join(" ");
	// var resultSpan = document.getElementById("xkcd_pw_gen_result");
	// resultSpan.innerText = resultSpan.textContent = choices.join(" ");
}

function generatePassphrase(element, len, callback) {
	var counter = 0;
	var i = setInterval(function() {
		var pass = xkcd_pw_gen(len);
		element.val(pass);
    counter++;
    if(counter === 5) {
			clearInterval(i);
			callback(true);
		}
	}, 40);
}


//-------------------------------------------------------------------
// strengthMeter
//-------------------------------------------------------------------
function strengthMeter(passwordFieldId, nodes) {

    // init undefined 
    if ('undefined' === typeof(nodes)) {
        var nodes = 1;
    }   
    
    // Para traducir el texto
    var localePossibilities = " <span class='weak'>possibilities</span>";
    if(locale == "es") localePossibilities = " <span class='weak'>posibilidades</span>";

    // init character classes
    var password = $("#" + passwordFieldId).val();
    var numEx = /\d/;
    var lcEx = /[a-z]/;
    var ucEx = /[A-Z]/;
    var syEx = /\W/;
    var meterMult = 1;
    var character_set_size = 0;
    
    // loop over each char of the password and check it per regexes above.
    // weight numbers, upper case and lowercase at .75, 1 and .25 respectively.
    if (numEx.test(password)) {
        character_set_size += 10;
    }
    if (ucEx.test(password)) {
        character_set_size += 26;
    }
    if (lcEx.test(password)) {
        character_set_size += 26;
    }
    if (syEx.test(password)) {
        character_set_size += 32;
    }

    // assume that 100% is a meterMult of maxMulti
    var strength = Math.pow(character_set_size, password.length);
    
    // if null, don't show anything
    if (password.length > 0) {
        $(".strength-meter").show();
        $("#possibilities").html(numberWithCommas(strength) + localePossibilities);
    } else {
        $(".strength-meter").hide();
    }
    
}

// thanks http://stackoverflow.com/questions/2901102/how-to-print-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//-------------------------------------------------------------------
// FileSaver
//-------------------------------------------------------------------
var saveAs=saveAs||function(view){"use strict";if(typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var doc=view.document,get_URL=function(){return view.URL||view.webkitURL||view},save_link=doc.createElementNS("http://www.w3.org/1999/xhtml","a"),can_use_save_link="download"in save_link,click=function(node){var event=new MouseEvent("click");node.dispatchEvent(event)},is_safari=/Version\/[\d\.]+.*Safari/.test(navigator.userAgent),webkit_req_fs=view.webkitRequestFileSystem,req_fs=view.requestFileSystem||webkit_req_fs||view.mozRequestFileSystem,throw_outside=function(ex){(view.setImmediate||view.setTimeout)(function(){throw ex},0)},force_saveable_type="application/octet-stream",fs_min_size=0,arbitrary_revoke_timeout=500,revoke=function(file){var revoker=function(){if(typeof file==="string"){get_URL().revokeObjectURL(file)}else{file.remove()}};if(view.chrome){revoker()}else{setTimeout(revoker,arbitrary_revoke_timeout)}},dispatch=function(filesaver,event_types,event){event_types=[].concat(event_types);var i=event_types.length;while(i--){var listener=filesaver["on"+event_types[i]];if(typeof listener==="function"){try{listener.call(filesaver,event||filesaver)}catch(ex){throw_outside(ex)}}}},auto_bom=function(blob){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)){return new Blob(["\ufeff",blob],{type:blob.type})}return blob},FileSaver=function(blob,name,no_auto_bom){if(!no_auto_bom){blob=auto_bom(blob)}var filesaver=this,type=blob.type,blob_changed=false,object_url,target_view,dispatch_all=function(){dispatch(filesaver,"writestart progress write writeend".split(" "))},fs_error=function(){if(target_view&&is_safari&&typeof FileReader!=="undefined"){var reader=new FileReader;reader.onloadend=function(){var base64Data=reader.result;target_view.location.href="data:attachment/file"+base64Data.slice(base64Data.search(/[,;]/));filesaver.readyState=filesaver.DONE;dispatch_all()};reader.readAsDataURL(blob);filesaver.readyState=filesaver.INIT;return}if(blob_changed||!object_url){object_url=get_URL().createObjectURL(blob)}if(target_view){target_view.location.href=object_url}else{var new_tab=view.open(object_url,"_blank");if(new_tab==undefined&&is_safari){view.location.href=object_url}}filesaver.readyState=filesaver.DONE;dispatch_all();revoke(object_url)},abortable=function(func){return function(){if(filesaver.readyState!==filesaver.DONE){return func.apply(this,arguments)}}},create_if_not_found={create:true,exclusive:false},slice;filesaver.readyState=filesaver.INIT;if(!name){name="download"}if(can_use_save_link){object_url=get_URL().createObjectURL(blob);setTimeout(function(){save_link.href=object_url;save_link.download=name;click(save_link);dispatch_all();revoke(object_url);filesaver.readyState=filesaver.DONE});return}if(view.chrome&&type&&type!==force_saveable_type){slice=blob.slice||blob.webkitSlice;blob=slice.call(blob,0,blob.size,force_saveable_type);blob_changed=true}if(webkit_req_fs&&name!=="download"){name+=".download"}if(type===force_saveable_type||webkit_req_fs){target_view=view}if(!req_fs){fs_error();return}fs_min_size+=blob.size;req_fs(view.TEMPORARY,fs_min_size,abortable(function(fs){fs.root.getDirectory("saved",create_if_not_found,abortable(function(dir){var save=function(){dir.getFile(name,create_if_not_found,abortable(function(file){file.createWriter(abortable(function(writer){writer.onwriteend=function(event){target_view.location.href=file.toURL();filesaver.readyState=filesaver.DONE;dispatch(filesaver,"writeend",event);revoke(file)};writer.onerror=function(){var error=writer.error;if(error.code!==error.ABORT_ERR){fs_error()}};"writestart progress write abort".split(" ").forEach(function(event){writer["on"+event]=filesaver["on"+event]});writer.write(blob);filesaver.abort=function(){writer.abort();filesaver.readyState=filesaver.DONE};filesaver.readyState=filesaver.WRITING}),fs_error)}),fs_error)};dir.getFile(name,{create:false},abortable(function(file){file.remove();save()}),abortable(function(ex){if(ex.code===ex.NOT_FOUND_ERR){save()}else{fs_error()}}))}),fs_error)}),fs_error)},FS_proto=FileSaver.prototype,saveAs=function(blob,name,no_auto_bom){return new FileSaver(blob,name,no_auto_bom)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(blob,name,no_auto_bom){if(!no_auto_bom){blob=auto_bom(blob)}return navigator.msSaveOrOpenBlob(blob,name||"download")}}FS_proto.abort=function(){var filesaver=this;filesaver.readyState=filesaver.DONE;dispatch(filesaver,"abort")};FS_proto.readyState=FS_proto.INIT=0;FS_proto.WRITING=1;FS_proto.DONE=2;FS_proto.error=FS_proto.onwritestart=FS_proto.onprogress=FS_proto.onwrite=FS_proto.onabort=FS_proto.onerror=FS_proto.onwriteend=null;return saveAs}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!=null){define([],function(){return saveAs})}


//-------------------------------------------------------------------
// S3Upload
//-------------------------------------------------------------------
(function() {

  window.S3Upload = (function() {

    S3Upload.prototype.s3_object_name = 'default_name';

    S3Upload.prototype.s3_sign_put_url = '/signS3put';

    S3Upload.prototype.file_dom_selector = 'file_upload';

    S3Upload.prototype.onFinishS3Put = function(public_url) {
      return console.log('base.onFinishS3Put()', public_url);
    };

    S3Upload.prototype.onProgress = function(percent, status) {
      return console.log('base.onProgress()', percent, status);
    };

    S3Upload.prototype.onError = function(status) {
      return console.log('base.onError()', status);
    };

    function S3Upload(options) {
      if (options == null) options = {};
      for (option in options) {
        this[option] = options[option];
      }
      this.handleFileSelect(this.file_dom_selector);
    }

    S3Upload.prototype.handleFileSelect = function(file_element) {
      var f, files, output, _i, _len, _results;
			// _results = [];
      this.onProgress(0, 'Upload started.');
			this.uploadFile(file_element);
			// _results.push(this.uploadFile(file_element));
			// return _results;
      // files = file_element.files;
      // output = [];
      // _results = [];
      // for (_i = 0, _len = files.length; _i < _len; _i++) {
      //   f = files[_i];
      //   _results.push(this.uploadFile(f));
      // }
      // return _results;
    };

    S3Upload.prototype.createCORSRequest = function(method, url) {
      var xhr;
      xhr = new XMLHttpRequest();
      if (xhr.withCredentials != null) {
        xhr.open(method, url, true);
      } else if (typeof XDomainRequest !== "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
      } else {
        xhr = null;
      }
      return xhr;
    };

    S3Upload.prototype.executeOnSignedUrl = function(file, callback) {
      var this_s3upload, xhr;
      this_s3upload = this;
      xhr = new XMLHttpRequest();
      xhr.open('GET', this.s3_sign_put_url + '?s3_object_type=' + file.type + '&s3_object_name=' + this.s3_object_name, true);
      xhr.overrideMimeType('text/plain; charset=x-user-defined');
      xhr.onreadystatechange = function(e) {
        var result;
        if (this.readyState === 4 && this.status === 200) {
          try {
            result = JSON.parse(this.responseText);
          } catch (error) {
            this_s3upload.onError('Signing server returned some ugly/empty JSON: "' + this.responseText + '"');
            return false;
          }
          return callback(result.signed_request, result.url);
        } else if (this.readyState === 4 && this.status !== 200) {
          return this_s3upload.onError('Could not contact request signing server. Status = ' + this.status);
        }
      };
      return xhr.send();
    };

    S3Upload.prototype.uploadToS3 = function(file, url, public_url) {
      var this_s3upload, xhr;
      this_s3upload = this;
      xhr = this.createCORSRequest('PUT', url);
      if (!xhr) {
        this.onError('CORS not supported');
      } else {
        xhr.onload = function() {
          if (xhr.status === 200) {
            this_s3upload.onProgress(100, 'Upload completed.');
            return this_s3upload.onFinishS3Put(public_url);
          } else {
            return this_s3upload.onError('Upload error: ' + xhr.status);
          }
        };
        xhr.onerror = function() {
          return this_s3upload.onError('XHR error.');
        };
        xhr.upload.onprogress = function(e) {
          var percentLoaded;
          if (e.lengthComputable) {
            percentLoaded = Math.round((e.loaded / e.total) * 100);
            return this_s3upload.onProgress(percentLoaded, percentLoaded === 100 ? 'Finalizing.' : 'Uploading.');
          }
        };
      }
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.setRequestHeader('x-amz-acl', 'public-read');
      return xhr.send(file);
    };

    S3Upload.prototype.uploadFile = function(file) {
      var this_s3upload;
      this_s3upload = this;
      return this.executeOnSignedUrl(file, function(signedURL, publicURL) {
        return this_s3upload.uploadToS3(file, signedURL, publicURL);
      });
    };

    return S3Upload;

  })();

}).call(this);


/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

/*!
 * Generated using the Bootstrap Customizer (http://getbootstrap.com/customize/?id=441bc41bda47b5996232)
 * Config saved to config.json and https://gist.github.com/441bc41bda47b5996232
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(t){"use strict";var r=t.fn.jquery.split(" ")[0].split(".");if(r[0]<2&&r[1]<9||1==r[0]&&9==r[1]&&r[2]<1||r[0]>2)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3")}(jQuery),+function(t){"use strict";function r(r){return this.each(function(){var e=t(this),n=e.data("bs.alert");n||e.data("bs.alert",n=new a(this)),"string"==typeof r&&n[r].call(e)})}var e='[data-dismiss="alert"]',a=function(r){t(r).on("click",e,this.close)};a.VERSION="3.3.6",a.TRANSITION_DURATION=150,a.prototype.close=function(r){function e(){o.detach().trigger("closed.bs.alert").remove()}var n=t(this),s=n.attr("data-target");s||(s=n.attr("href"),s=s&&s.replace(/.*(?=#[^\s]*$)/,""));var o=t(s);r&&r.preventDefault(),o.length||(o=n.closest(".alert")),o.trigger(r=t.Event("close.bs.alert")),r.isDefaultPrevented()||(o.removeClass("in"),t.support.transition&&o.hasClass("fade")?o.one("bsTransitionEnd",e).emulateTransitionEnd(a.TRANSITION_DURATION):e())};var n=t.fn.alert;t.fn.alert=r,t.fn.alert.Constructor=a,t.fn.alert.noConflict=function(){return t.fn.alert=n,this},t(document).on("click.bs.alert.data-api",e,a.prototype.close)}(jQuery);
