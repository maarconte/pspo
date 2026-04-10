import{r as p,x as U,y as j,z as b,A as T,E as O,_ as R,F as _,G as L,H as P,I as F,J as w,j as i,B as M,a as $,K as g,L as N,d as I}from"./index-BfkgNyN9.js";const B=()=>{const[e,t]=p.useState([]),[n,r]=p.useState(!0),[s,a]=p.useState(null),c=async()=>{r(!0),a(null);try{const o=U(j,"users"),l=(await b(o)).docs.map(f=>{var E,k;const d=f.data();return{uid:f.id,email:d.email||"",role:d.role||"client",createdAt:(E=d.createdAt)==null?void 0:E.toDate(),updatedAt:(k=d.updatedAt)==null?void 0:k.toDate()}});t(l)}catch(o){console.error("Error fetching users:",o),a(o.message||"Failed to fetch users")}finally{r(!1)}};return p.useEffect(()=>{c()},[]),{users:e,loading:n,error:s,refetch:c}};/**
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
 */const G="type.googleapis.com/google.protobuf.Int64Value",H="type.googleapis.com/google.protobuf.UInt64Value";function v(e,t){const n={};for(const r in e)e.hasOwnProperty(r)&&(n[r]=t(e[r]));return n}function A(e){if(e==null)return null;if(e instanceof Number&&(e=e.valueOf()),typeof e=="number"&&isFinite(e)||e===!0||e===!1||Object.prototype.toString.call(e)==="[object String]")return e;if(e instanceof Date)return e.toISOString();if(Array.isArray(e))return e.map(t=>A(t));if(typeof e=="function"||typeof e=="object")return v(e,t=>A(t));throw new Error("Data cannot be encoded in JSON: "+e)}function m(e){if(e==null)return e;if(e["@type"])switch(e["@type"]){case G:case H:{const t=Number(e.value);if(isNaN(t))throw new Error("Data cannot be decoded from JSON: "+e);return t}default:throw new Error("Data cannot be decoded from JSON: "+e)}return Array.isArray(e)?e.map(t=>m(t)):typeof e=="function"||typeof e=="object"?v(e,t=>m(t)):e}/**
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
 */const C={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class h extends L{constructor(t,n,r){super(`${x}/${t}`,n||""),this.details=r}}function J(e){if(e>=200&&e<300)return"ok";switch(e){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function V(e,t){let n=J(e),r=n,s;try{const a=t&&t.error;if(a){const c=a.status;if(typeof c=="string"){if(!C[c])return new h("internal","internal");n=C[c],r=c}const o=a.message;typeof o=="string"&&(r=o),s=a.details,s!==void 0&&(s=m(s))}}catch{}return n==="ok"?null:new h(n,r,s)}/**
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
 */class K{constructor(t,n,r){this.auth=null,this.messaging=null,this.appCheck=null,this.auth=t.getImmediate({optional:!0}),this.messaging=n.getImmediate({optional:!0}),this.auth||t.get().then(s=>this.auth=s,()=>{}),this.messaging||n.get().then(s=>this.messaging=s,()=>{}),this.appCheck||r.get().then(s=>this.appCheck=s,()=>{})}async getAuthToken(){if(this.auth)try{const t=await this.auth.getToken();return t==null?void 0:t.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(t){if(this.appCheck){const n=t?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return n.error?null:n.token}return null}async getContext(t){const n=await this.getAuthToken(),r=await this.getMessagingToken(),s=await this.getAppCheckToken(t);return{authToken:n,messagingToken:r,appCheckToken:s}}}/**
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
 */const y="us-central1";function X(e){let t=null;return{promise:new Promise((n,r)=>{t=setTimeout(()=>{r(new h("deadline-exceeded","deadline-exceeded"))},e)}),cancel:()=>{t&&clearTimeout(t)}}}class Y{constructor(t,n,r,s,a=y,c){this.app=t,this.fetchImpl=c,this.emulatorOrigin=null,this.contextProvider=new K(n,r,s),this.cancelAllRequests=new Promise(o=>{this.deleteService=()=>Promise.resolve(o())});try{const o=new URL(a);this.customDomain=o.origin,this.region=y}catch{this.customDomain=null,this.region=a}}_delete(){return this.deleteService()}_url(t){const n=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${n}/${this.region}/${t}`:this.customDomain!==null?`${this.customDomain}/${t}`:`https://${this.region}-${n}.cloudfunctions.net/${t}`}}function q(e,t,n){e.emulatorOrigin=`http://${t}:${n}`}function z(e,t,n){return r=>Q(e,t,r,{})}async function W(e,t,n,r){n["Content-Type"]="application/json";let s;try{s=await r(e,{method:"POST",body:JSON.stringify(t),headers:n})}catch{return{status:0,json:null}}let a=null;try{a=await s.json()}catch{}return{status:s.status,json:a}}function Q(e,t,n,r){const s=e._url(t);return Z(e,s,n,r)}async function Z(e,t,n,r){n=A(n);const s={data:n},a={},c=await e.contextProvider.getContext(r.limitedUseAppCheckTokens);c.authToken&&(a.Authorization="Bearer "+c.authToken),c.messagingToken&&(a["Firebase-Instance-ID-Token"]=c.messagingToken),c.appCheckToken!==null&&(a["X-Firebase-AppCheck"]=c.appCheckToken);const o=r.timeout||7e4,u=X(o),l=await Promise.race([W(t,s,a,e.fetchImpl),u.promise,e.cancelAllRequests]);if(u.cancel(),!l)throw new h("cancelled","Firebase Functions instance was deleted.");const f=V(l.status,l.json);if(f)throw f;if(!l.json)throw new h("internal","Response is not valid JSON object.");let d=l.json.data;if(typeof d>"u"&&(d=l.json.result),typeof d>"u")throw new h("internal","Response is missing data field.");return{data:m(d)}}const D="@firebase/functions",S="0.11.3";/**
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
 */const ee="auth-internal",te="app-check-internal",ne="messaging-internal";function re(e,t){const n=(r,{instanceIdentifier:s})=>{const a=r.getProvider("app").getImmediate(),c=r.getProvider(ee),o=r.getProvider(ne),u=r.getProvider(te);return new Y(a,c,o,u,s,e)};P(new F(x,n,"PUBLIC").setMultipleInstances(!0)),w(D,S,t),w(D,S,"esm2017")}/**
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
 */function se(e=O(),t=y){const r=R(T(e),x).getImmediate({identifier:t}),s=_("functions");return s&&ie(r,...s),r}function ie(e,t,n){q(T(e),t,n)}function oe(e,t,n){return z(T(e),t)}re(fetch.bind(self));const ae=se(),ce={setUserRole:async(e,t)=>{const n=oe(ae,"setUserRole");try{return(await n({userId:e,role:t})).data}catch(r){throw console.error("Error assigning role:",r),new Error(r.message||"Failed to assign role")}}},ue=()=>{const{users:e,loading:t,error:n,refetch:r}=B(),[s,a]=p.useState(null),c=async(o,u)=>{a(o);try{await ce.setUserRole(o,u),I.success("Role updated successfully"),await r()}catch(l){I.error(l.message||"Failed to update role")}finally{a(null)}};return t?i.jsxs("div",{className:"user-management",children:[i.jsx("h1",{children:"User Management"}),i.jsx("p",{children:"Loading users..."})]}):n?i.jsxs("div",{className:"user-management",children:[i.jsx("h1",{children:"User Management"}),i.jsxs("p",{className:"error",children:["Error: ",n]}),i.jsx(M,{label:"Retry",style:$.SOLID,onClick:r})]}):i.jsxs("div",{className:"user-management",children:[i.jsx("h1",{children:"User Management"}),i.jsxs("p",{className:"subtitle",children:[e.length," registered user",e.length>1?"s":""]}),i.jsx("div",{className:"users-table",children:i.jsxs("table",{children:[i.jsx("thead",{children:i.jsxs("tr",{children:[i.jsx("th",{children:"Email"}),i.jsx("th",{children:"Current Role"}),i.jsx("th",{children:"Change Role"}),i.jsx("th",{children:"Creation Date"})]})}),i.jsx("tbody",{children:e.map(o=>{var u;return i.jsxs("tr",{children:[i.jsx("td",{children:o.email}),i.jsx("td",{children:i.jsx("span",{className:`role-badge role-${o.role}`,children:g[o.role]})}),i.jsxs("td",{children:[i.jsxs("select",{value:o.role,onChange:l=>c(o.uid,l.target.value),disabled:s===o.uid,className:"role-select",children:[i.jsx("option",{value:N.CLIENT,children:g.client}),i.jsx("option",{value:N.ADMIN,children:g.admin}),i.jsx("option",{value:N.DEV,children:g.dev})]}),s===o.uid&&i.jsx("span",{className:"updating",children:"Updating..."})]}),i.jsx("td",{children:(u=o.createdAt)==null?void 0:u.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})})]},o.uid)})})]})})]})};export{ue as default};
//# sourceMappingURL=UserManagement-mFK0UUrW.js.map
