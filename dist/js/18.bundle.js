(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{1255:function(e,t,n){"use strict";t.__esModule=!0;var a=o(n(1)),i=o(n(1256));function o(e){return e&&e.__esModule?e:{default:e}}t.default=function(e){var t={title:a.default.createElement("span",null,"Missing Credentials"),description:a.default.createElement("div",null,a.default.createElement("p",null,"We can't find an admin type credentials key for this app, this might affect the browsing experience in the current view."),a.default.createElement("p",null,"You can create new credentials ",a.default.createElement("a",{href:"/credentials"},"here"),".")),type:"danger"};return a.default.createElement(i.default,t)}},1256:function(e,t,n){"use strict";t.__esModule=!0;var a=r(n(0)),i=n(1),o=r(i),s=r(n(402));function r(e){return e&&e.__esModule?e:{default:e}}var l=function(e){function t(n){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,n))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.setConfirmBoxInfo=function(){return{title:this.props.title,description:this.props.description,buttons:{confirm:this.props.closeBtn}}},t.prototype.render=function(){return o.default.createElement(s.default,{info:this.setConfirmBoxInfo(),type:this.props.type,showModal:!0})},t}(i.Component);t.default=l,l.propTypes={title:a.default.oneOfType([a.default.string,a.default.element]),description:a.default.oneOfType([a.default.string,a.default.element]),closeBtn:a.default.oneOfType([a.default.string,a.default.element]),type:a.default.string},l.defaultProps={}},331:function(e,t,n){"use strict";t.__esModule=!0;var a=n(1),i=p(a),o=n(16),s=p(n(385)),r=p(n(1255)),l=n(39);function p(e){return e&&e.__esModule?e:{default:e}}var c=function(e){function t(n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,n));return a.state={loadActive:!0},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.componentWillMount=function(){this.initialize(this.props)},t.prototype.componentDidMount=function(){this.setPageHeight()},t.prototype.componentWillReceiveProps=function(e){e.params.appId!=this.appName&&this.initialize(e)},t.prototype.componentWillUnmount=function(){$(window).unbind("resize")},t.prototype.setPageHeight=function(){var e=this,t=function(){var t=$(".ad-detail").height()-$(".ad-detail-page-header").outerHeight();$(e.pageRef).css("height",t)};setTimeout(t,1e3),$(window).resize(function(){setTimeout(t,1e3)})},t.prototype.getPermission=function(){var e=this;o.appbaseService.getPermission(this.appId).then(function(t){e.setState({permission:t,loadActive:!0,showAlert:!1,adminPermission:l.common.getPermission(t.body,"admin")},e.createUrl)})},t.prototype.initialize=function(e){var t;this.appName=e.params.appId,this.appId=o.appbaseService.userInfo.body.apps[this.appName],this.plugin="dejavu",this.setState(((t={})[this.plugin]=null,t.loadActive=!0,t),this.getPermission)},t.prototype.createUrl=function(){if(this.state.adminPermission){var e={url:"https://"+this.state.adminPermission.username+":"+this.state.adminPermission.password+"@scalr.api.appbase.io",appname:this.appName},t=JSON.stringify(e);this.applyUrl(t)}else if(this.state.permission&&this.state.permission.body.length){var n=this.state.permission.body[0],a={url:"https://"+n.username+":"+n.password+"@scalr.api.appbase.io",appname:this.appName},i=JSON.stringify(a);this.applyUrl(i)}else null===this.state.adminPermission&&this.setState({showAlert:!0,loadActive:!1})},t.prototype.applyUrl=function(e){this.setState({dejavu:"https://opensource.appbase.io/dejavu/live/#?app="+e+"&hf=false&subscribe=false"})},t.prototype.onIfreamLoad=function(){this.setState({loadActive:!1})},t.prototype.render=function(){var e=this;return this.pageInfo={currentView:"browser",appName:this.appName,appId:this.appId},i.default.createElement(s.default,{pageInfo:this.pageInfo},i.default.createElement("div",{className:"ad-detail-page ad-dashboard row"},i.default.createElement("header",{className:"ad-detail-page-header header-inline-summary header-align-end col-xs-12 hidden"}),i.default.createElement("div",{className:"ad-detail-page-body col-xs-12",ref:function(t){e.pageRef=t}},i.default.createElement("div",{className:"plugin-container"},this.state.loadActive?i.default.createElement("div",{className:"loadingBar"}):null,this.state[this.plugin]?i.default.createElement("iframe",{onLoad:function(){return e.onIfreamLoad()},src:this.state[this.plugin],height:"100%",width:"100%",frameBorder:"0",title:"dejavu"}):null,this.state.showAlert?i.default.createElement(r.default,this.pageInfo):null))))},t}(a.Component);t.default=c},385:function(e,t,n){"use strict";t.__esModule=!0;var a=p(n(0)),i=n(1),o=p(i),s=p(n(386)),r=p(n(90)),l=n(16);function p(e){return e&&e.__esModule?e:{default:e}}var c=function(){return o.default.createElement("div",{className:"page404"},o.default.createElement("div",{className:"row"},o.default.createElement("div",{className:"col s12"},o.default.createElement("i",{className:"fa fa-exclamation-triangle"}),"  Seems like this app view doesn","'","t exist or you don","'","t have access to it.")),o.default.createElement("div",{className:"row"},o.default.createElement("div",{className:"col s12"},"Go to"," ",o.default.createElement("a",{href:"/apps"},"/apps",o.default.createElement("i",{className:"fa fa-cursor"})))))},u=function(e){function t(n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,n));return a.state={showChild:!1},a.selectedApp=a.props.pageInfo.appName,a.config=r.default,a.getAllApps(),a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.componentWillReceiveProps=function(){this.props.pageInfo.appName!==this.selectedApp&&(this.selectedApp=this.props.pageInfo.appName,this.getAllApps())},t.prototype.isAllowed=function(){this.config.appDashboard.indexOf(this.props.pageInfo.currentView)<0&&l.appbaseService.pushUrl("./apps")},t.prototype.getAllApps=function(){var e=this;l.appbaseService.allApps(!0).then(function(t){var n=t.body.filter(function(t){return e.props.pageInfo.appName===t.appname});e.setState({showChild:!(!n||!n.length)||null})})},t.prototype.render=function(){this.isAllowed();var e=o.default.Children.map(this.props.children,function(e){return o.default.cloneElement(e,{})});return o.default.createElement("div",{className:"ad-detail row"},o.default.createElement(s.default,{currentView:this.props.pageInfo.currentView,appName:this.props.pageInfo.appName,appId:this.props.pageInfo.appId}),o.default.createElement("div",{className:"ad-detail-view-container"},o.default.createElement("div",{className:"ad-detail-view"},this.state.showChild?e:null,null===this.state.showChild?o.default.createElement(c,null):null)))},t}(i.Component);t.default=u,u.propTypes={pageInfo:a.default.shape({currentView:a.default.string.isRequired,appName:a.default.string.isRequired,appId:a.default.oneOfType([a.default.number.isRequired,a.default.string.isRequired])})},u.defaultProps={}},386:function(e,t,n){"use strict";t.__esModule=!0;var a=n(1),i=u(a),o=n(42),s=u(n(37)),r=u(n(141)),l=n(39),p=u(n(90)),c=n(16);function u(e){return e&&e.__esModule?e:{default:e}}var f=function(e){function t(n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,n));return a.config=p.default,a.contextPath=c.appbaseService.getContextPath(),a.state={activeApp:a.props.appName},a.stopUpdate=!1,a.links=[{label:"Dashboard",link:a.contextPath+"dashboard/",type:"internal",name:"dashboard",tooltip:"View app usage stats",img:i.default.createElement("img",{className:"img-responsive",alt:"dashboard",src:"../../../assets/images/"+a.config.name+"/sidebar/dashboard.svg"})},{label:"Mappings",link:a.contextPath+"mappings/",type:"internal",name:"mappings",tooltip:"View or update mappings",img:i.default.createElement("img",{className:"img-responsive",alt:"mappings",src:"../../../assets/images/"+a.config.name+"/sidebar/mapping.svg"})},{label:"Browser",link:a.contextPath+"browser/",type:"internal",name:"browser",tooltip:"Create, view and manage app data",img:i.default.createElement("img",{className:"img-responsive",alt:"browser",src:"../../../assets/images/"+a.config.name+"/sidebar/browser.svg"})},{label:"Search Sandbox",link:a.contextPath+"search-sandbox/",type:"internal",name:"search-sandbox",tooltip:"Update search preferences",img:i.default.createElement("img",{className:"img-responsive",alt:"search-sandbox",src:"../../../assets/images/"+a.config.name+"/sidebar/dashboard.svg"})},{label:"Analytics",link:a.contextPath+"analytics/",type:"internal",name:"analytics",tooltip:"View app analytics",img:i.default.createElement("img",{className:"img-responsive",alt:"analytics",src:"../../../assets/images/"+a.config.name+"/sidebar/dashboard.svg"})},{label:"Credentials",link:a.contextPath+"credentials/",type:"internal",name:"credentials",tooltip:"View and manage API access credentials",img:i.default.createElement("img",{className:"img-responsive",alt:"credentials",src:"../../../assets/images/"+a.config.name+"/sidebar/credentials.svg"})},{label:"Team",link:a.contextPath+"team/",type:"internal",name:"team",tooltip:"Manage who can access your app data",img:i.default.createElement("img",{className:"img-responsive",alt:"team",src:"../../../assets/images/"+a.config.name+"/sidebar/team.svg"})}],a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.changeView=function(e){this.props.changeView(e)},t.prototype.componentWillMount=function(){var e=this;this.listenEvent=l.eventEmitter.addListener("activeApp",function(t){e.stopUpdate||e.setState(t)})},t.prototype.componentDidMount=function(){var e=this,t=function(){$(".ad-detail").css({"min-height":$(e.sidebarRef).height()+30})};setTimeout(t.bind(this),1e3),$(window).resize(t.bind(this))},t.prototype.componentWillUnmount=function(){this.stopUpdate=!0,this.listenEvent&&this.listenEvent.remove(),$(window).unbind("resize")},t.prototype.renderElement=function(e){var t=this,n=null;switch(e){case"links":n=this.links.filter(function(e){return t.config.appDashboard.indexOf(e.name)>-1}).map(function(e,n){var a=(0,s.default)({active:t.props.currentView===e.name}),l=i.default.createElement("div",{className:"img-container"},e.img),p=i.default.createElement(o.Link,{className:a,to:e.link+t.state.activeApp},l,i.default.createElement("span",{className:"ad-detail-sidebar-item-label"},e.label));return i.default.createElement(r.default,{overlay:i.default.createElement("div",null,e.tooltip),mouseLeaveDelay:0,key:e.name+"-"+(n+1)},i.default.createElement("li",{className:"ad-detail-sidebar-item",key:e.name+"-item-"+(n+1)},p))})}return n},t.prototype.render=function(){var e=this;return i.default.createElement("aside",{className:"ad-detail-sidebar"},i.default.createElement("ul",{className:"ad-detail-sidebar-container",ref:function(t){e.sidebarRef=t}},this.renderElement("links")))},t}(a.Component);t.default=f},402:function(e,t,n){"use strict";t.__esModule=!0;var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},i=n(1),o=function(e){return e&&e.__esModule?e:{default:e}}(i),s=n(447),r=n(39);var l=function(e){function t(n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,n));return a.state={showModal:!!a.props.showModal&&a.props.showModal,validate:!1,inputValue:null},a.open=a.open.bind(a),a.onConfirm=a.onConfirm.bind(a),a.onCancel=a.onCancel.bind(a),a.handleInputChange=a.handleInputChange.bind(a),a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.close=function(){this.props.onClose&&this.props.onClose(),this.setState({showModal:!1})},t.prototype.open=function(){this.props.onOpen&&this.props.onOpen(),this.setState({showModal:!0})},t.prototype.onConfirm=function(){this.props.onConfirm&&this.props.onConfirm(),this.close()},t.prototype.onCancel=function(){this.props.onCancel&&this.props.onCancel(),this.close()},t.prototype.getType=function(){return"modal-"+(this.props.type?this.props.type:"info")},t.prototype.handleInputChange=function(e){this.setState({inputValue:e.target.value,validate:e.target.value===this.props.info.validate.value})},t.prototype.render=function(){var e=this,t=o.default.Children.map(this.props.children,function(t){return o.default.cloneElement(t,{onClick:e.open})});return o.default.createElement("div",null,t,o.default.createElement(s.Modal,{className:this.getType(),show:this.state.showModal,onHide:function(){return e.close()}},o.default.createElement(s.Modal.Header,{closeButton:!0},this.props.info&&this.props.info.title?o.default.createElement(s.Modal.Title,null,this.props.info.title):null),o.default.createElement(s.Modal.Body,{className:"clearfix"},o.default.createElement("div",{className:"row"},o.default.createElement("div",{className:"col-xs-12"},this.props.info.description),this.props.info&&this.props.info.validate?o.default.createElement("div",{className:"col-xs-12 form-group"},o.default.createElement("input",{placeholder:this.props.info.validate.placeholder,type:"text",className:"form-control",defaultValue:this.state.inputValue,onChange:this.handleInputChange})):null),o.default.createElement("div",{className:"col-xs-12 p-0"},this.props.info.buttons.confirm?o.default.createElement("button",a({className:"ad-theme-btn ad-confirm-btn"},r.common.isDisabled(this.props.info.validate&&!this.state.validate),{onClick:this.onConfirm}),this.props.info.buttons.confirm):null,this.props.info.buttons.cancel?o.default.createElement("button",{className:"ad-theme-btn ad-cancel-btn",onClick:this.onCancel},this.props.info.buttons.cancel):null))))},t}(i.Component);t.default=l,l.propTypes={},l.defaultProps={}}}]);