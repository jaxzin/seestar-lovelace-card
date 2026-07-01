function t(t,e,s,i){var r,o=arguments.length,n=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(n=(o<3?r(n):o>3?r(e,s,n):r(e,s))||n);return o>3&&n&&Object.defineProperty(e,s,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),r=new WeakMap;let o=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&r.set(e,t))}return t}toString(){return this.cssText}};const n=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,f=u.trustedTypes,_=f?f.emptyScript:"",$=u.reactiveElementPolyfillSupport,g=(t,e)=>t,m={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},v=(t,e)=>!a(t,e),y={attribute:!0,type:String,converter:m,reflect:!1,useDefault:!1,hasChanged:v};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let A=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const o=i?.call(this);r?.call(this,e),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),r=e.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const r=(void 0!==s.converter?.toAttribute?s.converter:m).toAttribute(e,s.type);this._$Em=t,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:m;this._$Em=i;const o=r.fromAttribute(e,t.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(void 0!==t){const o=this.constructor;if(!1===i&&(r=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??v)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[g("elementProperties")]=new Map,A[g("finalized")]=new Map,$?.({ReactiveElement:A}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const b=globalThis,w=t=>t,S=b.trustedTypes,E=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,x="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+P,O=`<${C}>`,k=document,T=()=>k.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,H="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,j=/>/g,z=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,I=/"/g,F=/^(?:script|style|textarea|title)$/i,L=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),B=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),q=new WeakMap,W=k.createTreeWalker(k,129);function J(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const K=(t,e)=>{const s=t.length-1,i=[];let r,o=2===e?"<svg>":3===e?"<math>":"",n=R;for(let e=0;e<s;e++){const s=t[e];let a,c,l=-1,h=0;for(;h<s.length&&(n.lastIndex=h,c=n.exec(s),null!==c);)h=n.lastIndex,n===R?"!--"===c[1]?n=N:void 0!==c[1]?n=j:void 0!==c[2]?(F.test(c[2])&&(r=RegExp("</"+c[2],"g")),n=z):void 0!==c[3]&&(n=z):n===z?">"===c[0]?(n=r??R,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,a=c[1],n=void 0===c[3]?z:'"'===c[3]?I:D):n===I||n===D?n=z:n===N||n===j?n=R:(n=z,r=void 0);const d=n===z&&t[e+1].startsWith("/>")?" ":"";o+=n===R?s+O:l>=0?(i.push(a),s.slice(0,l)+x+s.slice(l)+P+d):s+P+(-2===l?e:d)}return[J(t,o+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Z{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[c,l]=K(t,e);if(this.el=Z.createElement(c,s),W.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=W.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(x)){const e=l[o++],s=i.getAttribute(t).split(P),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:n[2],strings:s,ctor:"."===n[1]?tt:"?"===n[1]?et:"@"===n[1]?st:Y}),i.removeAttribute(t)}else t.startsWith(P)&&(a.push({type:6,index:r}),i.removeAttribute(t));if(F.test(i.tagName)){const t=i.textContent.split(P),e=t.length-1;if(e>0){i.textContent=S?S.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],T()),W.nextNode(),a.push({type:2,index:++r});i.append(t[e],T())}}}else if(8===i.nodeType)if(i.data===C)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(P,t+1));)a.push({type:7,index:r}),t+=P.length-1}r++}}static createElement(t,e){const s=k.createElement("template");return s.innerHTML=t,s}}function G(t,e,s=t,i){if(e===B)return e;let r=void 0!==i?s._$Co?.[i]:s._$Cl;const o=U(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=r:s._$Cl=r),void 0!==r&&(e=G(t,r._$AS(t,e.values),r,i)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??k).importNode(e,!0);W.currentNode=i;let r=W.nextNode(),o=0,n=0,a=s[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new X(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new it(r,this,t)),this._$AV.push(e),a=s[++n]}o!==a?.index&&(r=W.nextNode(),o++)}return W.currentNode=k,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),U(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Z.createElement(J(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Q(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new Z(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new X(this.O(T()),this.O(T()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=V}_$AI(t,e=this,s,i){const r=this.strings;let o=!1;if(void 0===r)t=G(this,t,e,0),o=!U(t)||t!==this._$AH&&t!==B,o&&(this._$AH=t);else{const i=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=G(this,i[s+n],e,n),a===B&&(a=this._$AH[n]),o||=!U(a)||a!==this._$AH[n],a===V?t=V:t!==V&&(t+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!i&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class st extends Y{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??V)===B)return;const s=this._$AH,i=t===V&&s!==V||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==V&&(s===V||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const rt=b.litHtmlPolyfillSupport;rt?.(Z,X),(b.litHtmlVersions??=[]).push("3.3.3");const ot=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class nt extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let r=i._$litPart$;if(void 0===r){const t=s?.renderBefore??null;i._$litPart$=r=new X(e.insertBefore(T(),t),t,void 0,s??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}nt._$litElement$=!0,nt.finalized=!0,ot.litElementHydrateSupport?.({LitElement:nt});const at=ot.litElementPolyfillSupport;at?.({LitElement:nt}),(ot.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ct={attribute:!0,type:String,converter:m,reflect:!1,hasChanged:v},lt=(t=ct,e,s)=>{const{kind:i,metadata:r}=s;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),o.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const r=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,r,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const r=this[i];e.call(this,s),this.requestUpdate(i,r,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ht(t){return(e,s)=>"object"==typeof s?lt(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dt=new Set(["unavailable","unknown",""]),pt={sensor:{telephotoTarget:"telephoto_target",wideTarget:"wide_field_target",telephotoMode:"telephoto_mode",activeCamera:"active_camera",stackState:"stack_state",stackedFrames:"stacked_frames",totalFrames:"total_frames",droppedFrames:"dropped_frames",exposure:"exposure",integrationTime:"integration_time",altitude:"altitude",azimuth:"azimuth",rightAscension:"right_ascension",declination:"declination",fieldOfView:"field_of_view",fieldRotation:"field_rotation",starsDetected:"stars_detected",plan:"plan",gotoState:"goto_state",mountMode:"mount_mode",catalogObjects:"catalog_objects",objectsInFrame:"objects_in_frame",battery:"battery",sensorTemperature:"sensor_temperature",charger:"charger",storageUsed:"storage_used",focuserPosition:"focuser_position",firmware:"firmware",lastAlert:"last_alert"},binarySensor:{planRunning:"plan_running",tracking:"tracking",slewing:"slewing",parked:"parked",atHome:"at_home",dewHeater:"dew_heater",connected:"connected"},camera:{livePreview:"live_stacked_preview"}};function ut(t,e,s){return`${t}.${e}_${s}`}function ft(t,e){return t.states[e]}function _t(t){return void 0!==t&&!dt.has(t.state)}function $t(t,e,s){const i=ft(t,ut("sensor",e,s));return _t(i)?i.state:void 0}function gt(t,e,s){const i=$t(t,e,s);if(void 0===i)return;const r=Number(i);return Number.isFinite(r)?r:void 0}function mt(t,e,s){const i=ft(t,ut("binary_sensor",e,s));return _t(i)?"on"===i.state:void 0}function vt(t,e,s){const i=ft(t,ut("camera",e,s));if(!_t(i))return;const r=i.attributes.entity_picture;return"string"==typeof r?r:void 0}const yt="—";function At(t,e){return void 0===t?yt:`${t}${e}`}function bt(t){return void 0===t||0===t.length?yt:t}let wt=class extends nt{setConfig(t){if("object"!=typeof t||null===t)throw new Error("seestar-card: config must be an object");const e=t;if("string"!=typeof e.device||0===e.device.length)throw new Error("seestar-card: `device` (the entity-id prefix) is required");this.config=e}getCardSize(){return 5}stats(t){const{stack:e,pointing:s,health:i,mount:r}=t;return[{label:"Mode",value:bt(t.target.mode)},{label:"Frames",value:bt(this.framesSummary(t))},{label:"Integration",value:At(e.integrationMinutes," min")},{label:"Altitude",value:At(s.altitude,"°")},{label:"Azimuth",value:At(s.azimuth,"°")},{label:"Stars",value:At(s.starsDetected,"")},{label:"Plan",value:bt(r.plan)},{label:"Battery",value:At(i.battery,"%")}]}framesSummary(t){const{stackedFrames:e,totalFrames:s}=t.stack;if(void 0!==e||void 0!==s)return`${e??yt} / ${s??yt}`}renderHero(t){const{picture:e}=t.preview;return void 0===e?L`<div class="hero">
        <span class="hero-placeholder">No preview</span>
      </div>`:L`<div class="hero">
      <img src=${e} alt="Live stacked preview" />
    </div>`}render(){const{hass:t,config:e}=this;if(void 0===e||void 0===t)return V;const s=function(t,e){const{sensor:s,camera:i}=pt;return{prefix:e,preview:{cameraEntityId:ut("camera",e,i.livePreview),picture:vt(t,e,i.livePreview)},target:{telephotoTarget:$t(t,e,s.telephotoTarget),wideTarget:$t(t,e,s.wideTarget),mode:$t(t,e,s.telephotoMode),activeCamera:$t(t,e,s.activeCamera)},stack:{state:$t(t,e,s.stackState),stackedFrames:gt(t,e,s.stackedFrames),totalFrames:gt(t,e,s.totalFrames),droppedFrames:gt(t,e,s.droppedFrames),exposureSeconds:gt(t,e,s.exposure),integrationMinutes:gt(t,e,s.integrationTime)},pointing:{altitude:gt(t,e,s.altitude),azimuth:gt(t,e,s.azimuth),rightAscension:gt(t,e,s.rightAscension),declination:gt(t,e,s.declination),fieldOfView:$t(t,e,s.fieldOfView),fieldRotation:gt(t,e,s.fieldRotation),starsDetected:gt(t,e,s.starsDetected)},mount:{plan:$t(t,e,s.plan),planRunning:mt(t,e,pt.binarySensor.planRunning),tracking:mt(t,e,pt.binarySensor.tracking),slewing:mt(t,e,pt.binarySensor.slewing),gotoState:$t(t,e,s.gotoState),mountMode:$t(t,e,s.mountMode),parked:mt(t,e,pt.binarySensor.parked),atHome:mt(t,e,pt.binarySensor.atHome)},detection:{catalogObjects:$t(t,e,s.catalogObjects),objectsInFrame:gt(t,e,s.objectsInFrame)},health:{battery:gt(t,e,s.battery),sensorTemperature:gt(t,e,s.sensorTemperature),charger:$t(t,e,s.charger),storageUsed:gt(t,e,s.storageUsed),focuserPosition:gt(t,e,s.focuserPosition),firmware:$t(t,e,s.firmware),dewHeater:mt(t,e,pt.binarySensor.dewHeater),connected:mt(t,e,pt.binarySensor.connected),lastAlert:$t(t,e,s.lastAlert)}}}(t,e.device),i=e.accent,r=e.name??e.device;return L`
      <ha-card style=${i?`--seestar-accent: ${i}`:V}>
        ${this.renderHero(s)}
        <div class="heading">
          <div class="title">${r}</div>
          <div class="subtitle">${function(t){return bt(t.target.telephotoTarget??t.target.wideTarget)}(s)}</div>
        </div>
        <div class="stats">
          ${this.stats(s).map(t=>L`<div class="stat">
              <div class="stat-label">${t.label}</div>
              <div class="stat-value">${t.value}</div>
            </div>`)}
        </div>
      </ha-card>
    `}};wt.styles=((t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new o(s,t,i)})`
    :host {
      --seestar-accent: var(--primary-color);
    }
    ha-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .hero {
      position: relative;
      width: 100%;
      aspect-ratio: 4 / 3;
      background: var(--secondary-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hero img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .hero-placeholder {
      color: var(--secondary-text-color);
      font-size: var(--paper-font-body1_-_font-size, 14px);
    }
    .heading {
      padding: 12px 16px 4px;
    }
    .title {
      color: var(--primary-text-color);
      font-size: var(--ha-card-header-font-size, 20px);
      font-weight: 500;
    }
    .subtitle {
      color: var(--secondary-text-color);
      font-size: var(--paper-font-body1_-_font-size, 14px);
      border-left: 3px solid var(--seestar-accent);
      padding-left: 8px;
      margin-top: 4px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1px;
      background: var(--divider-color);
      margin-top: 12px;
    }
    .stat {
      background: var(--card-background-color);
      padding: 10px 16px;
    }
    .stat-label {
      color: var(--secondary-text-color);
      font-size: var(--paper-font-caption_-_font-size, 12px);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .stat-value {
      color: var(--primary-text-color);
      font-size: var(--paper-font-subhead_-_font-size, 16px);
      font-weight: 500;
    }
  `,t([ht({attribute:!1})],wt.prototype,"hass",void 0),t([function(t){return ht({...t,state:!0,attribute:!1})}()],wt.prototype,"config",void 0),wt=t([(t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})("seestar-card")],wt);export{wt as SeestarCard};
