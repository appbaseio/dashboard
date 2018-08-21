(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{322:function(e,t,a){"use strict";t.__esModule=!0,t.regions=void 0;var n=a(1),l=function(e){return e&&e.__esModule?e:{default:e}}(n),r=a(42),s=a(603),i=a(321);var u=t.regions={eastus:{name:"East US",flag:"united-states.png"},centralus:{name:"East US",flag:"united-states.png"},westeurope:{name:"West Europe",flag:"europe.png"},canadacentral:{name:"Canada Central",flag:"canada.png"},canadaeast:{name:"Canada East",flag:"canada.png"}},c=function(e){function t(a){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,a));return n.getFromPricing=function(e,t){var a=Object.values(i.machineMarks).find(function(t){return t.label===e});return(a?a[t]:"-")||"-"},n.initClusters=function(){(0,s.getClusters)().then(function(e){n.setState({clustersAvailable:!!e.length,clusters:e,isLoading:!1}),e.every(function(e){return"in progress"!==e.status||(setTimeout(n.initClusters,3e4),!1)})}).catch(function(e){console.error(e),n.setState({isLoading:!1})})},n.renderClusterRegion=function(e){if(!e)return null;var t=u[e],a=t.name,n=t.flag;return l.default.createElement("div",{className:"region-info"},l.default.createElement("img",{src:"/assets/images/flags/"+n,alt:"US"}),l.default.createElement("span",null,a))},n.state={isLoading:!0,clustersAvailable:!0,clusters:[]},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.componentDidMount=function(){this.initClusters()},t.prototype.render=function(){var e=this,t={display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"calc(100vh - 200px)",width:"100%",fontSize:"20px"};return this.state.isLoading?l.default.createElement("div",{style:t},"Loading clusters..."):this.state.isLoading||this.state.clustersAvailable?l.default.createElement("section",{className:"cluster-container container"},l.default.createElement("article",null,l.default.createElement("h2",null,"My Clusters"),l.default.createElement("ul",{className:"clusters-list"},this.state.clusters.map(function(t){return l.default.createElement("li",{key:t.name,className:"cluster-card compact"},l.default.createElement("h3",null,t.name,l.default.createElement("span",{className:"tag"},"delInProg"===t.status?"deletion in progress":t.status)),l.default.createElement("div",{className:"info-row"},l.default.createElement("div",null,l.default.createElement("h4",null,"Region"),e.renderClusterRegion(t.region)),l.default.createElement("div",null,l.default.createElement("h4",null,"Pricing Plan"),l.default.createElement("div",null,t.pricing_plan)),l.default.createElement("div",null,l.default.createElement("h4",null,"ES Version"),l.default.createElement("div",null,t.es_version)),l.default.createElement("div",null,l.default.createElement("h4",null,"Memory"),l.default.createElement("div",null,e.getFromPricing(t.pricing_plan,"memory")," GB")),l.default.createElement("div",null,l.default.createElement("h4",null,"Disk Size"),l.default.createElement("div",null,e.getFromPricing(t.pricing_plan,"storage")," GB")),l.default.createElement("div",null,l.default.createElement("h4",null,"Nodes"),l.default.createElement("div",null,t.total_nodes)),l.default.createElement("div",null,l.default.createElement(r.Link,{to:"/clusters/"+t.id},l.default.createElement("button",{className:"ad-theme-btn primary"},"View Details")))))})),l.default.createElement("div",{style:{textAlign:"center",margin:"40px 0"}},l.default.createElement(r.Link,{to:"/clusters/new"},l.default.createElement("button",{className:"ad-theme-btn primary"},l.default.createElement("i",{className:"fas fa-plus"}),"  Create a New Cluster"))))):l.default.createElement("div",{style:t},l.default.createElement("i",{className:"fas fa-gift",style:{fontSize:36}}),l.default.createElement("h2",{style:{marginTop:24,fontSize:22}},"You","'","ve unlocked 14 days free trial"),l.default.createElement("p",{style:{margin:"15px 0 20px",fontSize:16}},"Get started with clusters today"),l.default.createElement("div",{style:{textAlign:"center"}},l.default.createElement(r.Link,{to:"/clusters/new"},l.default.createElement("button",{className:"ad-theme-btn primary"},l.default.createElement("i",{className:"fas fa-plus"}),"  Create a New Cluster"))))},t}(n.Component);t.default=c}}]);