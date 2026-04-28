import{c as D,C as ze,A as L,_ as qe,E as He,b5 as Ve,G as We,H as Ke,I as Xe,J as oe,b6 as Ge,b2 as _e,b4 as ge,x as z,b7 as be,a$ as Ye,a_ as J,b0 as ke,y as U,b8 as xe,b9 as F,ba as Je,r as k,j as i,X as ye,T as Ze,bb as Qe,bc as et,v as tt,bd as st,be as nt}from"./index-DAPgw2VV.js";import{d as rt,u as it,f as ae,e as ot,C as at,A as ct,g as lt,c as ut}from"./index-o7e5Gsyj.js";import{M as dt}from"./Modal-CAzjITQD.js";/**
 * @license lucide-react v0.561.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],pt=D("eye-off",ht);/**
 * @license lucide-react v0.561.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mt=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],ft=D("eye",mt);/**
 * @license lucide-react v0.561.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _t=[["path",{d:"M16 5h6",key:"1vod17"}],["path",{d:"M19 2v6",key:"4bpg5p"}],["path",{d:"M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5",key:"1ue2ih"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}]],gt=D("image-plus",_t);/**
 * @license lucide-react v0.561.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bt=[["path",{d:"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",key:"18887p"}]],$=D("message-square",bt);/**
 * @license lucide-react v0.561.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kt=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],we=D("send",kt);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Re="firebasestorage.googleapis.com",Te="storageBucket",xt=2*60*1e3,yt=10*60*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class w extends We{constructor(t,s,n=0){super(K(t),`Firebase Storage: ${s} (${K(t)})`),this.status_=n,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,w.prototype)}get status(){return this.status_}set status(t){this.status_=t}_codeEquals(t){return K(t)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(t){this.customData.serverResponse=t,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var y;(function(e){e.UNKNOWN="unknown",e.OBJECT_NOT_FOUND="object-not-found",e.BUCKET_NOT_FOUND="bucket-not-found",e.PROJECT_NOT_FOUND="project-not-found",e.QUOTA_EXCEEDED="quota-exceeded",e.UNAUTHENTICATED="unauthenticated",e.UNAUTHORIZED="unauthorized",e.UNAUTHORIZED_APP="unauthorized-app",e.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",e.INVALID_CHECKSUM="invalid-checksum",e.CANCELED="canceled",e.INVALID_EVENT_NAME="invalid-event-name",e.INVALID_URL="invalid-url",e.INVALID_DEFAULT_BUCKET="invalid-default-bucket",e.NO_DEFAULT_BUCKET="no-default-bucket",e.CANNOT_SLICE_BLOB="cannot-slice-blob",e.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",e.NO_DOWNLOAD_URL="no-download-url",e.INVALID_ARGUMENT="invalid-argument",e.INVALID_ARGUMENT_COUNT="invalid-argument-count",e.APP_DELETED="app-deleted",e.INVALID_ROOT_OPERATION="invalid-root-operation",e.INVALID_FORMAT="invalid-format",e.INTERNAL_ERROR="internal-error",e.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(y||(y={}));function K(e){return"storage/"+e}function Z(){const e="An unknown error occurred, please check the error payload for server response.";return new w(y.UNKNOWN,e)}function wt(e){return new w(y.OBJECT_NOT_FOUND,"Object '"+e+"' does not exist.")}function Rt(e){return new w(y.QUOTA_EXCEEDED,"Quota for bucket '"+e+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function Tt(){const e="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new w(y.UNAUTHENTICATED,e)}function Nt(){return new w(y.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function jt(e){return new w(y.UNAUTHORIZED,"User does not have permission to access '"+e+"'.")}function vt(){return new w(y.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function At(){return new w(y.CANCELED,"User canceled the upload/download.")}function Et(e){return new w(y.INVALID_URL,"Invalid URL '"+e+"'.")}function Ct(e){return new w(y.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+e+"'.")}function St(){return new w(y.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+Te+"' property when initializing the app?")}function Ut(){return new w(y.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function Ot(){return new w(y.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function It(e){return new w(y.UNSUPPORTED_ENVIRONMENT,`${e} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function G(e){return new w(y.INVALID_ARGUMENT,e)}function Ne(){return new w(y.APP_DELETED,"The Firebase app was deleted.")}function Pt(e){return new w(y.INVALID_ROOT_OPERATION,"The operation '"+e+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function P(e,t){return new w(y.INVALID_FORMAT,"String does not match format '"+e+"': "+t)}function I(e){throw new w(y.INTERNAL_ERROR,"Internal error: "+e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j{constructor(t,s){this.bucket=t,this.path_=s}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const t=encodeURIComponent;return"/b/"+t(this.bucket)+"/o/"+t(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(t,s){let n;try{n=j.makeFromUrl(t,s)}catch{return new j(t,"")}if(n.path==="")return n;throw Ct(t)}static makeFromUrl(t,s){let n=null;const r="([A-Za-z0-9.\\-_]+)";function o(R){R.path.charAt(R.path.length-1)==="/"&&(R.path_=R.path_.slice(0,-1))}const a="(/(.*))?$",c=new RegExp("^gs://"+r+a,"i"),u={bucket:1,path:3};function d(R){R.path_=decodeURIComponent(R.path)}const m="v[A-Za-z0-9_]+",f=s.replace(/[.]/g,"\\."),p="(/([^?#]*).*)?$",l=new RegExp(`^https?://${f}/${m}/b/${r}/o${p}`,"i"),h={bucket:1,path:3},g=s===Re?"(?:storage.googleapis.com|storage.cloud.google.com)":s,_="([^?#]*)",T=new RegExp(`^https?://${g}/${r}/${_}`,"i"),x=[{regex:c,indices:u,postModify:o},{regex:l,indices:h,postModify:d},{regex:T,indices:{bucket:1,path:2},postModify:d}];for(let R=0;R<x.length;R++){const E=x[R],V=E.regex.exec(t);if(V){const $e=V[E.indices.bucket];let W=V[E.indices.path];W||(W=""),n=new j($e,W),E.postModify(n);break}}if(n==null)throw Et(t);return n}}class Dt{constructor(t){this.promise_=Promise.reject(t)}getPromise(){return this.promise_}cancel(t=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lt(e,t,s){let n=1,r=null,o=null,a=!1,c=0;function u(){return c===2}let d=!1;function m(..._){d||(d=!0,t.apply(null,_))}function f(_){r=setTimeout(()=>{r=null,e(l,u())},_)}function p(){o&&clearTimeout(o)}function l(_,...T){if(d){p();return}if(_){p(),m.call(null,_,...T);return}if(u()||a){p(),m.call(null,_,...T);return}n<64&&(n*=2);let x;c===1?(c=2,x=0):x=(n+Math.random())*1e3,f(x)}let h=!1;function g(_){h||(h=!0,p(),!d&&(r!==null?(_||(c=2),clearTimeout(r),f(0)):_||(c=1)))}return f(0),o=setTimeout(()=>{a=!0,g(!0)},s),g}function Mt(e){e(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bt(e){return e!==void 0}function Ft(e){return typeof e=="object"&&!Array.isArray(e)}function Q(e){return typeof e=="string"||e instanceof String}function ce(e){return ee()&&e instanceof Blob}function ee(){return typeof Blob<"u"}function le(e,t,s,n){if(n<t)throw G(`Invalid value for '${e}'. Expected ${t} or greater.`);if(n>s)throw G(`Invalid value for '${e}'. Expected ${s} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function q(e,t,s){let n=t;return s==null&&(n=`https://${t}`),`${s}://${n}/v0${e}`}function je(e){const t=encodeURIComponent;let s="?";for(const n in e)if(e.hasOwnProperty(n)){const r=t(n)+"="+t(e[n]);s=s+r+"&"}return s=s.slice(0,-1),s}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var C;(function(e){e[e.NO_ERROR=0]="NO_ERROR",e[e.NETWORK_ERROR=1]="NETWORK_ERROR",e[e.ABORT=2]="ABORT"})(C||(C={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $t(e,t){const s=e>=500&&e<600,r=[408,429].indexOf(e)!==-1,o=t.indexOf(e)!==-1;return s||r||o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zt{constructor(t,s,n,r,o,a,c,u,d,m,f,p=!0){this.url_=t,this.method_=s,this.headers_=n,this.body_=r,this.successCodes_=o,this.additionalRetryCodes_=a,this.callback_=c,this.errorCallback_=u,this.timeout_=d,this.progressCallback_=m,this.connectionFactory_=f,this.retry=p,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((l,h)=>{this.resolve_=l,this.reject_=h,this.start_()})}start_(){const t=(n,r)=>{if(r){n(!1,new M(!1,null,!0));return}const o=this.connectionFactory_();this.pendingConnection_=o;const a=c=>{const u=c.loaded,d=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(u,d)};this.progressCallback_!==null&&o.addUploadProgressListener(a),o.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&o.removeUploadProgressListener(a),this.pendingConnection_=null;const c=o.getErrorCode()===C.NO_ERROR,u=o.getStatus();if(!c||$t(u,this.additionalRetryCodes_)&&this.retry){const m=o.getErrorCode()===C.ABORT;n(!1,new M(!1,null,m));return}const d=this.successCodes_.indexOf(u)!==-1;n(!0,new M(d,o))})},s=(n,r)=>{const o=this.resolve_,a=this.reject_,c=r.connection;if(r.wasSuccessCode)try{const u=this.callback_(c,c.getResponse());Bt(u)?o(u):o()}catch(u){a(u)}else if(c!==null){const u=Z();u.serverResponse=c.getErrorText(),this.errorCallback_?a(this.errorCallback_(c,u)):a(u)}else if(r.canceled){const u=this.appDelete_?Ne():At();a(u)}else{const u=vt();a(u)}};this.canceled_?s(!1,new M(!1,null,!0)):this.backoffId_=Lt(t,s,this.timeout_)}getPromise(){return this.promise_}cancel(t){this.canceled_=!0,this.appDelete_=t||!1,this.backoffId_!==null&&Mt(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class M{constructor(t,s,n){this.wasSuccessCode=t,this.connection=s,this.canceled=!!n}}function qt(e,t){t!==null&&t.length>0&&(e.Authorization="Firebase "+t)}function Ht(e,t){e["X-Firebase-Storage-Version"]="webjs/"+(t??"AppManager")}function Vt(e,t){t&&(e["X-Firebase-GMPID"]=t)}function Wt(e,t){t!==null&&(e["X-Firebase-AppCheck"]=t)}function Kt(e,t,s,n,r,o,a=!0){const c=je(e.urlParams),u=e.url+c,d=Object.assign({},e.headers);return Vt(d,t),qt(d,s),Ht(d,o),Wt(d,n),new zt(u,e.method,d,e.body,e.successCodes,e.additionalRetryCodes,e.handler,e.errorHandler,e.timeout,e.progressCallback,r,a)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xt(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function Gt(...e){const t=Xt();if(t!==void 0){const s=new t;for(let n=0;n<e.length;n++)s.append(e[n]);return s.getBlob()}else{if(ee())return new Blob(e);throw new w(y.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function Yt(e,t,s){return e.webkitSlice?e.webkitSlice(t,s):e.mozSlice?e.mozSlice(t,s):e.slice?e.slice(t,s):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jt(e){if(typeof atob>"u")throw It("base-64");return atob(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const v={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class X{constructor(t,s){this.data=t,this.contentType=s||null}}function Zt(e,t){switch(e){case v.RAW:return new X(ve(t));case v.BASE64:case v.BASE64URL:return new X(Ae(e,t));case v.DATA_URL:return new X(es(t),ts(t))}throw Z()}function ve(e){const t=[];for(let s=0;s<e.length;s++){let n=e.charCodeAt(s);if(n<=127)t.push(n);else if(n<=2047)t.push(192|n>>6,128|n&63);else if((n&64512)===55296)if(!(s<e.length-1&&(e.charCodeAt(s+1)&64512)===56320))t.push(239,191,189);else{const o=n,a=e.charCodeAt(++s);n=65536|(o&1023)<<10|a&1023,t.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|n&63)}else(n&64512)===56320?t.push(239,191,189):t.push(224|n>>12,128|n>>6&63,128|n&63)}return new Uint8Array(t)}function Qt(e){let t;try{t=decodeURIComponent(e)}catch{throw P(v.DATA_URL,"Malformed data URL.")}return ve(t)}function Ae(e,t){switch(e){case v.BASE64:{const r=t.indexOf("-")!==-1,o=t.indexOf("_")!==-1;if(r||o)throw P(e,"Invalid character '"+(r?"-":"_")+"' found: is it base64url encoded?");break}case v.BASE64URL:{const r=t.indexOf("+")!==-1,o=t.indexOf("/")!==-1;if(r||o)throw P(e,"Invalid character '"+(r?"+":"/")+"' found: is it base64 encoded?");t=t.replace(/-/g,"+").replace(/_/g,"/");break}}let s;try{s=Jt(t)}catch(r){throw r.message.includes("polyfill")?r:P(e,"Invalid character found")}const n=new Uint8Array(s.length);for(let r=0;r<s.length;r++)n[r]=s.charCodeAt(r);return n}class Ee{constructor(t){this.base64=!1,this.contentType=null;const s=t.match(/^data:([^,]+)?,/);if(s===null)throw P(v.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const n=s[1]||null;n!=null&&(this.base64=ss(n,";base64"),this.contentType=this.base64?n.substring(0,n.length-7):n),this.rest=t.substring(t.indexOf(",")+1)}}function es(e){const t=new Ee(e);return t.base64?Ae(v.BASE64,t.rest):Qt(t.rest)}function ts(e){return new Ee(e).contentType}function ss(e,t){return e.length>=t.length?e.substring(e.length-t.length)===t:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A{constructor(t,s){let n=0,r="";ce(t)?(this.data_=t,n=t.size,r=t.type):t instanceof ArrayBuffer?(s?this.data_=new Uint8Array(t):(this.data_=new Uint8Array(t.byteLength),this.data_.set(new Uint8Array(t))),n=this.data_.length):t instanceof Uint8Array&&(s?this.data_=t:(this.data_=new Uint8Array(t.length),this.data_.set(t)),n=t.length),this.size_=n,this.type_=r}size(){return this.size_}type(){return this.type_}slice(t,s){if(ce(this.data_)){const n=this.data_,r=Yt(n,t,s);return r===null?null:new A(r)}else{const n=new Uint8Array(this.data_.buffer,t,s-t);return new A(n,!0)}}static getBlob(...t){if(ee()){const s=t.map(n=>n instanceof A?n.data_:n);return new A(Gt.apply(null,s))}else{const s=t.map(a=>Q(a)?Zt(v.RAW,a).data:a.data_);let n=0;s.forEach(a=>{n+=a.byteLength});const r=new Uint8Array(n);let o=0;return s.forEach(a=>{for(let c=0;c<a.length;c++)r[o++]=a[c]}),new A(r,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ce(e){let t;try{t=JSON.parse(e)}catch{return null}return Ft(t)?t:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ns(e){if(e.length===0)return null;const t=e.lastIndexOf("/");return t===-1?"":e.slice(0,t)}function rs(e,t){const s=t.split("/").filter(n=>n.length>0).join("/");return e.length===0?s:e+"/"+s}function Se(e){const t=e.lastIndexOf("/",e.length-2);return t===-1?e:e.slice(t+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function is(e,t){return t}class N{constructor(t,s,n,r){this.server=t,this.local=s||t,this.writable=!!n,this.xform=r||is}}let B=null;function os(e){return!Q(e)||e.length<2?e:Se(e)}function Ue(){if(B)return B;const e=[];e.push(new N("bucket")),e.push(new N("generation")),e.push(new N("metageneration")),e.push(new N("name","fullPath",!0));function t(o,a){return os(a)}const s=new N("name");s.xform=t,e.push(s);function n(o,a){return a!==void 0?Number(a):a}const r=new N("size");return r.xform=n,e.push(r),e.push(new N("timeCreated")),e.push(new N("updated")),e.push(new N("md5Hash",null,!0)),e.push(new N("cacheControl",null,!0)),e.push(new N("contentDisposition",null,!0)),e.push(new N("contentEncoding",null,!0)),e.push(new N("contentLanguage",null,!0)),e.push(new N("contentType",null,!0)),e.push(new N("metadata","customMetadata",!0)),B=e,B}function as(e,t){function s(){const n=e.bucket,r=e.fullPath,o=new j(n,r);return t._makeStorageReference(o)}Object.defineProperty(e,"ref",{get:s})}function cs(e,t,s){const n={};n.type="file";const r=s.length;for(let o=0;o<r;o++){const a=s[o];n[a.local]=a.xform(n,t[a.server])}return as(n,e),n}function Oe(e,t,s){const n=Ce(t);return n===null?null:cs(e,n,s)}function ls(e,t,s,n){const r=Ce(t);if(r===null||!Q(r.downloadTokens))return null;const o=r.downloadTokens;if(o.length===0)return null;const a=encodeURIComponent;return o.split(",").map(d=>{const m=e.bucket,f=e.fullPath,p="/b/"+a(m)+"/o/"+a(f),l=q(p,s,n),h=je({alt:"media",token:d});return l+h})[0]}function us(e,t){const s={},n=t.length;for(let r=0;r<n;r++){const o=t[r];o.writable&&(s[o.server]=e[o.local])}return JSON.stringify(s)}class te{constructor(t,s,n,r){this.url=t,this.method=s,this.handler=n,this.timeout=r,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ie(e){if(!e)throw Z()}function ds(e,t){function s(n,r){const o=Oe(e,r,t);return Ie(o!==null),o}return s}function hs(e,t){function s(n,r){const o=Oe(e,r,t);return Ie(o!==null),ls(o,r,e.host,e._protocol)}return s}function Pe(e){function t(s,n){let r;return s.getStatus()===401?s.getErrorText().includes("Firebase App Check token is invalid")?r=Nt():r=Tt():s.getStatus()===402?r=Rt(e.bucket):s.getStatus()===403?r=jt(e.path):r=n,r.status=s.getStatus(),r.serverResponse=n.serverResponse,r}return t}function De(e){const t=Pe(e);function s(n,r){let o=t(n,r);return n.getStatus()===404&&(o=wt(e.path)),o.serverResponse=r.serverResponse,o}return s}function ps(e,t,s){const n=t.fullServerUrl(),r=q(n,e.host,e._protocol),o="GET",a=e.maxOperationRetryTime,c=new te(r,o,hs(e,s),a);return c.errorHandler=De(t),c}function ms(e,t){const s=t.fullServerUrl(),n=q(s,e.host,e._protocol),r="DELETE",o=e.maxOperationRetryTime;function a(u,d){}const c=new te(n,r,a,o);return c.successCodes=[200,204],c.errorHandler=De(t),c}function fs(e,t){return e&&e.contentType||t&&t.type()||"application/octet-stream"}function _s(e,t,s){const n=Object.assign({},s);return n.fullPath=e.path,n.size=t.size(),n.contentType||(n.contentType=fs(null,t)),n}function gs(e,t,s,n,r){const o=t.bucketOnlyServerUrl(),a={"X-Goog-Upload-Protocol":"multipart"};function c(){let x="";for(let R=0;R<2;R++)x=x+Math.random().toString().slice(2);return x}const u=c();a["Content-Type"]="multipart/related; boundary="+u;const d=_s(t,n,r),m=us(d,s),f="--"+u+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+m+`\r
--`+u+`\r
Content-Type: `+d.contentType+`\r
\r
`,p=`\r
--`+u+"--",l=A.getBlob(f,n,p);if(l===null)throw Ut();const h={name:d.fullPath},g=q(o,e.host,e._protocol),_="POST",T=e.maxUploadRetryTime,b=new te(g,_,ds(e,s),T);return b.urlParams=h,b.headers=a,b.body=l.uploadData(),b.errorHandler=Pe(t),b}class bs{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=C.NO_ERROR,this.sendPromise_=new Promise(t=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=C.ABORT,t()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=C.NETWORK_ERROR,t()}),this.xhr_.addEventListener("load",()=>{t()})})}send(t,s,n,r){if(this.sent_)throw I("cannot .send() more than once");if(this.sent_=!0,this.xhr_.open(s,t,!0),r!==void 0)for(const o in r)r.hasOwnProperty(o)&&this.xhr_.setRequestHeader(o,r[o].toString());return n!==void 0?this.xhr_.send(n):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw I("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw I("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw I("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw I("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(t){return this.xhr_.getResponseHeader(t)}addUploadProgressListener(t){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",t)}removeUploadProgressListener(t){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",t)}}class ks extends bs{initXhr(){this.xhr_.responseType="text"}}function se(){return new ks}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S{constructor(t,s){this._service=t,s instanceof j?this._location=s:this._location=j.makeFromUrl(s,t.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(t,s){return new S(t,s)}get root(){const t=new j(this._location.bucket,"");return this._newRef(this._service,t)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return Se(this._location.path)}get storage(){return this._service}get parent(){const t=ns(this._location.path);if(t===null)return null;const s=new j(this._location.bucket,t);return new S(this._service,s)}_throwIfRoot(t){if(this._location.path==="")throw Pt(t)}}function xs(e,t,s){e._throwIfRoot("uploadBytes");const n=gs(e.storage,e._location,Ue(),new A(t,!0),s);return e.storage.makeRequestWithTokens(n,se).then(r=>({metadata:r,ref:e}))}function ys(e){e._throwIfRoot("getDownloadURL");const t=ps(e.storage,e._location,Ue());return e.storage.makeRequestWithTokens(t,se).then(s=>{if(s===null)throw Ot();return s})}function ws(e){e._throwIfRoot("deleteObject");const t=ms(e.storage,e._location);return e.storage.makeRequestWithTokens(t,se)}function Rs(e,t){const s=rs(e._location.path,t),n=new j(e._location.bucket,s);return new S(e.storage,n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ts(e){return/^[A-Za-z]+:\/\//.test(e)}function Ns(e,t){return new S(e,t)}function Le(e,t){if(e instanceof ne){const s=e;if(s._bucket==null)throw St();const n=new S(s,s._bucket);return t!=null?Le(n,t):n}else return t!==void 0?Rs(e,t):e}function js(e,t){if(t&&Ts(t)){if(e instanceof ne)return Ns(e,t);throw G("To use ref(service, url), the first argument must be a Storage instance.")}else return Le(e,t)}function ue(e,t){const s=t==null?void 0:t[Te];return s==null?null:j.makeFromBucketSpec(s,e)}function vs(e,t,s,n={}){e.host=`${t}:${s}`,e._protocol="http";const{mockUserToken:r}=n;r&&(e._overrideAuthToken=typeof r=="string"?r:Ve(r,e.app.options.projectId))}class ne{constructor(t,s,n,r,o){this.app=t,this._authProvider=s,this._appCheckProvider=n,this._url=r,this._firebaseVersion=o,this._bucket=null,this._host=Re,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=xt,this._maxUploadRetryTime=yt,this._requests=new Set,r!=null?this._bucket=j.makeFromBucketSpec(r,this._host):this._bucket=ue(this._host,this.app.options)}get host(){return this._host}set host(t){this._host=t,this._url!=null?this._bucket=j.makeFromBucketSpec(this._url,t):this._bucket=ue(t,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(t){le("time",0,Number.POSITIVE_INFINITY,t),this._maxUploadRetryTime=t}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(t){le("time",0,Number.POSITIVE_INFINITY,t),this._maxOperationRetryTime=t}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const t=this._authProvider.getImmediate({optional:!0});if(t){const s=await t.getToken();if(s!==null)return s.accessToken}return null}async _getAppCheckToken(){const t=this._appCheckProvider.getImmediate({optional:!0});return t?(await t.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(t=>t.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(t){return new S(this,t)}_makeRequest(t,s,n,r,o=!0){if(this._deleted)return new Dt(Ne());{const a=Kt(t,this._appId,n,r,s,this._firebaseVersion,o);return this._requests.add(a),a.getPromise().then(()=>this._requests.delete(a),()=>this._requests.delete(a)),a}}async makeRequestWithTokens(t,s){const[n,r]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(t,s,n,r).getPromise()}}const de="@firebase/storage",he="0.12.3";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Me="storage";function As(e,t,s){return e=L(e),xs(e,t,s)}function Es(e){return e=L(e),ys(e)}function Cs(e){return e=L(e),ws(e)}function Be(e,t){return e=L(e),js(e,t)}function Ss(e=ze(),t){e=L(e);const n=qe(e,Me).getImmediate({identifier:t}),r=He("storage");return r&&Us(n,...r),n}function Us(e,t,s,n={}){vs(e,t,s,n)}function Os(e,{instanceIdentifier:t}){const s=e.getProvider("app").getImmediate(),n=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return new ne(s,n,r,t,Ge)}function Is(){Ke(new Xe(Me,Os,"PUBLIC").setMultipleInstances(!0)),oe(de,he,""),oe(de,he,"esm2017")}Is();const Fe=Ss(Je),H="tickets",Ps=(e,t)=>{const s=_e(z(U,H),ge("createdAt","desc"));return be(s,n=>{const r=n.docs.map(o=>({id:o.id,...o.data()}));e(r)},n=>{console.error("subscribeToTickets error:",n),t==null||t(n)})},Ds=async(e,t,s)=>{let n,r;if(e.imageFile){const a=e.imageFile.name.split(".").pop(),c=`tickets/${Date.now()}_${t}.${a}`,u=Be(Fe,c);await As(u,e.imageFile),n=await Es(u),r=c}return(await xe(z(U,H),{name:e.name.trim(),description:e.description.trim(),imageUrl:n??null,imagePath:r??null,authorId:t,authorName:s,status:"todo",priority:"P3",createdAt:F(),updatedAt:F()})).id},Ls=async(e,t)=>{const s=J(U,H,e);await ke(s,{...t,updatedAt:F()})},Ms=async(e,t)=>{if(await Ye(J(U,H,e)),t)try{await Cs(Be(Fe,t))}catch(s){console.warn("Storage cleanup warning:",s)}},Bs=()=>{const[e,t]=k.useState([]),[s,n]=k.useState(!0),[r,o]=k.useState(null),[a,c]=k.useTransition();return k.useEffect(()=>{const m=Ps(f=>{t(f),n(!1)},f=>{o(f),n(!1)});return()=>m()},[]),{tickets:e,isLoading:s,error:r,isPending:a,handleUpdateTicket:(m,f)=>{c(async()=>{await Ls(m,f)})},handleDeleteTicket:async(m,f)=>{await Ms(m,f)}}};async function Fs(e,t,s,n){var c,u;const r=(c=t.get("name"))==null?void 0:c.trim(),o=(u=t.get("description"))==null?void 0:u.trim(),a=t.get("image");if(!r)return{success:!1,error:"Le nom du ticket est obligatoire."};if(!o)return{success:!1,error:"La description est obligatoire."};try{return await Ds({name:r,description:o,imageFile:a!=null&&a.size?a:void 0},s,n),{success:!0,error:null}}catch{return{success:!1,error:"Une erreur est survenue. Veuillez réessayer."}}}const $s=({authorId:e,authorName:t})=>{const s=k.useRef(null),[n,r]=k.useState(null),[o,a]=k.useState(null),c=k.useRef(null),u=async(h,g)=>{var T;o&&g.set("image",o);const _=await Fs(h,g,e,t);return _.success&&((T=s.current)==null||T.reset(),r(null),a(null)),_},[d,m,f]=k.useActionState(u,{success:!1,error:null}),p=h=>{var _;const g=(_=h.target.files)==null?void 0:_[0];if(g){if(g.size>5*1024*1024){alert("Le fichier doit faire moins de 5 Mo");return}a(g),r(URL.createObjectURL(g))}},l=()=>{r(null),a(null),c.current&&(c.current.value="")};return i.jsxs("div",{className:"ticket-form",children:[i.jsxs("div",{className:"ticket-form__header",children:[i.jsx("h2",{className:"ticket-form__title",children:"Signaler un bug"}),i.jsx("p",{className:"ticket-form__subtitle",children:"Décrivez le problème rencontré et notre équipe prendra en charge votre ticket."})]}),i.jsxs("form",{ref:s,action:m,className:"ticket-form__body",noValidate:!0,children:[i.jsxs("div",{className:"ticket-form__field",children:[i.jsxs("label",{htmlFor:"ticket-name",className:"ticket-form__label",children:["Nom du ticket ",i.jsx("span",{className:"ticket-form__required",children:"*"})]}),i.jsx("input",{id:"ticket-name",name:"name",type:"text",className:"ticket-form__input",placeholder:"Ex : Erreur lors du chargement du quiz",required:!0,disabled:f})]}),i.jsxs("div",{className:"ticket-form__field",children:[i.jsxs("label",{htmlFor:"ticket-description",className:"ticket-form__label",children:["Description ",i.jsx("span",{className:"ticket-form__required",children:"*"})]}),i.jsx("textarea",{id:"ticket-description",name:"description",className:"ticket-form__textarea",placeholder:"Décrivez le bug en détail : contexte, étapes pour reproduire, comportement attendu...",rows:5,required:!0,disabled:f})]}),i.jsxs("div",{className:"ticket-form__field",children:[i.jsx("label",{className:"ticket-form__label",children:"Capture d'écran (optionnel)"}),n?i.jsxs("div",{className:"ticket-form__image-preview",children:[i.jsx("img",{src:n,alt:"Preview"}),i.jsx("button",{type:"button",className:"ticket-form__image-remove",onClick:l,"aria-label":"Supprimer l'image",children:i.jsx(ye,{size:16})})]}):i.jsxs("button",{type:"button",className:"ticket-form__upload-zone",onClick:()=>{var h;return(h=c.current)==null?void 0:h.click()},children:[i.jsx(gt,{size:32,className:"ticket-form__upload-icon"}),i.jsx("span",{children:"Cliquez pour ajouter une image"}),i.jsx("span",{className:"ticket-form__upload-hint",children:"PNG, JPG, WEBP · max 5 Mo"})]}),i.jsx("input",{ref:c,type:"file",accept:"image/*",onChange:p,className:"ticket-form__file-input","aria-hidden":"true"})]}),d.error&&i.jsx("div",{className:"ticket-form__error",role:"alert",children:d.error}),d.success&&i.jsx("div",{className:"ticket-form__success",role:"status",children:"✓ Ticket créé avec succès !"}),i.jsxs("button",{type:"submit",className:"ticket-form__submit",disabled:f,id:"submit-ticket-btn",children:[f?i.jsx("span",{className:"ticket-form__spinner"}):i.jsx(we,{size:18}),f?"Envoi en cours...":"Envoyer le ticket"]})]})]})},Y={todo:"À faire",in_progress:"En cours",done:"Terminé"},pe={P1:"Critique",P2:"Majeur",P3:"Mineur"},zs=["todo","in_progress","done"],qs=["P1","P2","P3"],me={todo:"badge--todo",in_progress:"badge--in-progress",done:"badge--done"},fe={P1:"badge--p1",P2:"badge--p2",P3:"badge--p3"},Hs=e=>e!=null&&e.toDate?e.toDate().toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"}):"—",O=rt(),Vs=({tickets:e,currentUserId:t,canEditTicket:s,onUpdate:n,onDelete:r,onOpenDetail:o})=>{const[a,c]=k.useState([]),[u,d]=k.useState(null),m=k.useMemo(()=>[O.accessor("name",{header:"Ticket",cell:p=>i.jsx("div",{className:"tickets-table__name-wrapper",children:i.jsx("span",{className:"tickets-table__ticket-name",children:p.getValue()})})}),O.accessor("authorName",{header:"Auteur",cell:p=>i.jsxs("div",{className:"tickets-table__author",children:[i.jsx("div",{className:"tickets-table__author-avatar",children:p.getValue().charAt(0).toUpperCase()}),i.jsx("span",{children:p.getValue()})]})}),O.accessor("createdAt",{header:"Date",cell:p=>i.jsx("span",{className:"tickets-table__date",children:Hs(p.getValue())}),sortingFn:(p,l)=>{var _,T;const h=((_=p.original.createdAt)==null?void 0:_.toMillis())||0,g=((T=l.original.createdAt)==null?void 0:T.toMillis())||0;return h-g}}),O.accessor("status",{header:"Statut",cell:p=>{const l=p.row.original;return s?i.jsx("select",{id:`status-${l.id}`,className:`tickets-table__select badge ${me[l.status]}`,value:l.status,onChange:h=>n(l.id,{status:h.target.value}),"aria-label":`Modifier le statut de ${l.name}`,children:zs.map(h=>i.jsx("option",{value:h,children:Y[h]},h))}):i.jsx("span",{className:`badge ${me[l.status]}`,children:Y[l.status]})}}),O.accessor("priority",{header:"Priorité",cell:p=>{const l=p.row.original;return s?i.jsx("select",{id:`priority-${l.id}`,className:`tickets-table__select badge ${fe[l.priority]}`,value:l.priority,onChange:h=>n(l.id,{priority:h.target.value}),"aria-label":`Modifier la priorité de ${l.name}`,children:qs.map(h=>i.jsx("option",{value:h,children:pe[h]},h))}):i.jsx("span",{className:`badge ${fe[l.priority]}`,children:pe[l.priority]})}}),O.display({id:"actions",header:"Actions",cell:p=>{const l=p.row.original,g=l.authorId===t||s,_=u===l.id;return i.jsxs("div",{className:"tickets-table__actions",children:[i.jsx("button",{className:"tickets-table__action-btn tickets-table__action-btn--detail",onClick:()=>o(l),title:"Ouvrir le détail",children:i.jsx($,{size:16})}),l.description&&i.jsx("button",{className:"tickets-table__action-btn tickets-table__action-btn--expand",onClick:()=>d(_?null:l.id),title:_?"Réduire":"Voir la description",children:_?i.jsx(pt,{size:16}):i.jsx(ft,{size:16})}),g&&i.jsx("button",{className:"tickets-table__action-btn tickets-table__action-btn--delete",onClick:()=>r(l),title:"Supprimer",children:i.jsx(Ze,{size:16})})]})}})],[s,t,u,n,r,o]),f=it({data:e,columns:m,state:{sorting:a},onSortingChange:c,getCoreRowModel:ut(),getSortedRowModel:lt()});return e.length===0?i.jsxs("div",{className:"tickets-table__empty",children:[i.jsx($,{size:40,strokeWidth:1.2}),i.jsx("p",{children:"Aucun ticket pour le moment."}),i.jsx("span",{children:"Soyez le premier à signaler un bug !"})]}):i.jsx("div",{className:"tickets-table",children:i.jsx("div",{className:"tickets-table__wrapper",children:i.jsxs("table",{className:"tickets-table__table",children:[i.jsx("thead",{children:f.getHeaderGroups().map(p=>i.jsx("tr",{children:p.headers.map(l=>{const h=l.column.getCanSort(),g=l.column.getIsSorted();return i.jsxs("th",{className:h?"tickets-table__th-sort":"",onClick:l.column.getToggleSortingHandler(),children:[ae(l.column.columnDef.header,l.getContext()),h&&i.jsx("span",{className:`tickets-table__sort-icon ${g?"tickets-table__sort-icon--active":""}`,children:g==="asc"?i.jsx(ot,{size:14}):g==="desc"?i.jsx(at,{size:14}):i.jsx(ct,{size:14})})]},l.id)})},p.id))}),i.jsx("tbody",{children:f.getRowModel().rows.map(p=>{const l=p.original,h=u===l.id;return i.jsxs(k.Fragment,{children:[i.jsx("tr",{className:`tickets-table__row ${h?"tickets-table__row--expanded":""}`,children:p.getVisibleCells().map(g=>i.jsx("td",{children:ae(g.column.columnDef.cell,g.getContext())},g.id))}),h&&i.jsx("tr",{className:"tickets-table__row-expanded",children:i.jsx("td",{colSpan:m.length,children:i.jsx("div",{className:"tickets-table__description",children:l.description})})})]},p.id)})})]})})})},re="tickets",ie="messages",Ws=(e,t,s)=>{const n=_e(z(U,re,e,ie),ge("createdAt","asc"));return be(n,r=>{const o=r.docs.map(a=>({id:a.id,...a.data()}));t(o)},r=>{console.error("subscribeToMessages error:",r)})},Ks=async(e,t)=>{await xe(z(U,re,e,ie),{...t,readBy:[t.authorId],createdAt:F()})},Xs=async(e,t,s)=>{const n=J(U,re,e,ie,t);await ke(n,{readBy:Qe(s)})},Gs=(e,t)=>{const[s,n]=k.useState([]),[r,o]=k.useState(!0),a=et(d=>d.setUnreadCount);k.useEffect(()=>{if(!e){o(!1);return}const d=Ws(e,m=>{if(n(m),o(!1),t){const f=m.filter(p=>!p.readBy.includes(t)).length;a(f)}});return()=>d()},[e,t,a]);const c=t?s.filter(d=>!d.readBy.includes(t)).length:0;return{messages:s,isLoading:r,unreadCount:c,markAllRead:d=>{s.filter(m=>!m.readBy.includes(d)).forEach(m=>Xs(e,m.id,d))}}},Ys=({ticket:e,isOpen:t,onClose:s,currentUserId:n,currentUserName:r,currentUserRole:o,canInitiateMessage:a})=>{const{messages:c,isLoading:u,markAllRead:d}=Gs((e==null?void 0:e.id)??null,n),m=k.useRef(null);k.useEffect(()=>{t&&e&&c.length>0&&d(n)},[t,e==null?void 0:e.id,c.length]),k.useEffect(()=>{var b;(b=m.current)==null||b.scrollIntoView({behavior:"smooth"})},[c.length]),k.useEffect(()=>{const b=x=>{x.key==="Escape"&&s()};return t&&window.addEventListener("keydown",b),()=>window.removeEventListener("keydown",b)},[t,s]);const f=(e==null?void 0:e.authorId)===n,p=a||f,l=async(b,x)=>{var E;if(!e)return b;const R=(E=x.get("message"))==null?void 0:E.trim();if(!R)return{error:"Le message ne peut pas être vide."};try{return await Ks(e.id,{content:R,authorId:n,authorName:r,authorRole:o}),{error:null}}catch{return{error:"Erreur lors de l'envoi du message."}}},[h,g,_]=k.useActionState(l,{error:null});if(!t||!e)return null;const T=b=>b!=null&&b.toDate?b.toDate().toLocaleString("fr-FR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}):"";return i.jsxs(i.Fragment,{children:[i.jsx("div",{className:"ticket-modal__backdrop",onClick:s}),i.jsxs("div",{className:"ticket-modal",role:"dialog","aria-modal":"true","aria-labelledby":"ticket-modal-title",children:[i.jsxs("div",{className:"ticket-modal__header",children:[i.jsxs("div",{className:"ticket-modal__header-left",children:[i.jsx($,{size:20}),i.jsxs("div",{children:[i.jsx("h3",{id:"ticket-modal-title",className:"ticket-modal__title",children:e.name}),i.jsxs("div",{className:"ticket-modal__meta",children:[i.jsx("span",{className:`badge badge--${e.status.replace("_","-")}`,children:Y[e.status]}),i.jsx("span",{className:`badge badge--${e.priority.toLowerCase()}`,children:e.priority}),i.jsxs("span",{className:"ticket-modal__author",children:["par ",e.authorName]})]})]})]}),i.jsx("button",{className:"ticket-modal__close",onClick:s,"aria-label":"Fermer",children:i.jsx(ye,{size:20})})]}),e.description&&i.jsxs("div",{className:"ticket-modal__description",children:[i.jsx("p",{children:e.description}),e.imageUrl&&i.jsx("a",{href:e.imageUrl,target:"_blank",rel:"noopener noreferrer",children:i.jsx("img",{src:e.imageUrl,alt:"Capture d'écran du bug",className:"ticket-modal__screenshot"})})]}),i.jsxs("div",{className:"ticket-modal__messages",children:[u?i.jsx("div",{className:"ticket-modal__loading",children:"Chargement..."}):c.length===0?i.jsxs("div",{className:"ticket-modal__no-messages",children:[i.jsx($,{size:32,strokeWidth:1.2}),i.jsx("p",{children:"Aucun message pour ce ticket."})]}):c.map(b=>{const x=b.authorId===n;return i.jsx("div",{className:`ticket-modal__message ${x?"ticket-modal__message--mine":""}`,children:i.jsxs("div",{className:"ticket-modal__message-bubble",children:[i.jsxs("div",{className:"ticket-modal__message-header",children:[i.jsx("span",{className:"ticket-modal__message-author",children:b.authorName}),i.jsx("span",{className:"ticket-modal__message-role",children:b.authorRole}),i.jsx("span",{className:"ticket-modal__message-time",children:T(b.createdAt)})]}),i.jsx("p",{className:"ticket-modal__message-content",children:b.content})]})},b.id)}),i.jsx("div",{ref:m})]}),p?i.jsxs("form",{action:g,className:"ticket-modal__compose",children:[i.jsx("input",{name:"message",type:"text",className:"ticket-modal__compose-input",placeholder:a?"Demandez des précisions à l'auteur...":"Répondre à l'équipe...",disabled:_,autoComplete:"off",id:"ticket-message-input"}),i.jsx("button",{type:"submit",className:"ticket-modal__compose-send",disabled:_,"aria-label":"Envoyer",children:_?i.jsx("span",{className:"ticket-modal__spinner"}):i.jsx(we,{size:18})}),h.error&&i.jsx("p",{className:"ticket-modal__compose-error",children:h.error})]}):i.jsx("div",{className:"ticket-modal__readonly-notice",children:"Seul l'auteur et l'équipe support peuvent échanger sur ce ticket."})]})]})};function en(){var b;const e=tt(x=>x.user),{role:t,isAdmin:s,isDev:n}=st(),r=s||n,{tickets:o,isLoading:a,error:c,handleUpdateTicket:u,handleDeleteTicket:d}=Bs(),[m,f]=k.useState(null),[p,l]=k.useState(!1),[h,g]=k.useState(null);if(!e)return null;const _=e.displayName||((b=e.email)==null?void 0:b.split("@")[0])||"Utilisateur",T=async()=>{if(m){l(!0);try{await d(m.id,m.imagePath)}finally{l(!1),f(null)}}};return i.jsxs("div",{className:"Support support-page",children:[i.jsxs("div",{className:"container mt-5",children:[i.jsxs("div",{className:"support-page__hero",children:[i.jsx("div",{className:"support-page__hero-icon",children:i.jsx(nt,{size:28})}),i.jsxs("div",{children:[i.jsx("h1",{className:"support-page__title",children:"Support & Bug Reports"}),i.jsx("p",{className:"support-page__description",children:"Signalez un problème ou suivez l'avancement des bugs remontés par la communauté."})]})]}),i.jsxs("div",{className:"support-page__layout",children:[i.jsx("div",{className:"support-page__form-col",children:i.jsx($s,{authorId:e.uid,authorName:_})}),i.jsxs("div",{className:"support-page__table-col",children:[i.jsx("div",{className:"support-page__table-header",children:i.jsxs("h2",{className:"support-page__section-title",children:["Tickets ouverts",o.length>0&&i.jsx("span",{className:"support-page__count badge",children:o.length})]})}),a?i.jsxs("div",{className:"support-page__loading",children:[i.jsx("span",{className:"support-page__spinner"}),i.jsx("span",{children:"Chargement des tickets..."})]}):c?i.jsx("div",{className:"support-page__error",children:"Une erreur est survenue lors du chargement des tickets."}):i.jsx(Vs,{tickets:o,currentUserId:e.uid,canEditTicket:r,onUpdate:u,onDelete:x=>f(x),onOpenDetail:x=>g(x)})]})]})]}),i.jsxs(dt,{isOpen:!!m,title:"Supprimer le ticket",type:"error",labelOnConfirm:"Supprimer",labelOnCancel:"Annuler",onClose:()=>f(null),setIsClosed:()=>f(null),onConfirm:T,isConfirmLoading:p,children:[i.jsxs("p",{children:["Êtes-vous sûr de vouloir supprimer le ticket"," ",i.jsxs("strong",{children:['"',m==null?void 0:m.name,'"']})," ?"]}),i.jsx("p",{style:{color:"#888",fontSize:"0.875rem",marginTop:"0.5rem"},children:"Cette action est irréversible. L'image associée sera également supprimée."})]}),i.jsx(Ys,{ticket:h,isOpen:!!h,onClose:()=>g(null),currentUserId:e.uid,currentUserName:_,currentUserRole:t??"client",canInitiateMessage:r})]})}export{en as default};
//# sourceMappingURL=Support-O4d1Rost.js.map
