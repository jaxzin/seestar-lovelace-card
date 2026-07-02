function t(t,e,i,r){var o,s=arguments.length,n=s<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(s<3?o(n):s>3?o(e,i,n):o(e,i))||n);return s>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),o=new WeakMap;let s=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,r)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[r+1],t[0]);return new s(i,t,r)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,r))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,g=globalThis,m=g.trustedTypes,v=m?m.emptyScript:"",f=g.reactiveElementPolyfillSupport,x=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?v:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!c(t,e),$={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(t,i,e);void 0!==r&&l(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){const{get:r,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:r,set(e){const s=r?.call(this);o?.call(this,e),this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(x("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(x("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(x("properties"))){const t=this.properties,e=[...p(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,r)=>{if(i)t.adoptedStyleSheets=r.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of r){const r=document.createElement("style"),o=e.litNonce;void 0!==o&&r.setAttribute("nonce",o),r.textContent=i.cssText,t.appendChild(r)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(void 0!==r&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,r=i._$Eh.get(t);if(void 0!==r&&this._$Em!==r){const t=i.getPropertyOptions(r),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=r;const s=o.fromAttribute(e,t.type);this[r]=s??this._$Ej?.get(r)??s,this._$Em=null}}requestUpdate(t,e,i,r=!1,o){if(void 0!==t){const s=this.constructor;if(!1===r&&(o=this[t]),i??=s.getPropertyOptions(t),!((i.hasChanged??b)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:r,wrapped:o},s){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==o||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===r&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,r=this[e];!0!==t||this._$AL.has(e)||void 0===r||this.C(e,void 0,i,r)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[x("elementProperties")]=new Map,w[x("finalized")]=new Map,f?.({ReactiveElement:w}),(g.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _=globalThis,A=t=>t,k=_.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+z,M=`<${C}>`,P=document,T=()=>P.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,H="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,j=/>/g,F=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,D=/"/g,L=/^(?:script|style|textarea|title)$/i,B=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),W=B(1),V=B(2),q=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),G=new WeakMap,Z=P.createTreeWalker(P,129);function J(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Q=(t,e)=>{const i=t.length-1,r=[];let o,s=2===e?"<svg>":3===e?"<math>":"",n=U;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,d=0;for(;d<i.length&&(n.lastIndex=d,c=n.exec(i),null!==c);)d=n.lastIndex,n===U?"!--"===c[1]?n=R:void 0!==c[1]?n=j:void 0!==c[2]?(L.test(c[2])&&(o=RegExp("</"+c[2],"g")),n=F):void 0!==c[3]&&(n=F):n===F?">"===c[0]?(n=o??U,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,a=c[1],n=void 0===c[3]?F:'"'===c[3]?D:I):n===D||n===I?n=F:n===R||n===j?n=U:(n=F,o=void 0);const p=n===F&&t[e+1].startsWith("/>")?" ":"";s+=n===U?i+M:l>=0?(r.push(a),i.slice(0,l)+E+i.slice(l)+z+p):i+z+(-2===l?e:p)}return[J(t,s+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),r]};class X{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let o=0,s=0;const n=t.length-1,a=this.parts,[c,l]=Q(t,e);if(this.el=X.createElement(c,i),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=Z.nextNode())&&a.length<n;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(E)){const e=l[s++],i=r.getAttribute(t).split(z),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:i,ctor:"."===n[1]?rt:"?"===n[1]?ot:"@"===n[1]?st:it}),r.removeAttribute(t)}else t.startsWith(z)&&(a.push({type:6,index:o}),r.removeAttribute(t));if(L.test(r.tagName)){const t=r.textContent.split(z),e=t.length-1;if(e>0){r.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)r.append(t[i],T()),Z.nextNode(),a.push({type:2,index:++o});r.append(t[e],T())}}}else if(8===r.nodeType)if(r.data===C)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=r.data.indexOf(z,t+1));)a.push({type:7,index:o}),t+=z.length-1}o++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,r){if(e===q)return e;let o=void 0!==r?i._$Co?.[r]:i._$Cl;const s=O(e)?void 0:e._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),void 0===s?o=void 0:(o=new s(t),o._$AT(t,i,r)),void 0!==r?(i._$Co??=[])[r]=o:i._$Cl=o),void 0!==o&&(e=Y(t,o._$AS(t,e.values),o,r)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,r=(t?.creationScope??P).importNode(e,!0);Z.currentNode=r;let o=Z.nextNode(),s=0,n=0,a=i[0];for(;void 0!==a;){if(s===a.index){let e;2===a.type?e=new et(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new nt(o,this,t)),this._$AV.push(e),a=i[++n]}s!==a?.index&&(o=Z.nextNode(),s++)}return Z.currentNode=P,r}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,r){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),O(t)?t===K||null==t||""===t?(this._$AH!==K&&this._$AR(),this._$AH=K):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==K&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,r="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=X.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(e);else{const t=new tt(r,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new X(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,r=0;for(const o of t)r===e.length?e.push(i=new et(this.O(T()),this.O(T()),this,this.options)):i=e[r],i._$AI(o),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,r,o){this.type=1,this._$AH=K,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(t,e=this,i,r){const o=this.strings;let s=!1;if(void 0===o)t=Y(this,t,e,0),s=!O(t)||t!==this._$AH&&t!==q,s&&(this._$AH=t);else{const r=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=Y(this,r[i+n],e,n),a===q&&(a=this._$AH[n]),s||=!O(a)||a!==this._$AH[n],a===K?t=K:t!==K&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}s&&!r&&this.j(t)}j(t){t===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class rt extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===K?void 0:t}}class ot extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==K)}}class st extends it{constructor(t,e,i,r,o){super(t,e,i,r,o),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??K)===q)return;const i=this._$AH,r=t===K&&i!==K||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==K&&(i===K||r);r&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const at=_.litHtmlPolyfillSupport;at?.(X,et),(_.litHtmlVersions??=[]).push("3.3.3");const ct=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class lt extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const r=i?.renderBefore??e;let o=r._$litPart$;if(void 0===o){const t=i?.renderBefore??null;r._$litPart$=o=new et(e.insertBefore(T(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}lt._$litElement$=!0,lt.finalized=!0,ct.litElementHydrateSupport?.({LitElement:lt});const dt=ct.litElementPolyfillSupport;dt?.({LitElement:lt}),(ct.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},ht=(t=pt,e,i)=>{const{kind:r,metadata:o}=i;let s=globalThis.litPropertyMetadata.get(o);if(void 0===s&&globalThis.litPropertyMetadata.set(o,s=new Map),"setter"===r&&((t=Object.create(t)).wrapped=!0),s.set(i.name,t),"accessor"===r){const{name:r}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(r,o,t,!0,i)},init(e){return void 0!==e&&this.C(r,void 0,t,e),e}}}if("setter"===r){const{name:r}=i;return function(i){const o=this[r];e.call(this,i),this.requestUpdate(r,o,t,!0,i)}}throw Error("Unsupported decorator location: "+r)};function ut(t){return(e,i)=>"object"==typeof i?ht(t,e,i):((t,e,i)=>{const r=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),r?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function gt(t){return ut({...t,state:!0,attribute:!1})}const mt=new Set(["unavailable","unknown",""]),vt={sensor:{telephotoTarget:"telephoto_target",wideTarget:"wide_field_target",telephotoMode:"telephoto_mode",activeCamera:"active_camera",stackState:"stack_state",stackedFrames:"stacked_frames",totalFrames:"total_frames",droppedFrames:"dropped_frames",exposure:"exposure",integrationTime:"integration_time",altitude:"altitude",azimuth:"azimuth",rightAscension:"right_ascension",declination:"declination",fieldOfView:"field_of_view",fieldRotation:"field_rotation",starsDetected:"stars_detected",plan:"plan",gotoState:"goto_state",mountMode:"mount_mode",catalogObjects:"catalog_objects",objectsInFrame:"objects_in_frame",battery:"battery",sensorTemperature:"sensor_temperature",charger:"charger",storageUsed:"storage_used",focuserPosition:"focuser_position",firmware:"firmware",lastAlert:"last_alert"},binarySensor:{planRunning:"plan_running",tracking:"tracking",slewing:"slewing",parked:"parked",atHome:"at_home",dewHeater:"dew_heater",connected:"connected"},camera:{liveView:"live_view"}};function ft(t,e,i){return`${t}.${e}_${i}`}function xt(t,e){return t.states[e]}function yt(t){return void 0!==t&&!mt.has(t.state)}function bt(t,e,i){const r=xt(t,ft("sensor",e,i));return yt(r)?r.state:void 0}function $t(t,e,i){const r=bt(t,e,i);if(void 0===r)return;const o=Number(r);return Number.isFinite(o)?o:void 0}function wt(t,e,i){const r=xt(t,ft("binary_sensor",e,i));return yt(r)?"on"===r.state:void 0}const _t=["live_stacked_preview","live_preview"];function At(t,e){const i=xt(t,e);if(!yt(i))return;const r=i.attributes.entity_picture;return"string"==typeof r?r:void 0}function kt(t,e,i,r){const{sensor:o,camera:s}=vt,n=function(t,e,i){if(i)return i;for(const i of _t){const r=`camera.${e}_${i}`;if(t.states[r])return r}return`camera.${e}_${_t[0]}`}(t,e,i),a=r??`camera.${e}_${s.liveView}`;return{prefix:e,preview:{cameraEntityId:n,picture:At(t,n),liveCameraEntityId:a,livePicture:At(t,a)},target:{telephotoTarget:bt(t,e,o.telephotoTarget),wideTarget:bt(t,e,o.wideTarget),mode:bt(t,e,o.telephotoMode),activeCamera:bt(t,e,o.activeCamera)},stack:{state:bt(t,e,o.stackState),stackedFrames:$t(t,e,o.stackedFrames),totalFrames:$t(t,e,o.totalFrames),droppedFrames:$t(t,e,o.droppedFrames),exposureSeconds:$t(t,e,o.exposure),integrationMinutes:$t(t,e,o.integrationTime)},pointing:{altitude:$t(t,e,o.altitude),azimuth:$t(t,e,o.azimuth),rightAscension:$t(t,e,o.rightAscension),declination:$t(t,e,o.declination),fieldOfView:bt(t,e,o.fieldOfView),fieldRotation:$t(t,e,o.fieldRotation),starsDetected:$t(t,e,o.starsDetected)},mount:{plan:bt(t,e,o.plan),planRunning:wt(t,e,vt.binarySensor.planRunning),tracking:wt(t,e,vt.binarySensor.tracking),slewing:wt(t,e,vt.binarySensor.slewing),gotoState:bt(t,e,o.gotoState),mountMode:bt(t,e,o.mountMode),parked:wt(t,e,vt.binarySensor.parked),atHome:wt(t,e,vt.binarySensor.atHome)},detection:{catalogObjects:bt(t,e,o.catalogObjects),objectsInFrame:$t(t,e,o.objectsInFrame)},health:{battery:$t(t,e,o.battery),sensorTemperature:$t(t,e,o.sensorTemperature),charger:bt(t,e,o.charger),storageUsed:$t(t,e,o.storageUsed),focuserPosition:$t(t,e,o.focuserPosition),firmware:bt(t,e,o.firmware),dewHeater:wt(t,e,vt.binarySensor.dewHeater),connected:wt(t,e,vt.binarySensor.connected),lastAlert:bt(t,e,o.lastAlert)}}}const St="—",Et=new Set(["sun","scenery"]),zt=[{key:"stop_session",icon:"mdi:stop",label:"Stop session",tone:"primary"},{key:"pause_plan",icon:"mdi:pause",label:"Pause plan",tone:"tonal"},{key:"goto",icon:"mdi:target",label:"Goto",tone:"neutral"},{key:"park",icon:"mdi:car-brake-parking",label:"Park",tone:"danger"}],Ct=[{key:"start_session",icon:"mdi:play",label:"Start session",tone:"primary"},{key:"capture",icon:"mdi:camera-iris",label:"Capture",tone:"tonal"},{key:"goto",icon:"mdi:target",label:"Goto",tone:"neutral"},{key:"park",icon:"mdi:car-brake-parking",label:"Park",tone:"danger"}];function Mt(t){return void 0===t?0:Math.max(0,Math.round(t))}function Pt(t){return void 0===t?St:t<1?`${Math.round(1e3*t)} ms`:`${Number.isInteger(t)?t:t.toFixed(1)} s`}function Tt(t){return void 0===t?St:`${Math.round(t)}%`}function Ot(t){if(void 0===t)return"mdi:battery-unknown";if(t>=95)return"mdi:battery";return`mdi:battery-${10*Math.max(1,Math.round(t/10))}`}function Nt(t,e){const{telephotoTarget:i,wideTarget:r}=t.target,o=i??r;return void 0!==o&&o.length>0?o:"scenery"===e?"Scenery":"sun"===e?"Sun":St}function Ht(t,e){const i=t.target.mode;return void 0!==i&&i.length>0?i:"scenery"===e?"Daylight landscape · Wide-field":"sun"===e?"White-light · Telephoto":"Deep-sky · Telephoto"}function Ut(t){const e=t.catalogObjects;return void 0===e?[]:e.split(/[,\n]/).map(t=>t.trim()).filter(t=>t.length>0)}function Rt(t,e,i){const r=[];if(!0===t.planRunning?r.push({icon:"mdi:play-circle-outline",label:"Plan running",tone:"active"}):!1===t.planRunning&&"scenery"!==i&&r.push({icon:"mdi:pause-circle-outline",label:"Plan idle",tone:"neutral"}),!0===t.tracking?r.push({icon:"mdi:sync",label:"Tracking",tone:"active"}):!1===t.tracking&&r.push({icon:"mdi:sync-off",label:"Not tracking",tone:"muted"}),"scenery"===i?r.push({icon:"mdi:image-filter-hdr",label:"Scenery",tone:"neutral"}):r.push(function(t){return(t.mountMode??"").toLowerCase().includes("eq")?{icon:"mdi:rotate-3d-variant",label:"EQ mode",tone:"neutral"}:{icon:"mdi:axis-arrow",label:"Alt-Az",tone:"neutral"}}(t)),void 0!==e.battery){const t=(e.charger??"").toLowerCase().includes("charg");r.push({icon:t?"mdi:battery-charging":Ot(e.battery),label:Tt(e.battery),tone:"good"})}var o;return void 0!==e.sensorTemperature&&r.push({icon:"mdi:thermometer",label:(o=e.sensorTemperature,void 0===o?St:`${o.toFixed(1)}°C`),tone:"neutral"}),!0===e.dewHeater&&r.push({icon:"mdi:heating-coil",label:"Dew on",tone:"active"}),void 0!==e.storageUsed&&r.push({icon:"mdi:harddisk",label:Tt(e.storageUsed),tone:"neutral"}),r}const jt="seestar-stack-ring";function Ft(t){return t*Math.PI/180}function It(t,e,i){return Math.max(e,Math.min(i,t))}class Dt extends lt{constructor(){super(...arguments),this.stacked=0,this.total=1,this.dropped=0,this.exposure="",this.integration="",this.size=106}get filledTicks(){const t=It(this.stacked/Math.max(1,this.total),0,1);return Math.round(48*t)}get ticks(){const t=this.size/2,e=this.size/2-5,i=e-9,r=this.filledTicks,o=[];for(let s=0;s<48;s++){const n=Ft(7.5*s-90),a=Math.cos(n),c=Math.sin(n);o.push({x1:t+i*a,y1:t+i*c,x2:t+e*a,y2:t+e*c,color:s<r?"var(--primary-color)":"var(--divider-color)"})}return o}get caption(){const t=[];return this.exposure.length>0&&t.push(this.exposure),this.integration.length>0&&t.push(`${this.integration} integ`),this.dropped>0&&t.push(`${this.dropped} dropped`),t.join("  ·  ")}get description(){const t=Math.round(100*It(this.stacked/Math.max(1,this.total),0,1));return`${this.stacked} of ${this.total} frames stacked, ${t} percent`}renderTick(t){return V`<line
      x1=${t.x1.toFixed(2)}
      y1=${t.y1.toFixed(2)}
      x2=${t.x2.toFixed(2)}
      y2=${t.y2.toFixed(2)}
      stroke=${t.color}
      stroke-width=${2.4}
      stroke-linecap="round"
    ></line>`}render(){const{size:t,caption:e}=this;return W`
      <div class="wrap">
        <div class="ring" style="width:${t}px;height:${t}px;">
          <svg
            width=${t}
            height=${t}
            viewBox="0 0 ${t} ${t}"
            role="img"
            aria-label=${this.description}
          >
            ${this.ticks.map(t=>this.renderTick(t))}
          </svg>
          <div class="center">
            <div class="count">${this.stacked}</div>
            <div class="of">of ${this.total}</div>
          </div>
        </div>
        ${e.length>0?W`<div class="caption">${e}</div>`:K}
      </div>
    `}}Dt.styles=n`
    :host {
      display: inline-block;
    }
    .wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .ring {
      position: relative;
    }
    svg {
      display: block;
    }
    .center {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
    .count {
      font-size: 27px;
      font-weight: 500;
      color: var(--primary-text-color);
      line-height: 1;
    }
    .of {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 3px;
    }
    .caption {
      font-size: 11.5px;
      color: var(--secondary-text-color);
      text-align: center;
    }
  `,t([ut({type:Number})],Dt.prototype,"stacked",void 0),t([ut({type:Number})],Dt.prototype,"total",void 0),t([ut({type:Number})],Dt.prototype,"dropped",void 0),t([ut({type:String})],Dt.prototype,"exposure",void 0),t([ut({type:String})],Dt.prototype,"integration",void 0),t([ut({type:Number})],Dt.prototype,"size",void 0),customElements.get(jt)||customElements.define(jt,Dt);const Lt="seestar-sky-dial",Bt=["N","NE","E","SE","S","SW","W","NW"];class Wt extends lt{constructor(){super(...arguments),this.altitude=0,this.azimuth=0,this.size=106}get clampedAltitude(){return t=this.altitude,e=0,i=90,Math.max(e,Math.min(i,t));var t,e,i}get normalizedAzimuth(){return(this.azimuth%360+360)%360}get direction(){const t=Math.round(this.normalizedAzimuth/45)%Bt.length;return Bt[t]??Bt[0]}get description(){return`Telescope pointing: altitude ${Math.round(this.clampedAltitude)} degrees, azimuth ${Math.round(this.normalizedAzimuth)} degrees ${this.direction}`}render(){const{size:t}=this,e=t/2,i=t/2-13,r=.5*i,o=i*(1-this.clampedAltitude/90),s=this.normalizedAzimuth*Math.PI/180;const n=e+o*Math.sin(s),a=e-o*Math.cos(s),c=e-i,l=e+i,d=e-i,p=e+i,h=i+9,u=`${Math.round(this.clampedAltitude)}°`,g=`${Math.round(this.normalizedAzimuth)}°`;return W`
      <div class="wrap">
        <svg
          width=${t}
          height=${t}
          viewBox="0 0 ${t} ${t}"
          role="img"
          aria-label=${this.description}
        >
          <circle
            cx=${e}
            cy=${e}
            r=${i.toFixed(2)}
            fill="none"
            stroke="var(--divider-color)"
            stroke-width="1.5"
          ></circle>
          <circle
            cx=${e}
            cy=${e}
            r=${r.toFixed(2)}
            fill="none"
            stroke="var(--divider-color)"
            stroke-width="1"
            stroke-dasharray="2 3"
          ></circle>
          <line
            x1=${e}
            y1=${c.toFixed(2)}
            x2=${e}
            y2=${l.toFixed(2)}
            stroke="var(--divider-color)"
            stroke-width="1"
            stroke-dasharray="2 3"
          ></line>
          <line
            x1=${d.toFixed(2)}
            y1=${e}
            x2=${p.toFixed(2)}
            y2=${e}
            stroke="var(--divider-color)"
            stroke-width="1"
            stroke-dasharray="2 3"
          ></line>
          <line
            x1=${e}
            y1=${e}
            x2=${n.toFixed(2)}
            y2=${a.toFixed(2)}
            stroke="var(--primary-color)"
            stroke-width="2"
          ></line>
          <circle
            cx=${n.toFixed(2)}
            cy=${a.toFixed(2)}
            r="8.5"
            fill="none"
            stroke="var(--primary-color)"
            stroke-width="1"
            opacity="0.45"
          ></circle>
          <circle cx=${n.toFixed(2)} cy=${a.toFixed(2)} r="4.5" fill="var(--primary-color)"></circle>
          <circle cx=${e} cy=${e} r="1.7" fill="var(--secondary-text-color)"></circle>
          <text
            x=${e}
            y=${c.toFixed(2)}
            text-anchor="middle"
            font-size="10.5"
            font-weight="500"
            fill="var(--secondary-text-color)"
          >
            N
          </text>
          <text
            x=${e}
            y=${(e+h+4).toFixed(2)}
            text-anchor="middle"
            font-size="10.5"
            fill="var(--secondary-text-color)"
          >
            S
          </text>
          <text
            x=${(e+h).toFixed(2)}
            y=${(e+4).toFixed(2)}
            text-anchor="middle"
            font-size="10.5"
            fill="var(--secondary-text-color)"
          >
            E
          </text>
          <text
            x=${(e-h).toFixed(2)}
            y=${(e+4).toFixed(2)}
            text-anchor="middle"
            font-size="10.5"
            fill="var(--secondary-text-color)"
          >
            W
          </text>
        </svg>
        <div class="readout">
          <div>ALT <b>${u}</b></div>
          <div>AZ <b>${g} ${this.direction}</b></div>
        </div>
      </div>
    `}}Wt.styles=n`
    :host {
      display: inline-block;
    }
    .wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 9px;
    }
    svg {
      display: block;
      overflow: visible;
    }
    .readout {
      display: flex;
      gap: 16px;
      font-size: 11.5px;
      color: var(--secondary-text-color);
    }
    .readout b {
      color: var(--primary-text-color);
      font-weight: 500;
    }
  `,t([ut({type:Number})],Wt.prototype,"altitude",void 0),t([ut({type:Number})],Wt.prototype,"azimuth",void 0),t([ut({type:Number})],Wt.prototype,"size",void 0),customElements.get(Lt)||customElements.define(Lt,Wt);const Vt="mdi:",qt="mdi-";function Kt(t){if(t.startsWith(Vt))return t;const e=t.startsWith(qt)?t.slice(4):t;return`${Vt}${e}`}const Gt="seestar-stat-chip",Zt={neutral:{fg:"var(--primary-text-color)",ic:"var(--secondary-text-color)",bg:"transparent",bd:"var(--divider-color)"},active:{fg:"var(--primary-color)",ic:"var(--primary-color)",bg:"color-mix(in srgb, var(--primary-color) 12%, transparent)",bd:"color-mix(in srgb, var(--primary-color) 40%, transparent)"},good:{fg:"var(--success-color, #2e7d32)",ic:"var(--success-color, #2e7d32)",bg:"color-mix(in srgb, var(--success-color, #2e7d32) 13%, transparent)",bd:"color-mix(in srgb, var(--success-color, #2e7d32) 36%, transparent)"},warn:{fg:"var(--warning-color, #f57c00)",ic:"var(--warning-color, #f57c00)",bg:"color-mix(in srgb, var(--warning-color, #f57c00) 15%, transparent)",bd:"color-mix(in srgb, var(--warning-color, #f57c00) 40%, transparent)"},muted:{fg:"var(--disabled-text-color, #9b9b9b)",ic:"var(--disabled-text-color, #9b9b9b)",bg:"transparent",bd:"var(--divider-color)"}};class Jt extends lt{constructor(){super(...arguments),this.icon="mdi:circle-medium",this.label="Status",this.tone="neutral"}get colors(){return Zt[this.tone]??Zt.neutral}render(){const{fg:t,ic:e,bg:i,bd:r}=this.colors;return W`
      <span class="chip" style="color:${t};background:${i};border-color:${r};">
        <ha-icon icon=${Kt(this.icon)} style="color:${e};" aria-hidden="true"></ha-icon>
        <span>${this.label}</span>
      </span>
    `}}Jt.styles=n`
    :host {
      display: inline-flex;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 30px;
      padding: 0 11px;
      border-radius: 15px;
      border: 1px solid;
      font-size: 12.5px;
      font-weight: 500;
      line-height: 1;
      white-space: nowrap;
    }
    ha-icon {
      --mdc-icon-size: 15px;
      width: 15px;
      height: 15px;
    }
  `,t([ut({type:String})],Jt.prototype,"icon",void 0),t([ut({type:String})],Jt.prototype,"label",void 0),t([ut({type:String})],Jt.prototype,"tone",void 0),customElements.get(Gt)||customElements.define(Gt,Jt);const Qt="seestar-stat-item",Xt={neutral:"var(--state-icon-color, var(--secondary-text-color))",good:"var(--success-color, #2e7d32)",warn:"var(--warning-color, #f57c00)",muted:"var(--disabled-text-color, #9b9b9b)"},Yt={neutral:"var(--primary-text-color)",good:"var(--success-color, #2e7d32)",warn:"var(--warning-color, #f57c00)",muted:"var(--disabled-text-color, #9b9b9b)"};class te extends lt{constructor(){super(...arguments),this.icon="mdi:circle-medium",this.label="Label",this.value="—",this.unit="",this.variant="row",this.tone="neutral"}get iconColor(){return Xt[this.tone]??Xt.neutral}get valueColor(){return Yt[this.tone]??Yt.neutral}renderRow(){return W`
      <div class="row">
        <ha-icon icon=${Kt(this.icon)} style="color:${this.iconColor};" aria-hidden="true"></ha-icon>
        <span class="label">${this.label}</span>
        <span class="value" style="color:${this.valueColor};"
          >${this.value}${this.unit.length>0?W`<span class="unit"> ${this.unit}</span>`:""}</span
        >
      </div>
    `}renderGrid(){return W`
      <div class="grid">
        <ha-icon icon=${Kt(this.icon)} style="color:${this.iconColor};" aria-hidden="true"></ha-icon>
        <span class="value" style="color:${this.valueColor};"
          >${this.value}${this.unit.length>0?W`<span class="unit"> ${this.unit}</span>`:""}</span
        >
        <span class="label">${this.label}</span>
      </div>
    `}render(){return"grid"===this.variant?this.renderGrid():this.renderRow()}}te.styles=n`
    :host {
      display: block;
    }

    /* ---- row variant ---- */
    .row {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 7px 0;
    }
    .row ha-icon {
      --mdc-icon-size: 19px;
      width: 22px;
      height: 19px;
      text-align: center;
      flex: none;
    }
    .row .label {
      flex: 1 1 auto;
      font-size: 13.5px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .row .value {
      font-size: 13.5px;
      font-weight: 500;
      white-space: nowrap;
    }
    .row .unit {
      font-size: 11.5px;
      font-weight: 400;
      color: var(--secondary-text-color);
    }

    /* ---- grid variant ---- */
    .grid {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 11px 12px;
      border-radius: 10px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
      min-width: 0;
    }
    .grid ha-icon {
      --mdc-icon-size: 18px;
      width: 18px;
      height: 18px;
    }
    .grid .value {
      font-size: 17px;
      font-weight: 500;
      line-height: 1.1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .grid .unit {
      font-size: 11px;
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    .grid .label {
      font-size: 11px;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `,t([ut({type:String})],te.prototype,"icon",void 0),t([ut({type:String})],te.prototype,"label",void 0),t([ut({type:String})],te.prototype,"value",void 0),t([ut({type:String})],te.prototype,"unit",void 0),t([ut({type:String})],te.prototype,"variant",void 0),t([ut({type:String})],te.prototype,"tone",void 0),customElements.get(Qt)||customElements.define(Qt,te);const ee="seestar-card-editor",ie=["#03a9f4","#5c6bc0","#26a69a","#ffa726"];class re extends lt{constructor(){super(...arguments),this.config={}}setConfig(t){this.config={...t}}updateConfig(t){const e={type:this.config.type??"custom:seestar-card",device:this.config.device??"",...this.config,...t};this.config=e;const i={config:e};this.dispatchEvent(new CustomEvent("config-changed",{detail:i,bubbles:!0,composed:!0}))}static valueOf(t){return t.target.value}onDeviceInput(t){this.updateConfig({device:re.valueOf(t)})}onNameInput(t){const e=re.valueOf(t);this.updateConfig({name:e.length>0?e:void 0})}onAccentPick(t){const e=this.config.accent===t?void 0:t;this.updateConfig({accent:e})}render(){const{device:t,name:e,accent:i}=this.config;return W`
      <div class="form">
        <label>
          Device (entity-id prefix)
          <input
            type="text"
            .value=${t??""}
            placeholder="seestar_s30_pro"
            @input=${this.onDeviceInput}
          />
          <span class="hint">Required. The bridge's device-id slug your entities start with.</span>
        </label>

        <label>
          Name
          <input type="text" .value=${e??""} placeholder="Seestar" @input=${this.onNameInput} />
          <span class="hint">Optional card title override.</span>
        </label>

        <label>
          Accent
          <div class="swatches">
            ${ie.map(t=>W`<button
                type="button"
                class=${"swatch "+(i===t?"selected":"")}
                style=${`background:${t};`}
                aria-label=${`Accent ${t}`}
                aria-pressed=${i===t}
                @click=${()=>this.onAccentPick(t)}
              ></button>`)}
          </div>
          <span class="hint">Optional. Defaults to your theme's primary colour.</span>
        </label>
      </div>
    `}}re.styles=n`
    .form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 8px 0;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    input {
      height: 38px;
      padding: 0 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, var(--ha-card-background, var(--secondary-background-color)));
      color: var(--primary-text-color);
      font-family: inherit;
      font-size: 14px;
    }
    input:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 1px;
    }
    .hint {
      font-size: 11.5px;
      color: var(--secondary-text-color);
    }
    .swatches {
      display: flex;
      gap: 10px;
    }
    .swatch {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 2px solid transparent;
      cursor: pointer;
      padding: 0;
      transition: border-color 0.15s ease;
    }
    .swatch.selected {
      border-color: var(--primary-text-color);
    }
    .swatch:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
  `,t([ut({attribute:!1})],re.prototype,"hass",void 0),t([gt()],re.prototype,"config",void 0),customElements.get(ee)||customElements.define(ee,re);const oe="seestar-card",se={primary:{bg:"var(--primary-color)",fg:"#fff"},tonal:{bg:"color-mix(in srgb, var(--primary-color) 13%, transparent)",fg:"var(--primary-color)"},danger:{bg:"color-mix(in srgb, var(--error-color, #db4437) 12%, transparent)",fg:"var(--error-color, #db4437)"},neutral:{bg:"var(--secondary-background-color, rgba(127, 127, 127, 0.12))",fg:"var(--primary-text-color)"}};class ne extends lt{constructor(){super(...arguments),this.armed=!1,this.live=!1}static getConfigElement(){return document.createElement("seestar-card-editor")}static getStubConfig(){return{type:`custom:${oe}`,device:"seestar_s30_pro"}}setConfig(t){if("object"!=typeof t||null===t)throw new Error("seestar-card: config must be an object");const e=t;if("string"!=typeof e.device||0===e.device.length)throw new Error("seestar-card: `device` (the entity-id prefix) is required");this.config=e}getCardSize(){return 6}toggleArmed(){this.armed=!this.armed}onArmKeydown(t){"Enter"!==t.key&&" "!==t.key&&"Spacebar"!==t.key||(t.preventDefault(),this.toggleArmed())}showSaved(){this.live=!1}showLive(){this.live=!0}runAction(t){const e=t?.service;if(void 0===t||void 0===e||void 0===this.hass)return;const[i,r]=e.split(".",2);void 0!==i&&void 0!==r&&0!==r.length&&this.hass.callService(i,r,t.data)}actionConfig(t){return this.config?.actions?.[t]}renderHeroImage(t,e){return W`<img src=${t} alt=${`Live capture of ${e}`} />`}renderHeroPlaceholder(t,e){return W`<div class="hero-placeholder" style=${`background:${this.heroTint(t)};`}>
      <div class="hero-stripes"></div>
      <ha-icon icon=${this.heroIcon(t)} aria-hidden="true"></ha-icon>
      <span class="hero-label">${e}</span>
      <span class="hero-hint">${this.heroHint(t)}</span>
    </div>`}renderHero(t){const e=this.live?t.liveImage:t.heroImage,i=t.target,r=t.subtitle,o=`${i} · ${"stacking"===t.badge?"STACKED":"LIVE"}`;return W`
      <div class="hero">
        ${void 0!==e?this.renderHeroImage(e,i):this.renderHeroPlaceholder(t,o)}
        <div class="scrim-top"></div>
        <div class="scrim-bottom"></div>

        <div class="source-toggle" role="group" aria-label="Image source">
          ${this.renderSourceButton("mdi:image-outline","Saved",!this.live,this.showSaved,!1)}
          ${this.renderSourceButton("mdi:video-outline","Live",this.live,this.showLive,!0)}
        </div>

        <div class="badge">
          <span class="badge-dot ${this.badgeKind(t)}"></span>
          <span>${this.badgeText(t)}</span>
        </div>

        <div class="hero-caption">
          <div class="hero-target">${i}</div>
          <div class="hero-mode">${r}</div>
        </div>
      </div>
    `}renderSourceButton(t,e,i,r,o){return W`<button type="button" class=${`${i?"active":"inactive"}${o?" live-source":""}`} aria-pressed=${i} @click=${r}>
      <ha-icon icon=${t} aria-hidden="true"></ha-icon>${e}
    </button>`}badgeKind(t){return this.live?"live":t.badge}badgeText(t){return"live"===this.badgeKind(t)?"LIVE":"STACKING"}heroTint(t){return"sun"===t.mode?"#1a1206":"scenery"===t.mode?"#171a16":"#0b1120"}heroIcon(t){return"sun"===t.mode?"mdi:weather-sunny":"scenery"===t.mode?"mdi:image-filter-hdr":"mdi:star-four-points"}heroHint(t){return this.live?"live view runs only for sessions started from Home Assistant":"scenery"===t.mode?"terrestrial / daylight":"awaiting camera preview"}renderSky(t){const{stack:e,dial:i}=t;return W`
      <div class="dials">
        <seestar-stack-ring
          .stacked=${e.stacked}
          .total=${e.total}
          .dropped=${e.dropped}
          .exposure=${e.exposure}
          .integration=${e.integration}
          .size=${106}
        ></seestar-stack-ring>
        <div class="v-divider"></div>
        <seestar-sky-dial .altitude=${i.altitude} .azimuth=${i.azimuth} .size=${106}></seestar-sky-dial>
      </div>
      ${this.renderStarsNote(t)}
    `}renderStarsNote(t){return t.starsDetectedInDaylight?W`<div class="stars-note daylight">
        <ha-icon icon="mdi:star-off-outline" aria-hidden="true"></ha-icon><span>Stars detected</span>
        <b>${St}</b><span>· daylight</span>
      </div>`:W`<div class="stars-note">
      <ha-icon icon="mdi:star-outline" aria-hidden="true"></ha-icon>Stars detected
      <b>${t.starsDetected}</b>
    </div>`}renderTerrestrial(t){return W`
      <div class="terrestrial">
        <ha-icon icon="mdi:image-filter-hdr" aria-hidden="true"></ha-icon>
        <div class="terrestrial-text">
          <div class="terrestrial-title">Terrestrial framing</div>
          <div class="terrestrial-sub">No sky tracking · plate-solve N/A</div>
        </div>
        <div class="terrestrial-exposure">
          <div class="value">${t.terrestrialExposure}</div>
          <div class="caption">exposure</div>
        </div>
      </div>
    `}renderDetected(t){const{detected:e}=t;return 0===e.objects.length?K:W`
      <div class="detected">
        <div class="detected-header">
          <ha-icon icon=${e.icon} aria-hidden="true"></ha-icon>${e.label}
        </div>
        <div class="chip-wrap">
          ${e.objects.map(t=>W`<seestar-stat-chip .icon=${e.icon} .label=${t} tone="neutral"></seestar-stat-chip>`)}
        </div>
      </div>
    `}renderChips(t){return W`
      <div class="chip-wrap">
        ${t.chips.map(t=>W`<seestar-stat-chip .icon=${t.icon} .label=${t.label} .tone=${t.tone}></seestar-stat-chip>`)}
      </div>
    `}renderArmRow(){return W`
      <div class="arm-row">
        <ha-icon
          icon=${this.armed?"mdi:lock-open-variant":"mdi:lock"}
          aria-hidden="true"
          style=${`color:${this.armed?"var(--primary-color)":"var(--secondary-text-color)"};`}
        ></ha-icon>
        <div class="arm-text">
          <div class="arm-title">Controls</div>
          <div class="arm-sub">${this.armed?"Unlocked — actions are live":"Off · tap to arm controls"}</div>
        </div>
        <button
          type="button"
          class=${"switch "+(this.armed?"on":"off")}
          role="switch"
          aria-checked=${this.armed}
          aria-label="Arm controls"
          @click=${this.toggleArmed}
          @keydown=${this.onArmKeydown}
        >
          <span class="knob"></span>
        </button>
      </div>
    `}renderActions(t){return W`
      <div class="actions">
        ${t.actions.map(t=>this.renderActionButton(t))}
      </div>
    `}renderActionButton(t){const e=this.actionConfig(t.key),i=void 0!==e?.service,r=se[t.tone],o="primary"===t.tone?"15px":"14px";return W`
      <button
        type="button"
        style=${`background:${r.bg};color:${r.fg};padding:0 ${o};`}
        ?disabled=${!i}
        aria-disabled=${!i}
        title=${i?t.label:"configure this action"}
        @click=${()=>this.runAction(e)}
      >
        <ha-icon icon=${Kt(t.icon)} aria-hidden="true"></ha-icon>${t.label}
      </button>
    `}render(){const{hass:t,config:e}=this;if(void 0===e||void 0===t)return K;const i=function(t){const{target:e,stack:i,pointing:r,mount:o,detection:s,health:n,preview:a}=t,c=function(t){const e=(t??"").toLowerCase();return e.includes("scenery")||e.includes("terrestrial")||e.includes("landscape")?"scenery":e.includes("sun")||e.includes("solar")?"sun":"star"}(e.mode),l="scenery"!==c,d=function(t,e){return!0===t.planRunning||(e??"").toLowerCase().includes("stack")}(o,i.state),p=Et.has(c),h=function(t){return"sun"===t?{label:"Active regions",icon:"mdi:weather-sunny"}:{label:"In frame",icon:"mdi:star-four-points-outline"}}(c);return{mode:c,target:Nt(t,c),subtitle:Ht(t,c),badge:d?"stacking":"live",heroImage:a.picture,liveImage:a.livePicture,cameraEntityId:a.cameraEntityId,sky:l,stack:{stacked:Mt(i.stackedFrames),total:Math.max(1,Mt(i.totalFrames)),dropped:Mt(i.droppedFrames),exposure:Pt(i.exposureSeconds),integration:(u=i.integrationMinutes,void 0===u?"":`${Math.round(u)} min`)},dial:{altitude:r.altitude??0,azimuth:r.azimuth??0},terrestrialExposure:Pt(i.exposureSeconds),starsDetectedInDaylight:p,starsDetected:void 0===r.starsDetected?St:String(r.starsDetected),detected:{label:h.label,icon:h.icon,objects:"scenery"===c?[]:Ut(s)},chips:Rt(o,n,c),actions:d?zt:Ct};var u}(kt(t,e.device,e.camera_entity,e.live_camera_entity)),r=void 0!==e.accent?`--seestar-accent:${e.accent};--primary-color:${e.accent};`:void 0;return W`
      <ha-card style=${r??K}>
        ${this.renderHero(i)}
        <div class="body">
          ${i.sky?this.renderSky(i):this.renderTerrestrial(i)}
          ${this.renderDetected(i)} ${this.renderChips(i)}
          <div class="h-divider"></div>
          ${this.renderArmRow()} ${this.armed?this.renderActions(i):K}
        </div>
      </ha-card>
    `}}ne.styles=n`
    :host {
      --seestar-accent: var(--primary-color);
    }
    ha-card {
      display: block;
      overflow: hidden;
      font-family: var(--paper-font-body1_-_font-family, Roboto, system-ui, sans-serif);
      background: var(--card-background-color, var(--ha-card-background));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0, 0, 0, 0.1));
    }

    /* ---- hero ---- */
    .hero {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 10;
      background: #05070c;
      overflow: hidden;
    }
    .hero img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
    }
    .hero-placeholder {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 7px;
    }
    .hero-stripes {
      position: absolute;
      inset: 0;
      background-image: repeating-linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.04) 0 11px,
        rgba(255, 255, 255, 0) 11px 22px
      );
    }
    .hero-placeholder ha-icon {
      --mdc-icon-size: 34px;
      width: 34px;
      height: 34px;
      color: rgba(255, 255, 255, 0.42);
      z-index: 1;
    }
    .hero-label {
      font-family: 'Roboto Mono', ui-monospace, monospace;
      font-size: 11px;
      letter-spacing: 0.09em;
      color: rgba(255, 255, 255, 0.6);
      z-index: 1;
    }
    .hero-hint {
      font-family: 'Roboto Mono', ui-monospace, monospace;
      font-size: 9.5px;
      letter-spacing: 0.05em;
      color: rgba(255, 255, 255, 0.5);
      z-index: 1;
    }
    .scrim-top {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 60px;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent);
      pointer-events: none;
    }
    .scrim-bottom {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 96px;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.72), transparent);
      pointer-events: none;
    }

    /* ---- hero controls ---- */
    .source-toggle {
      position: absolute;
      top: 11px;
      left: 11px;
      display: flex;
      padding: 3px;
      gap: 2px;
      border-radius: 9px;
      background: rgba(20, 20, 22, 0.55);
      backdrop-filter: blur(6px);
    }
    .source-toggle button {
      position: relative;
      border: none;
      cursor: pointer;
      height: 26px;
      padding: 0 11px;
      border-radius: 7px;
      font-family: inherit;
      font-size: 12px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    /* a11y: extend the pressable target to >=36px without growing the 26px pill */
    .source-toggle button::after {
      content: '';
      position: absolute;
      top: -5px;
      bottom: -5px;
      left: 0;
      right: 0;
    }
    .source-toggle ha-icon {
      --mdc-icon-size: 14px;
      width: 14px;
      height: 14px;
    }
    /* Live glyph reads 15px in the design; Saved stays 14px. */
    .source-toggle button.live-source ha-icon {
      --mdc-icon-size: 15px;
      width: 15px;
      height: 15px;
    }
    .source-toggle button.active {
      background: rgba(255, 255, 255, 0.92);
      color: #16181d;
    }
    .source-toggle button.inactive {
      background: transparent;
      color: rgba(255, 255, 255, 0.88);
    }
    .badge {
      position: absolute;
      top: 13px;
      right: 12px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 26px;
      padding: 0 10px;
      border-radius: 13px;
      background: rgba(20, 20, 22, 0.55);
      backdrop-filter: blur(6px);
      color: #fff;
      font-size: 11.5px;
      font-weight: 500;
      letter-spacing: 0.03em;
    }
    .badge-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }
    .badge-dot.stacking {
      background: var(--primary-color);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 30%, transparent);
    }
    .badge-dot.live {
      background: #ff5252;
      box-shadow: 0 0 0 3px rgba(255, 82, 82, 0.28);
    }
    .hero-caption {
      position: absolute;
      left: 15px;
      bottom: 12px;
      right: 15px;
      color: #fff;
    }
    .hero-target {
      font-size: 19px;
      font-weight: 500;
      line-height: 1.15;
    }
    .hero-mode {
      font-size: 12.5px;
      opacity: 0.82;
      margin-top: 1px;
    }

    /* ---- body ---- */
    .body {
      padding: 14px 14px 15px;
      display: flex;
      flex-direction: column;
      gap: 13px;
    }
    .dials {
      display: flex;
      gap: 6px;
      justify-content: space-around;
      align-items: flex-start;
    }
    .v-divider {
      width: 1px;
      align-self: stretch;
      background: var(--divider-color);
    }
    .stars-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 11.5px;
      color: var(--secondary-text-color);
      margin-top: -4px;
    }
    .stars-note ha-icon {
      --mdc-icon-size: 14px;
      width: 14px;
      height: 14px;
    }
    .stars-note b {
      color: var(--primary-text-color);
      font-weight: 500;
    }
    .stars-note.daylight b {
      color: var(--disabled-text-color, var(--secondary-text-color));
    }

    /* ---- terrestrial box ---- */
    .terrestrial {
      display: flex;
      align-items: center;
      gap: 13px;
      padding: 8px 4px;
      border: 1px dashed var(--divider-color);
      border-radius: 10px;
    }
    .terrestrial > ha-icon {
      --mdc-icon-size: 30px;
      width: 30px;
      height: 30px;
      color: var(--state-icon-color, var(--secondary-text-color));
    }
    .terrestrial-text {
      flex: 1;
      min-width: 0;
    }
    .terrestrial-title {
      font-size: 13.5px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .terrestrial-sub {
      font-size: 11.5px;
      color: var(--secondary-text-color);
    }
    .terrestrial-exposure {
      text-align: right;
    }
    .terrestrial-exposure .value {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .terrestrial-exposure .caption {
      font-size: 10.5px;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    /* ---- detected objects ---- */
    .detected {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .detected-header {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .detected-header ha-icon {
      --mdc-icon-size: 14px;
      width: 14px;
      height: 14px;
    }
    .chip-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
    }

    /* ---- arm row ---- */
    .h-divider {
      height: 1px;
      background: var(--divider-color);
    }
    .arm-row {
      display: flex;
      align-items: center;
      gap: 11px;
    }
    .arm-row > ha-icon {
      --mdc-icon-size: 21px;
      width: 21px;
      height: 21px;
    }
    .arm-text {
      flex: 1;
      min-width: 0;
    }
    .arm-title {
      font-size: 13.5px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .arm-sub {
      font-size: 11.5px;
      color: var(--secondary-text-color);
    }
    .switch {
      position: relative;
      width: 40px;
      height: 23px;
      border-radius: 12px;
      cursor: pointer;
      flex: none;
      background: color-mix(in srgb, var(--secondary-text-color) 40%, transparent);
      transition: background 0.18s ease;
      border: none;
      padding: 0;
    }
    .switch.on {
      background: var(--primary-color);
    }
    .switch:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    /* a11y: extend the pressable target to >=36px without growing the 40x23 pill */
    .switch::after {
      content: '';
      position: absolute;
      top: -6.5px;
      bottom: -6.5px;
      left: 0;
      right: 0;
    }
    .switch .knob {
      position: absolute;
      top: 2.5px;
      left: 2.5px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
      transition: left 0.18s ease;
    }
    .switch.on .knob {
      left: 19.5px;
    }

    /* ---- actions ---- */
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding-top: 2px;
    }
    .actions button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 36px;
      padding: 0 14px;
      border: none;
      border-radius: 8px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
    }
    .actions button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
    .actions button ha-icon {
      --mdc-icon-size: 17px;
      width: 17px;
      height: 17px;
    }
  `,t([ut({attribute:!1})],ne.prototype,"hass",void 0),t([gt()],ne.prototype,"config",void 0),t([gt()],ne.prototype,"armed",void 0),t([gt()],ne.prototype,"live",void 0),customElements.get(oe)||customElements.define(oe,ne);const ae=window;ae.customCards=ae.customCards??[],ae.customCards.some(t=>t.type===oe)||ae.customCards.push({type:oe,name:"Seestar Card",description:"Live ZWO Seestar session",preview:!0});export{ne as SeestarCard};
