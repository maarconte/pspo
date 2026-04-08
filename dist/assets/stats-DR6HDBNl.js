import{c,j as i,aT as r,aU as u,v as n,t as d,aV as h,aW as l,aX as p,aY as m,w as f}from"./index-DlS7ryYa.js";/**
 * @license lucide-react v0.561.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1fy3hk"}]],w=c("bookmark",q);/**
 * @license lucide-react v0.561.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],z=c("circle-check-big",S),k=({value:s,label:e,icon:o,variant:a="default",className:t=""})=>i.jsxs("div",{className:`stat-card ${a!=="default"?a:""} ${t}`.trim(),children:[i.jsx("div",{className:"icon-container",children:o}),i.jsxs("div",{className:"stat-content",children:[i.jsx("strong",{children:s}),i.jsx("span",{children:e})]})]}),x=async s=>{const{userId:e}=s;if(!e)throw new Error("User ID is required to save quiz session");const o=d(n,"users",e,"quizSessions"),a=r(o),t={...s,id:a.id};return await h(a,t),a.id},j=async s=>{if(!s)throw new Error("User ID is required to fetch quiz sessions");const e=d(n,"users",s,"quizSessions"),o=l(e,m("timestamp","desc"),p(50));return(await f(o)).docs.map(t=>t.data())},v=async(s,e,o)=>{if(!s||!e)throw new Error("User ID and Session ID are required to update quiz session");const a=r(n,"users",s,"quizSessions",e);await u(a,o)};export{w as B,z as C,k as S,j as g,x as s,v as u};
//# sourceMappingURL=stats-DR6HDBNl.js.map
