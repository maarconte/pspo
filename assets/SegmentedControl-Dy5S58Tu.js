import{c as d,j as s}from"./index-DAPgw2VV.js";/**
 * @license lucide-react v0.561.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r=[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],t=d("clock",r),i=({options:a,value:c,onChange:l,name:n})=>s.jsxs("div",{className:"segmented-control",children:[a.map(e=>s.jsxs("label",{className:`segmented-item ${c===e.value?"active":""}`,children:[s.jsx("input",{type:"radio",name:n,value:e.value,checked:c===e.value,onChange:()=>l(e.value)}),s.jsxs("div",{className:"segmented-label",children:[e.icon&&s.jsx("span",{className:"segmented-icon",children:e.icon}),s.jsx("span",{children:e.label})]})]},e.value)),s.jsx("div",{className:"segmented-slider",style:{width:`calc(${100/a.length}% - 4px)`,transform:`translateX(calc(${a.findIndex(e=>e.value===c)*100}%))`}})]});export{t as C,i as S};
//# sourceMappingURL=SegmentedControl-Dy5S58Tu.js.map
