(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{331:function(e,t,a){"use strict";t.__esModule=!0;var n=a(1),l=p(n),r=a(16),s=p(a(789)),o=p(a(788)),i=p(a(786)),c=a(408),u=a(785);function p(e){return e&&e.__esModule?e:{default:e}}var d=function(e){function t(a,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var l=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,a));l.stripeKey="pk_live_ihb1fzO4h1ykymhpZsA3GaQR";var r=localStorage.getItem("billingMode");l.allowedPlan=["free","bootstrap","growth","dedicated"],l.modeText={monthly:"monthly",annually:"annual"},l.planText="Choose plan";var s=!r||"monthly"!=r&&"annual"!=r?"annual":r;return l.state={mode:s,plan:"free",activeMode:s,activePlan:"free",customer:{plan:"free",mode:"annual"},pricingError:{show:!1,text:""},loading:null,loadingModal:!1,showPlanChange:!1,customerCopy:null,billingText:null},l.changePlan=l.changePlan.bind(l),l.changePlanModal=l.changePlanModal.bind(l),l.confirmPlan=l.confirmPlan.bind(l),l.checkoutInit=l.checkoutInit.bind(l),l.checkCustomer=l.checkCustomer.bind(l),l.init(),l}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.init=function(){this.count=0,this.userProfile=r.appbaseService.userInfo.body,this.checkCustomer()},t.prototype.checkCustomer=function(){var e=this,t={c_id:this.userProfile.c_id};this.count++,c.billingService.getCustomer(t).then(function(t){e.customer=t,e.customer.mode=t.mode?t.mode:e.state.mode,e.plan=e.allowedPlan.indexOf(t.plan)>-1?t.plan:"free",e.stripeExists="stripeKey"in t,e.stripeExists&&t.subscriptionId||(e.stripeSetup=new u.StripeSetup(e.stripeKey,e.stripeCb.bind(e))),e.setState({customer:e.customer,mode:e.customer.mode,plan:e.plan,activeMode:e.customer.mode,activePlan:e.customer.plan})}).catch(function(t){t&&"NOTEXISTS"===t.message?e.createCustomer():"Error fetching client from mssql"===t.message&&e.checkCustomer()})},t.prototype.createCustomer=function(){var e=this,t={email:this.userProfile.email,userInfo:this.userProfile};c.billingService.createCustomer(t).then(function(t){e.checkCustomer()}).catch(function(e){})},t.prototype.changePlanModal=function(e,t,a){this.setState({showPlanChange:!0,billingText:e,customerCopy:t,tempPlan:a})},t.prototype.changePlan=function(e){this.setState({mode:e})},t.prototype.closeModal=function(){this.setState({showPlanChange:!1})},t.prototype.checkoutInit=function(e,t){this.checkoutPlan=e,this.checkoutMode=this.state.mode,this.stripeSetup||(this.stripeSetup=new u.StripeSetup(this.stripeKey,this.stripeCb.bind(this))),this.stripeSetup.checkoutOpen(t,e,this.state.mode)},t.prototype.stripeCb=function(e){var t=this;this.setState({loading:this.checkoutPlan,loadingModal:!0}),(0,u.checkoutCb)(this.state.customer,this.userProfile,e).then(function(e){t.setState({customerCopy:t.state.customer,tempPlan:t.checkoutPlan,mode:t.checkoutMode},t.confirmPlan.bind(t))}).catch(function(e){t.setState({loading:null,loadingModal:!1})})},t.prototype.confirmPlan=function(){var e=this;this.customerCopy=this.state.customerCopy,this.customerCopy.plan=this.state.tempPlan,this.customerCopy.mode=this.state.mode,this.pricingError={show:!1,text:""},this.setState({loading:this.customerCopy.plan,loadingModal:!0}),c.billingService.updateCustomer(this.customerCopy,"planChange").then(function(t){e.customer=t,e.plan=t.plan,e.setState({customer:e.customer,activePlan:t.plan,activeMode:t.mode,loading:null,loadingModal:!1}),e.closeModal()}).catch(function(t){e.setState({show:!0,text:t&&t.message&&t.message.raw&&t.message.raw.message?t.message.raw.message:t,loading:null,loadingModal:!1})})},t.prototype.renderElement=function(e){var t=this,a=null;switch(e){case"cards":a=Object.keys(c.billingService.planLimits).map(function(e,a){return l.default.createElement(o.default,{key:a,mode:t.state.mode,plan:e,customer:t.state.customer,activePlan:t.state.activePlan,activeMode:t.state.activeMode,changePlanModal:t.changePlanModal,checkoutInit:t.checkoutInit,loading:t.state.loading})})}return a},t.prototype.render=function(){var e=this;return l.default.createElement("div",null,l.default.createElement("div",{id:"pricing-page"},l.default.createElement(s.default,{customer:this.state.customer,mode:this.state.mode,changePlan:this.changePlan}),l.default.createElement("section",{className:"container-fluid",id:"cards"},l.default.createElement("div",{className:"row cards-container"},this.renderElement("cards")))),l.default.createElement(i.default,{billingText:this.state.billingText,showPlanChange:this.state.showPlanChange,customer:this.state.customerCopy,tempPlan:this.state.tempPlan,mode:this.state.mode,closeModal:function(){return e.closeModal()},activePlan:this.state.plan,confirmPlan:this.confirmPlan,loadingModal:this.state.loadingModal}))},t}(n.Component);t.default=d},408:function(e,t,a){"use strict";t.__esModule=!0,t.billingService=void 0;var n=a(38),l=a(94);var r=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.address=l.ACC_API,this.billingAddress="https://transactions.appbase.io",this.planLimits={free:{action:1e5,records:1e4},bootstrap:{action:1e6,records:5e4},growth:{action:1e7,records:1e6}},this.prices={monthly:{bootstrap:29,growth:99,dedicated:499},annual:{bootstrap:19,growth:69,dedicated:299}}}return e.prototype.getCustomer=function(e){return n.$http.start({url:this.billingAddress+"/api/me",data:e,method:"POST"})},e.prototype.createCustomer=function(e){return n.$http.start({url:this.billingAddress+"/api/createCustomer",data:e,method:"POST"})},e.prototype.stripeConnect=function(e){return n.$http.start({url:this.billingAddress+"/api/stripeConnect",data:e,method:"POST"})},e.prototype.updateStripeCustomer=function(e){return n.$http.start({url:this.billingAddress+"/api/updateStripeCustomer",data:e,method:"POST"})},e.prototype.updateCustomer=function(e,t){return n.$http.start({url:this.billingAddress+"/api/updateCustomer/"+t,data:e,method:"POST"})},e.prototype.paymentInfo=function(e,t){return n.$http.start({url:this.billingAddress+"/api/paymentInfo",data:e,method:"POST"})},e.prototype.updateSubscribe=function(e){return n.$http.start({url:this.billingAddress+"/billing/subscribe",data:e,method:"PUT"})},e.prototype.cancelSubscription=function(e){return n.$http.start({url:this.billingAddress+"/billing/cancelSubscription",data:e,method:"POST"})},e.prototype.usage=function(e,t){var a=this.billingAddress+"/usage";return e&&t&&(a=this.billingAddress+"/usage?start="+e+"&end="+t),n.$http.start({url:a,method:"GET"})},e.prototype.calculator=function(){return n.$http.start({url:this.billingAddress+"/calculator",method:"GET"})},e}();t.billingService=new r},785:function(e,t,a){"use strict";var n=a(408);var l=function(){function e(t,a){var n=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.handler=StripeCheckout.configure({key:t,image:"../../../assets/images/pricing/stripeLogo.png",locale:"auto",token:function(e){a(e)}}),$(window).on("popstate",function(){n.handler.close()})}return e.prototype.checkoutOpen=function(e,t,a){var n=e||"charged "+a;this.handler.open({name:"appbase.io "+t+" plan",description:n,amount:this.getAmount(a,t),opened:function(){},closed:function(){}})},e.prototype.getAmount=function(e,t){var a="annual"===e?12:1;return 100*n.billingService.prices[e][t]*a},e}();e.exports={StripeSetup:l,checkoutCb:function(e,t,a){return e.stripeKey?function(a){var l={email:t.email,customerId:e.stripeKey,stripeToken:a.id};return n.billingService.updateStripeCustomer(l)}.call(this,a):function(e){var a={email:t.email,stripeKey:e.id};return n.billingService.stripeConnect(a)}.call(this,a)}}},786:function(e,t,a){"use strict";t.__esModule=!0;var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e},l=a(1),r=function(e){return e&&e.__esModule?e:{default:e}}(l),s=a(414),o=a(95),i=a(38);var c=function(e){function t(a){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,a))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.renderBody=function(){var e=null;return this.props.billingText&&(e=r.default.createElement(s.Modal.Body,null,r.default.createElement("div",{className:"final-amount"},this.props.billingText.finalMode," $",this.props.billingText.finalAmount,"."),r.default.createElement("div",{className:"breakdown"},r.default.createElement("h4",null,"Breakdown:"),this.props.billingText.payment.amount?r.default.createElement("div",{className:"payment"},r.default.createElement("h5",null,"Price for ",this.props.customer.plan," plan: $",this.props.billingText.payment.amount),r.default.createElement("p",{className:"description"},"(",this.props.billingText.payment.explain,")")):null,this.props.billingText.refund.amount?r.default.createElement("div",{className:"refund"},r.default.createElement("h5",null,"Refund from ",this.props.activePlan," plan: $",this.props.billingText.refund.amount),r.default.createElement("p",{className:"description"},"(",this.props.billingText.refund.explain,")")):null))),e},t.prototype.render=function(){var e=this;return r.default.createElement(s.Modal,{id:"paymentModal",show:this.props.showPlanChange,onHide:function(){return e.props.closeModal()}},r.default.createElement(s.Modal.Header,{closeButton:!0},r.default.createElement("div",{className:"Header-logo"},r.default.createElement("div",{className:"Header-logoWrap"},r.default.createElement("div",{className:"Header-logoBevel"}),r.default.createElement("div",{className:"Header-logoBorder"}),r.default.createElement("div",{className:"Header-logoImage",style:{backgroundImage:"url('../../../assets/images/pricing/stripeLogo.png')"},alt:"Logo"}))),r.default.createElement(s.Modal.Title,null,"appbase.io ",this.props.plan," plan"),r.default.createElement("span",{className:"bottomline"},"charged ","annual"===this.props.mode?"annually":"monthly")),r.default.createElement("div",{className:"seprator-container"},r.default.createElement("div",{className:"seprator"})),this.renderBody(),r.default.createElement(s.Modal.Footer,null,r.default.createElement("button",n({},i.common.isDisabled(this.props.loadingModal),{type:"button",className:"btn btn-primary col-xs-12 saveBtn",onClick:this.props.confirmPlan}),this.props.loadingModal?r.default.createElement(o.Loading,null):null,"Confirm plan change")))},t}(l.Component);t.default=c,c.propTypes={},c.defaultProps={}},787:function(e,t,a){"use strict";var n=r(a(1)),l=(r(a(36)),a(408));function r(e){return e&&e.__esModule?e:{default:e}}e.exports={FreeHeader:function(e){return n.default.createElement("div",{className:"title"},n.default.createElement("span",null,n.default.createElement("span",{className:"unit"},"$"),n.default.createElement("span",{className:"plan-price"},"0")),n.default.createElement("span",{className:"superscript"},"FREE"))},FreeDescription:function(e){return n.default.createElement("ul",{className:"description"},n.default.createElement("li",{className:"with-icon"},n.default.createElement("span",{className:"icon-container"},n.default.createElement("img",{src:"../../../assets/images/pricing/calls.png",alt:"",className:"img-responsive"})),n.default.createElement("div",{className:"text-container"},n.default.createElement("div",{className:"figure flex"},e.cardInfo.action,n.default.createElement("div",{className:"summary"}," API calls")))),n.default.createElement("li",{className:"with-icon"},n.default.createElement("span",{className:"icon-container"},n.default.createElement("img",{src:"../../../assets/images/pricing/records.png",alt:"",className:"img-responsive"})),n.default.createElement("div",{className:"text-container"},n.default.createElement("div",{className:"figure flex"},e.cardInfo.records,n.default.createElement("div",{className:"summary"}," Records")))),n.default.createElement("li",null,n.default.createElement("img",{src:"../../../assets/images/pricing/PB_Appbase_Black.svg",alt:"",className:"img-responsive appbase-logo img-center"})),n.default.createElement("li",null,n.default.createElement("div",{className:"text-container text-center"},n.default.createElement("div",{className:"figure light"},n.default.createElement("a",{href:"https://appbase.io/static/poweredby_logo_placement.zip",className:"logo-link"},n.default.createElement("i",{className:"fa fa-arrow-down"})," Requires logo placement")))))},BootstrapHeader:function(e){return n.default.createElement("div",{className:"title"},n.default.createElement("span",null,n.default.createElement("span",{className:"unit"},"$"),n.default.createElement("span",{className:"plan-price"},l.billingService.prices[e.mode][e.plan])),n.default.createElement("span",{className:"superscript"},"BOOTSTRAP"),n.default.createElement("span",{className:"subscript"},"per app / month"))},BootstrapDescription:function(e){return n.default.createElement("ul",{className:"description"},n.default.createElement("li",{className:"with-icon"},n.default.createElement("span",{className:"icon-container"},n.default.createElement("img",{src:"../../../assets/images/pricing/calls.png",alt:"",className:"img-responsive"})),n.default.createElement("div",{className:"text-container"},n.default.createElement("div",{className:"figure flex"},e.cardInfo.action,n.default.createElement("div",{className:"summary"}," API calls")),n.default.createElement("div",{className:"small-fonts"},"$5 per additional ",n.default.createElement("br",null)," 1M API calls"))),n.default.createElement("li",{className:"with-icon"},n.default.createElement("span",{className:"icon-container"},n.default.createElement("img",{src:"../../../assets/images/pricing/records.png",alt:"",className:"img-responsive"})),n.default.createElement("div",{className:"text-container"},n.default.createElement("div",{className:"figure flex"},e.cardInfo.records,n.default.createElement("div",{className:"summary"}," Records")),n.default.createElement("div",{className:"small-fonts"},"$5 per additional ",n.default.createElement("br",null)," 50k records"))),n.default.createElement("li",null,n.default.createElement("div",{className:"text-container"},n.default.createElement("div",{className:"big-description"},"E-mails and chat"))))},GrowthHeader:function(e){return n.default.createElement("div",{className:"title"},n.default.createElement("span",null,n.default.createElement("span",{className:"unit"},"$"),n.default.createElement("span",{className:"plan-price"},l.billingService.prices[e.mode][e.plan])),n.default.createElement("span",{className:"superscript"},"GROWTH"),n.default.createElement("span",{className:"subscript"},"per app / month"))},GrowthDescription:function(e){return n.default.createElement("ul",{className:"description"},n.default.createElement("li",{className:"with-icon"},n.default.createElement("span",{className:"icon-container"},n.default.createElement("img",{src:"../../../assets/images/pricing/calls.png",alt:"",className:"img-responsive"})),n.default.createElement("div",{className:"text-container"},n.default.createElement("div",{className:"figure flex"},e.cardInfo.action,n.default.createElement("div",{className:"summary"}," API calls")),n.default.createElement("div",{className:"small-fonts"},"$50 per additional ",n.default.createElement("br",null)," 10M API calls"))),n.default.createElement("li",{className:"with-icon"},n.default.createElement("span",{className:"icon-container"},n.default.createElement("img",{src:"../../../assets/images/pricing/records.png",alt:"",className:"img-responsive"})),n.default.createElement("div",{className:"text-container"},n.default.createElement("div",{className:"figure flex"},e.cardInfo.records,n.default.createElement("div",{className:"summary"}," Records")),n.default.createElement("div",{className:"small-fonts"},"$50 per additional ",n.default.createElement("br",null)," 1M records"))),n.default.createElement("li",null,n.default.createElement("div",{className:"text-container"},n.default.createElement("div",{className:"big-description list-bottom-gap"},"1:1 architecture reviews"),n.default.createElement("div",{className:"big-description"},"E-mails and chat"))))}}},788:function(e,t,a){"use strict";t.__esModule=!0;var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e},l=a(1),r=p(l),s=p(a(36)),o=a(408),i=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}(a(787)),c=a(95),u=a(38);function p(e){return e&&e.__esModule?e:{default:e}}var d=function(e){function t(a){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,a));return n.state={localLoading:!1},n.cardInfo=o.billingService.planLimits[n.props.plan],n.changeSubscribe=n.changeSubscribe.bind(n),n.updateCustomer=n.updateCustomer.bind(n),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.renderElement=function(e){var t=null;switch(e){case"freeHeader":t=r.default.createElement(i.FreeHeader,n({},this.props,{cardInfo:this.cardInfo}));break;case"freeDescription":t=r.default.createElement(i.FreeDescription,n({},this.props,{cardInfo:this.cardInfo}));break;case"bootstrapHeader":t=r.default.createElement(i.BootstrapHeader,n({},this.props,{cardInfo:this.cardInfo}));break;case"bootstrapDescription":t=r.default.createElement(i.BootstrapDescription,n({},this.props,{cardInfo:this.cardInfo}));break;case"growthHeader":t=r.default.createElement(i.GrowthHeader,n({},this.props,{cardInfo:this.cardInfo}));break;case"growthDescription":t=r.default.createElement(i.GrowthDescription,n({},this.props,{cardInfo:this.cardInfo}))}return t},t.prototype.changeSubscribe=function(){this.customerCopy=JSON.parse(JSON.stringify(this.props.customer)),"free"===this.props.plan?this.updateCustomer():this.customerCopy.hasOwnProperty("stripeKey")&&this.customerCopy.stripeKey?this.customerCopy.subscriptionId?this.updateCustomer():this.props.checkoutInit(this.props.plan,this.updateText()):this.props.checkoutInit(this.props.plan)},t.prototype.updateText=function(){return"Your old plan amount will be adjust in new plan."},t.prototype.updateCustomer=function(){var e=this;this.customerCopy.plan=this.props.plan,this.customerCopy.mode=this.props.mode,this.setState({localLoading:!0}),o.billingService.paymentInfo(this.customerCopy).then(function(t){console.log(t);var a=t.message;a.invoice.total=a.invoice.total/100,a.invoice.total=a.invoice.total.toFixed(2),e.billingText={finalMode:a.invoice.total<0?"Your net refund amount will be ":"Your net payment due will be ",refund:e.setRefund(a),payment:e.setPayment(a)};var n=e.billingText.payment.amount-e.billingText.refund.amount;e.billingText.finalAmount=n<0?-n:n,e.billingText.finalAmount=e.billingText.finalAmount.toFixed(2),e.props.changePlanModal(e.billingText,e.customerCopy,e.props.plan),e.setState({localLoading:!1})}).catch(function(t){e.setState({localLoading:!1}),console.log(t)})},t.prototype.setRefund=function(e){var t=this,a={amount:0,explain:null};return e.current_prorations.forEach(function(e){e.plan.id===t.props.activePlan+"-"+t.props.activeMode&&(a.amount=e.amount/100,a.amount=a.amount<0?-a.amount:a.amount,a.explain=e.description)}),a},t.prototype.setPayment=function(e){var t=this,a={amount:0,explain:null};if("free"!=this.customerCopy.plan){var n=!1;e.invoice.lines.data.forEach(function(e){n||e.plan.id!==t.customerCopy.plan+"-"+t.customerCopy.mode||(n=!0,a.amount=e.amount/100,a.explain="The charge for "+("annual"==t.customerCopy.mode?"annual":"month")+" "+t.customerCopy.plan+" plan is $"+("annual"===t.customerCopy.mode?(a.amount/12).toFixed(2)+"x12":a.amount))})}return a},t.prototype.render=function(){var e=(0,s.default)({subscribed:this.props.plan===this.props.activePlan&&this.props.mode===this.props.activeMode}),t=this.props.loading===this.props.plan||this.state.localLoading;return r.default.createElement("div",{className:"col-xs-12 col-sm-12 single-card-container",id:this.props.plan+"-card"},r.default.createElement("div",{className:"price-card"},this.renderElement(this.props.plan+"Header"),this.renderElement(this.props.plan+"Description"),r.default.createElement("div",{className:"button text-center plan-button"},r.default.createElement("button",n({},u.common.isDisabled(t),{className:"pos-relative new-btn get-started "+e,onClick:this.changeSubscribe}),t?r.default.createElement(c.Loading,null):null,r.default.createElement("span",null," ",this.props.activePlan===this.props.plan&&this.props.mode===this.props.activeMode?"Current plan":"Subscribe plan"," ")))))},t}(l.Component);t.default=d},789:function(e,t,a){"use strict";t.__esModule=!0,t.default=function(e){var t={monthly:(0,l.default)({active:"monthly"===e.mode}),annual:(0,l.default)({active:"annual"===e.mode})};return n.default.createElement("section",{className:"container-fluid",id:"top-container"},n.default.createElement("div",{className:"row"},n.default.createElement("div",{className:"pricing-top col-xs-12"},n.default.createElement("div",{className:"container"},n.default.createElement("div",{className:"row"},n.default.createElement("h1",{className:"col-xs-12"},"Pricing Plans")),n.default.createElement("div",{className:"row"},n.default.createElement("div",{className:"toggleButton"},n.default.createElement("button",{className:"btn left monthly "+t.monthly,onClick:function(){return e.changePlan("monthly")}},"Monthly"),n.default.createElement("button",{className:"btn right monthly "+t.annual,onClick:function(){return e.changePlan("annual")}},"Annual")),e.customer?n.default.createElement("p",{className:"col-xs-12 plan-bottomline"},"You are currently subscribed to the ",e.customer.mode," ",e.customer.plan," plan."):null)))))};var n=r(a(1)),l=r(a(36));function r(e){return e&&e.__esModule?e:{default:e}}}}]);