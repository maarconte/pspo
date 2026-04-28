import{r as h,x as J,y as q,z as K,A as S,C as X,_ as Y,E as W,G as Q,H as Z,I as ee,J as I,j as i,K as N,L as T,T as te,B as ne,a as se,h as w}from"./index-Bi0vHPcz.js";import{M as re}from"./Modal-wItV9k2M.js";import{T as oe}from"./Table-BmActEPE.js";import{d as ie,u as ae,a as le,b as ce,g as ue,c as de}from"./index-CMFPL8cX.js";import{T as he,f as U}from"./TableSearch-DZq-AwxG.js";import"./Input-DOEt08Aa.js";const ge=()=>{const[e,t]=h.useState([]),[n,s]=h.useState(!0),[r,o]=h.useState(null),a=async()=>{s(!0),o(null);try{const l=J(q,"users"),d=(await K(l)).docs.map(f=>{var m,E;const c=f.data();return{uid:f.id,email:c.email||"",role:c.role||"client",createdAt:(m=c.createdAt)==null?void 0:m.toDate(),updatedAt:(E=c.updatedAt)==null?void 0:E.toDate()}});t(d)}catch(l){console.error("Error fetching users:",l),o(l.message||"Failed to fetch users")}finally{s(!1)}};return h.useEffect(()=>{a()},[]),{users:e,loading:n,error:r,refetch:a}};/**
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
 */const fe="type.googleapis.com/google.protobuf.Int64Value",pe="type.googleapis.com/google.protobuf.UInt64Value";function L(e,t){const n={};for(const s in e)e.hasOwnProperty(s)&&(n[s]=t(e[s]));return n}function x(e){if(e==null)return null;if(e instanceof Number&&(e=e.valueOf()),typeof e=="number"&&isFinite(e)||e===!0||e===!1||Object.prototype.toString.call(e)==="[object String]")return e;if(e instanceof Date)return e.toISOString();if(Array.isArray(e))return e.map(t=>x(t));if(typeof e=="function"||typeof e=="object")return L(e,t=>x(t));throw new Error("Data cannot be encoded in JSON: "+e)}function C(e){if(e==null)return e;if(e["@type"])switch(e["@type"]){case fe:case pe:{const t=Number(e.value);if(isNaN(t))throw new Error("Data cannot be decoded from JSON: "+e);return t}default:throw new Error("Data cannot be decoded from JSON: "+e)}return Array.isArray(e)?e.map(t=>C(t)):typeof e=="function"||typeof e=="object"?L(e,t=>C(t)):e}/**
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
 */const D="functions";/**
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
 */const v={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class p extends Q{constructor(t,n,s){super(`${D}/${t}`,n||""),this.details=s}}function me(e){if(e>=200&&e<300)return"ok";switch(e){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function ye(e,t){let n=me(e),s=n,r;try{const o=t&&t.error;if(o){const a=o.status;if(typeof a=="string"){if(!v[a])return new p("internal","internal");n=v[a],s=a}const l=o.message;typeof l=="string"&&(s=l),r=o.details,r!==void 0&&(r=C(r))}}catch{}return n==="ok"?null:new p(n,s,r)}/**
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
 */class Ee{constructor(t,n,s){this.auth=null,this.messaging=null,this.appCheck=null,this.auth=t.getImmediate({optional:!0}),this.messaging=n.getImmediate({optional:!0}),this.auth||t.get().then(r=>this.auth=r,()=>{}),this.messaging||n.get().then(r=>this.messaging=r,()=>{}),this.appCheck||s.get().then(r=>this.appCheck=r,()=>{})}async getAuthToken(){if(this.auth)try{const t=await this.auth.getToken();return t==null?void 0:t.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(t){if(this.appCheck){const n=t?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return n.error?null:n.token}return null}async getContext(t){const n=await this.getAuthToken(),s=await this.getMessagingToken(),r=await this.getAppCheckToken(t);return{authToken:n,messagingToken:s,appCheckToken:r}}}/**
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
 */const A="us-central1";function Ne(e){let t=null;return{promise:new Promise((n,s)=>{t=setTimeout(()=>{s(new p("deadline-exceeded","deadline-exceeded"))},e)}),cancel:()=>{t&&clearTimeout(t)}}}class we{constructor(t,n,s,r,o=A,a){this.app=t,this.fetchImpl=a,this.emulatorOrigin=null,this.contextProvider=new Ee(n,s,r),this.cancelAllRequests=new Promise(l=>{this.deleteService=()=>Promise.resolve(l())});try{const l=new URL(o);this.customDomain=l.origin,this.region=A}catch{this.customDomain=null,this.region=o}}_delete(){return this.deleteService()}_url(t){const n=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${n}/${this.region}/${t}`:this.customDomain!==null?`${this.customDomain}/${t}`:`https://${this.region}-${n}.cloudfunctions.net/${t}`}}function Ce(e,t,n){e.emulatorOrigin=`http://${t}:${n}`}function Te(e,t,n){return s=>Ae(e,t,s,{})}async function xe(e,t,n,s){n["Content-Type"]="application/json";let r;try{r=await s(e,{method:"POST",body:JSON.stringify(t),headers:n})}catch{return{status:0,json:null}}let o=null;try{o=await r.json()}catch{}return{status:r.status,json:o}}function Ae(e,t,n,s){const r=e._url(t);return Se(e,r,n,s)}async function Se(e,t,n,s){n=x(n);const r={data:n},o={},a=await e.contextProvider.getContext(s.limitedUseAppCheckTokens);a.authToken&&(o.Authorization="Bearer "+a.authToken),a.messagingToken&&(o["Firebase-Instance-ID-Token"]=a.messagingToken),a.appCheckToken!==null&&(o["X-Firebase-AppCheck"]=a.appCheckToken);const l=s.timeout||7e4,u=Ne(l),d=await Promise.race([xe(t,r,o,e.fetchImpl),u.promise,e.cancelAllRequests]);if(u.cancel(),!d)throw new p("cancelled","Firebase Functions instance was deleted.");const f=ye(d.status,d.json);if(f)throw f;if(!d.json)throw new p("internal","Response is not valid JSON object.");let c=d.json.data;if(typeof c>"u"&&(c=d.json.result),typeof c>"u")throw new p("internal","Response is missing data field.");return{data:C(c)}}const R="@firebase/functions",j="0.11.3";/**
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
 */const De="auth-internal",be="app-check-internal",ke="messaging-internal";function Ie(e,t){const n=(s,{instanceIdentifier:r})=>{const o=s.getProvider("app").getImmediate(),a=s.getProvider(De),l=s.getProvider(ke),u=s.getProvider(be);return new we(o,a,l,u,r,e)};Z(new ee(D,n,"PUBLIC").setMultipleInstances(!0)),I(R,j,t),I(R,j,"esm2017")}/**
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
 */function Ue(e=X(),t=A){const s=Y(S(e),D).getImmediate({identifier:t}),r=W("functions");return r&&ve(s,...r),s}function ve(e,t,n){Ce(S(e),t,n)}function O(e,t,n){return Te(S(e),t)}Ie(fetch.bind(self));const F=Ue(),P={setUserRole:async(e,t)=>{const n=O(F,"setUserRole");try{return(await n({userId:e,role:t})).data}catch(s){throw console.error("Error assigning role:",s),new Error(s.message||"Failed to assign role")}},deleteUser:async e=>{const t=O(F,"deleteUser");try{return(await t({userId:e})).data}catch(n){throw console.error("Error deleting user:",n),new Error(n.message||"Failed to delete user")}}},y=ie(),Re=({onRoleChange:e,onDeleteRequest:t,updatingUserId:n,deletingUserId:s})=>[y.accessor("email",{header:"Email",cell:r=>r.getValue()}),y.accessor("role",{header:"Current Role",cell:r=>{const o=r.getValue();return i.jsx("span",{className:`role-badge role-${o}`,children:N[o]})}}),y.display({id:"changeRole",header:"Change Role",cell:r=>{const o=r.row.original,a=n===o.uid;return i.jsxs("div",{className:"d-flex align-items-center gap-05",children:[i.jsxs("select",{value:o.role,onChange:l=>e(o.uid,l.target.value),disabled:a,className:"role-select",children:[i.jsx("option",{value:T.CLIENT,children:N.client}),i.jsx("option",{value:T.ADMIN,children:N.admin}),i.jsx("option",{value:T.DEV,children:N.dev})]}),a&&i.jsx("span",{className:"updating",children:"Updating..."})]})}}),y.accessor("createdAt",{header:"Creation Date",cell:r=>{const o=r.getValue();return o?o.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}):"-"}}),y.display({id:"actions",header:"Actions",cell:r=>{const o=r.row.original,a=n===o.uid||s===o.uid;return i.jsx("div",{className:"actions-cell",children:i.jsx("button",{className:"delete-button",onClick:()=>t(o),disabled:a,title:"Delete user",children:i.jsx(te,{size:18})})})},enableSorting:!1})],$e=()=>{const{users:e,loading:t,error:n,refetch:s}=ge(),[r,o]=h.useState(null),[a,l]=h.useState(null),[u,d]=h.useState(null),[f,c]=h.useState(!1),[m,E]=h.useState([]),[b,k]=h.useState(""),[M,_]=h.useState({pageIndex:0,pageSize:20}),$=async(g,V)=>{o(g);try{await P.setUserRole(g,V),w.success("Role updated successfully"),await s()}catch(z){w.error(z.message||"Failed to update role")}finally{o(null)}},G=async()=>{if(u){l(u.uid);try{await P.deleteUser(u.uid),w.success("User and data deleted successfully"),c(!1),d(null),await s()}catch(g){w.error(g.message||"Failed to delete user")}finally{l(null)}}},B=Re({onRoleChange:$,onDeleteRequest:g=>{d(g),c(!0)},updatingUserId:r,deletingUserId:a}),H=ae({data:e,columns:B,filterFns:{fuzzy:U},state:{sorting:m,globalFilter:b,pagination:M},globalFilterFn:U,onSortingChange:E,onGlobalFilterChange:k,onPaginationChange:_,getCoreRowModel:de(),getSortedRowModel:ue(),getFilteredRowModel:ce(),getPaginationRowModel:le()});return t?i.jsxs("div",{className:"user-management",children:[i.jsx("h1",{children:"User Management"}),i.jsx("p",{children:"Loading users..."})]}):n?i.jsxs("div",{className:"user-management",children:[i.jsx("h1",{children:"User Management"}),i.jsxs("p",{className:"error",children:["Error: ",n]}),i.jsx(ne,{label:"Retry",style:se.SOLID,onClick:s})]}):i.jsxs("div",{className:"user-management",children:[i.jsxs("div",{className:"header-section",children:[i.jsxs("div",{children:[i.jsx("h1",{children:"User Management"}),i.jsxs("p",{className:"subtitle",children:[e.length," registered user",e.length>1?"s":""]})]}),i.jsx("div",{className:"search-wrapper",children:i.jsx(he,{value:b,onChange:g=>k(String(g))})})]}),i.jsx("div",{className:"users-table",children:i.jsx(oe,{data:H})}),i.jsx(re,{isOpen:f,onClose:()=>c(!1),onConfirm:G,title:"Confirm Deletion",type:"error",labelOnConfirm:"Delete Permanently",labelOnCancel:"Cancel",isConfirmLoading:a!==null,confirmButtonDisabled:a!==null,setIsClosed:c,children:i.jsxs("div",{className:"delete-confirmation-content",children:[i.jsxs("p",{children:["Are you sure you want to delete user ",i.jsx("strong",{children:u==null?void 0:u.email}),"?"]}),i.jsxs("p",{className:"warning-text",children:["This action is ",i.jsx("strong",{children:"irreversible"}),". It will permanently delete:"]}),i.jsxs("ul",{children:[i.jsx("li",{children:"User profile and account"}),i.jsx("li",{children:"All quiz sessions and history"}),i.jsx("li",{children:"All bookmarks and statistics"})]})]})})]})};export{$e as default};
//# sourceMappingURL=UserManagement-Df42E3Cb.js.map
