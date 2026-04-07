import{c as n,aS as r,aT as u,v as i,t as c,aU as d,aV as p,aW as h,aX as q,w as y}from"./index-BoJ_28ik.js";/**
 * @license lucide-react v0.561.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1fy3hk"}]],z=n("bookmark",S);/**
 * @license lucide-react v0.561.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],k=n("circle-check-big",f),m=async s=>{const{userId:e}=s;if(!e)throw new Error("User ID is required to save quiz session");const a=c(i,"users",e,"quizSessions"),o=r(a),t={...s,id:o.id};return await d(o,t),o.id},l=async s=>{if(!s)throw new Error("User ID is required to fetch quiz sessions");const e=c(i,"users",s,"quizSessions"),a=p(e,q("timestamp","desc"),h(50));return(await y(a)).docs.map(t=>t.data())},D=async(s,e,a)=>{if(!s||!e)throw new Error("User ID and Session ID are required to update quiz session");const o=r(i,"users",s,"quizSessions",e);await u(o,a)};export{z as B,k as C,l as g,m as s,D as u};
//# sourceMappingURL=stats-B1RB1wsJ.js.map
