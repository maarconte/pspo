import{r as p,q as j,s as b,t as O,v as T,w as R,_,x as U,F as L,y as P,C as F,z as w,j as i,B as M,a as $,A as g,D as N,e as D}from"./index-C9GweYGA.js";const G=()=>{const[e,t]=p.useState([]),[n,r]=p.useState(!0),[s,a]=p.useState(null),c=async()=>{r(!0),a(null);try{const o=j(b,"users"),l=(await O(o)).docs.map(f=>{var E,k;const d=f.data();return{uid:f.id,email:d.email||"",role:d.role||"client",createdAt:(E=d.createdAt)==null?void 0:E.toDate(),updatedAt:(k=d.updatedAt)==null?void 0:k.toDate()}});t(l)}catch(o){console.error("Erreur lors de la récupération des utilisateurs:",o),a(o.message||"Échec de la récupération des utilisateurs")}finally{r(!1)}};return p.useEffect(()=>{c()},[]),{users:e,loading:n,error:s,refetch:c}};/**
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
 */const B="type.googleapis.com/google.protobuf.Int64Value",H="type.googleapis.com/google.protobuf.UInt64Value";function S(e,t){const n={};for(const r in e)e.hasOwnProperty(r)&&(n[r]=t(e[r]));return n}function A(e){if(e==null)return null;if(e instanceof Number&&(e=e.valueOf()),typeof e=="number"&&isFinite(e)||e===!0||e===!1||Object.prototype.toString.call(e)==="[object String]")return e;if(e instanceof Date)return e.toISOString();if(Array.isArray(e))return e.map(t=>A(t));if(typeof e=="function"||typeof e=="object")return S(e,t=>A(t));throw new Error("Data cannot be encoded in JSON: "+e)}function m(e){if(e==null)return e;if(e["@type"])switch(e["@type"]){case B:case H:{const t=Number(e.value);if(isNaN(t))throw new Error("Data cannot be decoded from JSON: "+e);return t}default:throw new Error("Data cannot be decoded from JSON: "+e)}return Array.isArray(e)?e.map(t=>m(t)):typeof e=="function"||typeof e=="object"?S(e,t=>m(t)):e}/**
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
 */const x="functions";/**
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
 */const C={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class h extends L{constructor(t,n,r){super(`${x}/${t}`,n||""),this.details=r}}function V(e){if(e>=200&&e<300)return"ok";switch(e){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function J(e,t){let n=V(e),r=n,s;try{const a=t&&t.error;if(a){const c=a.status;if(typeof c=="string"){if(!C[c])return new h("internal","internal");n=C[c],r=c}const o=a.message;typeof o=="string"&&(r=o),s=a.details,s!==void 0&&(s=m(s))}}catch{}return n==="ok"?null:new h(n,r,s)}/**
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
 */class X{constructor(t,n,r){this.auth=null,this.messaging=null,this.appCheck=null,this.auth=t.getImmediate({optional:!0}),this.messaging=n.getImmediate({optional:!0}),this.auth||t.get().then(s=>this.auth=s,()=>{}),this.messaging||n.get().then(s=>this.messaging=s,()=>{}),this.appCheck||r.get().then(s=>this.appCheck=s,()=>{})}async getAuthToken(){if(this.auth)try{const t=await this.auth.getToken();return t==null?void 0:t.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(t){if(this.appCheck){const n=t?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return n.error?null:n.token}return null}async getContext(t){const n=await this.getAuthToken(),r=await this.getMessagingToken(),s=await this.getAppCheckToken(t);return{authToken:n,messagingToken:r,appCheckToken:s}}}/**
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
 */const y="us-central1";function Y(e){let t=null;return{promise:new Promise((n,r)=>{t=setTimeout(()=>{r(new h("deadline-exceeded","deadline-exceeded"))},e)}),cancel:()=>{t&&clearTimeout(t)}}}class q{constructor(t,n,r,s,a=y,c){this.app=t,this.fetchImpl=c,this.emulatorOrigin=null,this.contextProvider=new X(n,r,s),this.cancelAllRequests=new Promise(o=>{this.deleteService=()=>Promise.resolve(o())});try{const o=new URL(a);this.customDomain=o.origin,this.region=y}catch{this.customDomain=null,this.region=a}}_delete(){return this.deleteService()}_url(t){const n=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${n}/${this.region}/${t}`:this.customDomain!==null?`${this.customDomain}/${t}`:`https://${this.region}-${n}.cloudfunctions.net/${t}`}}function K(e,t,n){e.emulatorOrigin=`http://${t}:${n}`}function z(e,t,n){return r=>Q(e,t,r,{})}async function W(e,t,n,r){n["Content-Type"]="application/json";let s;try{s=await r(e,{method:"POST",body:JSON.stringify(t),headers:n})}catch{return{status:0,json:null}}let a=null;try{a=await s.json()}catch{}return{status:s.status,json:a}}function Q(e,t,n,r){const s=e._url(t);return Z(e,s,n,r)}async function Z(e,t,n,r){n=A(n);const s={data:n},a={},c=await e.contextProvider.getContext(r.limitedUseAppCheckTokens);c.authToken&&(a.Authorization="Bearer "+c.authToken),c.messagingToken&&(a["Firebase-Instance-ID-Token"]=c.messagingToken),c.appCheckToken!==null&&(a["X-Firebase-AppCheck"]=c.appCheckToken);const o=r.timeout||7e4,u=Y(o),l=await Promise.race([W(t,s,a,e.fetchImpl),u.promise,e.cancelAllRequests]);if(u.cancel(),!l)throw new h("cancelled","Firebase Functions instance was deleted.");const f=J(l.status,l.json);if(f)throw f;if(!l.json)throw new h("internal","Response is not valid JSON object.");let d=l.json.data;if(typeof d>"u"&&(d=l.json.result),typeof d>"u")throw new h("internal","Response is missing data field.");return{data:m(d)}}const I="@firebase/functions",v="0.11.3";/**
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
 */const ee="auth-internal",te="app-check-internal",ne="messaging-internal";function re(e,t){const n=(r,{instanceIdentifier:s})=>{const a=r.getProvider("app").getImmediate(),c=r.getProvider(ee),o=r.getProvider(ne),u=r.getProvider(te);return new q(a,c,o,u,s,e)};P(new F(x,n,"PUBLIC").setMultipleInstances(!0)),w(I,v,t),w(I,v,"esm2017")}/**
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
 */function se(e=R(),t=y){const r=_(T(e),x).getImmediate({identifier:t}),s=U("functions");return s&&ie(r,...s),r}function ie(e,t,n){K(T(e),t,n)}function oe(e,t,n){return z(T(e),t)}re(fetch.bind(self));const ae=se(),ce={setUserRole:async(e,t)=>{const n=oe(ae,"setUserRole");try{return(await n({userId:e,role:t})).data}catch(r){throw console.error("Erreur lors de l'attribution du rôle:",r),new Error(r.message||"Échec de l'attribution du rôle")}}},ue=()=>{const{users:e,loading:t,error:n,refetch:r}=G(),[s,a]=p.useState(null),c=async(o,u)=>{a(o);try{await ce.setUserRole(o,u),D.success("Rôle mis à jour avec succès"),await r()}catch(l){D.error(l.message||"Échec de la mise à jour du rôle")}finally{a(null)}};return t?i.jsxs("div",{className:"user-management",children:[i.jsx("h1",{children:"Gestion des utilisateurs"}),i.jsx("p",{children:"Chargement des utilisateurs..."})]}):n?i.jsxs("div",{className:"user-management",children:[i.jsx("h1",{children:"Gestion des utilisateurs"}),i.jsxs("p",{className:"error",children:["Erreur : ",n]}),i.jsx(M,{label:"Réessayer",style:$.SOLID,onClick:r})]}):i.jsxs("div",{className:"user-management",children:[i.jsx("h1",{children:"Gestion des utilisateurs"}),i.jsxs("p",{className:"subtitle",children:[e.length," utilisateur",e.length>1?"s":""," enregistré",e.length>1?"s":""]}),i.jsx("div",{className:"users-table",children:i.jsxs("table",{children:[i.jsx("thead",{children:i.jsxs("tr",{children:[i.jsx("th",{children:"Email"}),i.jsx("th",{children:"Rôle actuel"}),i.jsx("th",{children:"Changer le rôle"}),i.jsx("th",{children:"Date de création"})]})}),i.jsx("tbody",{children:e.map(o=>{var u;return i.jsxs("tr",{children:[i.jsx("td",{children:o.email}),i.jsx("td",{children:i.jsx("span",{className:`role-badge role-${o.role}`,children:g[o.role]})}),i.jsxs("td",{children:[i.jsxs("select",{value:o.role,onChange:l=>c(o.uid,l.target.value),disabled:s===o.uid,className:"role-select",children:[i.jsx("option",{value:N.CLIENT,children:g.client}),i.jsx("option",{value:N.ADMIN,children:g.admin}),i.jsx("option",{value:N.DEV,children:g.dev})]}),s===o.uid&&i.jsx("span",{className:"updating",children:"Mise à jour..."})]}),i.jsx("td",{children:(u=o.createdAt)==null?void 0:u.toLocaleDateString("fr-FR",{year:"numeric",month:"short",day:"numeric"})})]},o.uid)})})]})})]})};export{ue as default};
//# sourceMappingURL=UserManagement-CID_nQ8h.js.map
