(()=>{var t={n:o=>{var e=o&&o.__esModule?()=>o.default:()=>o;return t.d(e,{a:e}),e},d:(o,e)=>{for(var n in e)t.o(e,n)&&!t.o(o,n)&&Object.defineProperty(o,n,{enumerable:!0,get:e[n]})},o:(t,o)=>Object.prototype.hasOwnProperty.call(t,o),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},o={};(()=>{"use strict";t.r(o),t.d(o,{backoffice:()=>it,common:()=>$});const e=((flarum.extensions["flamarkt-backoffice"]||{}).backoffice||{}).app;var n=t.n(e);function a(t,o){return a=Object.setPrototypeOf||function(t,o){return t.__proto__=o,t},a(t,o)}function r(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,a(t,o)}const i=flarum.core.compat["common/components/LoadingIndicator"];var s=t.n(i);const l=flarum.core.compat["common/helpers/icon"];var c=t.n(l);const u=flarum.core.compat["common/app"];var d=t.n(u);const h=flarum.core.compat["common/components/Modal"];var p=t.n(h);const f=flarum.core.compat["forum/components/DiscussionPage"];var v=t.n(f);const x=flarum.core.compat["common/components/Button"];var y=t.n(x);const g=flarum.core.compat["common/helpers/highlight"];var b=t.n(g);const T=flarum.core.compat["common/utils/classList"];var w=t.n(T);const k=flarum.core.compat["common/utils/ItemList"];var F=t.n(k);const I=flarum.core.compat["common/utils/extractText"];var P=t.n(I);const V=((flarum.extensions["flamarkt-backoffice"]||{}).common||{})["utils/KeyboardNavigatable"];var C=t.n(V);const L=flarum.core.compat["common/utils/extract"];var S=t.n(L);const N=flarum.core.compat["common/Model"];var E=t.n(N),A=function(t){function o(){for(var o,e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];return(o=t.call.apply(t,[this].concat(n))||this).name=E().attribute("name"),o.slug=E().attribute("slug"),o.description=E().attribute("description"),o.color=E().attribute("color"),o.icon=E().attribute("icon"),o.order=E().attribute("order"),o.createdAt=E().attribute("createdAt",E().transformDate),o.taxonomy=E().hasOne("taxonomy"),o}return r(o,t),o.prototype.apiEndpoint=function(){return"/flamarkt/taxonomy-terms"+(this.exists?"/"+this.data.id:"")},o}(E());function _(t,o,e){void 0===o&&(o={}),void 0===e&&(e={});var n=t&&t.icon(),a=e.useColor,r=void 0===a||a;return o.className=w()([o.className,"icon",n?t.icon():"TaxonomyIcon"]),t?(o.style=o.style||{},n?o.style.color=r?t.color():"":o.style.backgroundColor=t.color()):o.className+=" untagged",n?m("i",o):m("span",o)}function M(t,o){void 0===t&&(t=null),void 0===o&&(o={}),o.style=o.style||{},o.className="TaxonomyLabel "+(o.className||"");var e=S()(o,"discussionLink"),n=S()(o,"userLink"),a=t?t.name():d().translator.trans("flarum-tags.lib.deleted_tag_text"),r="span";if(t){var i,s=t.color();if(s&&(o.style.backgroundColor=o.style.color=s,o.className+=" colored"),t instanceof A&&t.taxonomy()&&t.taxonomy().showFilter())e&&(o.title=t.description()||"",o.href=d().route("index",((i={})[t.taxonomy().slug()]=t.slug(),i)),o.config=m.route,r="a"),n&&d().routes.fof_user_directory&&(o.title=t.description()||"",o.href=d().route("fof_user_directory",{q:"taxonomy:"+t.taxonomy().slug()+":"+t.slug()}),o.config=m.route,r="a")}else o.className+=" untagged";return m(r,o,m("span.TaxonomyLabel-text",[t&&t.icon()&&_(t,{},{useColor:!1})," "+a]))}function D(){return D=Object.assign||function(t){for(var o=1;o<arguments.length;o++){var e=arguments[o];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])}return t},D.apply(this,arguments)}function O(t){return t.id()?E().getIdentifier(t):D({},E().getIdentifier(t),{attributes:{name:t.name()}})}var B=function(t){function o(){for(var o,e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];return(o=t.call.apply(t,[this].concat(n))||this).availableTerms=null,o.selectedTerms=[],o.searchFilter="",o.activeListIndex=0,o.inputIsFocused=!1,o.saving=!1,o.navigator=void 0,o}r(o,t);var e=o.prototype;return e.oninit=function(o){var e=this;t.prototype.oninit.call(this,o),this.attrs.selectedTerms?this.attrs.selectedTerms.forEach(this.addTerm.bind(this)):this.attrs.resource&&this.attrs.resource.taxonomyTerms().forEach((function(t){t.taxonomy().id()===e.attrs.taxonomy.id()&&e.addTerm(t)})),d().request({method:"GET",url:d().forum.attribute("apiUrl")+this.attrs.taxonomy.apiEndpoint()+"/terms"}).then((function(t){e.availableTerms=d().store.pushPayload(t),m.redraw()})),this.navigator=new(C()),this.navigator.onUp((function(){return e.setIndex(e.activeListIndex-1,!0)})).onDown((function(){return e.setIndex(e.activeListIndex+1,!0)})).onSelect(this.select.bind(this)).onRemove((function(){e.selectedTerms.length&&e.toggleTerm(e.selectedTerms[e.selectedTerms.length-1])})).when((function(t){return" "!==t.key||""!==e.searchFilter||(t.preventDefault(),e.select(t),!1)}))},e.indexInSelectedTerms=function(t){return this.selectedTerms.findIndex((function(o){return n=t,(e=o).data.type===n.data.type&&(e.id()&&n.id()?e.id()===n.id():!e.id()==!n.id()&&e.name()===n.name());var e,n}))},e.addTerm=function(t){this.selectedTerms.push(t)},e.removeTerm=function(t){var o=this.indexInSelectedTerms(t);-1!==o&&this.selectedTerms.splice(o,1)},e.className=function(){return"ChooseTaxonomyTermsModal"},e.title=function(){return this.attrs.resource?d().translator.trans("flamarkt-taxonomies.lib.modal.title.edit",{taxonomy:this.attrs.taxonomy.name(),title:m("em",this.attrs.resource.title?this.attrs.resource.title():this.attrs.resource.displayName())}):d().translator.trans("flamarkt-taxonomies.lib.modal.title.new",{taxonomy:this.attrs.taxonomy.name()})},e.getInstruction=function(){var t=this.selectedTerms.length;if(this.attrs.taxonomy.minTerms()&&t<this.attrs.taxonomy.minTerms()){var o=this.attrs.taxonomy.minTerms()-t;return d().translator.trans("flamarkt-taxonomies.lib.modal.placeholder",{count:o})}return 0===t?d().translator.trans("flamarkt-taxonomies.lib.modal.placeholderOptional"):""},e.filteredAvailableTerms=function(){var t=null===this.availableTerms?[]:this.availableTerms,o=this.searchFilter.toLowerCase();if(o&&(t=t.filter((function(t){return t.name().substr(0,o.length).toLowerCase()===o})),this.attrs.taxonomy.allowCustomValues()&&!t.some((function(t){return t.name().toLowerCase()===o})))){var e=this.attrs.taxonomy.customValueValidation(),n=null;if("alpha_num"===e)n=/^[a-z0-9]$/i;else if("alpha_dash"===e)n=/^[a-z0-9_-]$/i;else if(0===e.indexOf("/")){var a=e.split("/");3===a.length&&(n=new RegExp(a[1],a[2]))}n&&!n.test(this.searchFilter)||t.push(d().store.createRecord("flamarkt-taxonomy-terms",{attributes:{name:this.searchFilter}}))}return this.attrs.taxonomy.maxTerms()&&this.selectedTerms.length>=this.attrs.taxonomy.maxTerms()&&(t=[]),t},e.content=function(){return[this.viewForm(),this.listAvailableTerms(this.filteredAvailableTerms())]},e.viewForm=function(){var t=this.attrs.taxonomy.description();return m(".Modal-body",[t?m("p",t):null,m(".ChooseTaxonomyTermsModal-form",this.formItems().toArray())])},e.formItems=function(){var t=new(F());return t.add("input",m(".ChooseTaxonomyTermsModal-form-input",m(".TermsInput.FormControl",{className:this.inputIsFocused?"focus":""},this.inputItems().toArray())),20),t.add("submit",m(".ChooseTaxonomyTermsModal-form-submit.App-primaryControl",y().component({type:"submit",className:"Button Button--primary",disabled:this.attrs.taxonomy.minTerms()&&this.selectedTerms.length<this.attrs.taxonomy.minTerms(),icon:"fas fa-check",loading:this.saving},d().translator.trans("flamarkt-taxonomies.lib.modal.submit"))),10),t},e.inputItems=function(){var t=this,o=new(F());return o.add("selected",this.selectedTerms.map((function(o){return m("span.TermsInput-term",{onclick:function(){t.toggleTerm(o),t.onready()}},M(o))})),20),o.add("control",m("input.FormControl",{placeholder:P()(this.getInstruction()),value:this.searchFilter,oninput:function(o){t.searchFilter=o.target.value,t.activeListIndex=0},onkeydown:this.navigator.navigate.bind(this.navigator),onfocus:this.oninputfocus.bind(this),onblur:this.oninputblur.bind(this)}),10),o},e.oninputfocus=function(){this.inputIsFocused=!0},e.oninputblur=function(){this.inputIsFocused=!1},e.listAvailableTerms=function(t){return m(".Modal-footer",null===this.availableTerms?s().component():m("ul.ChooseTaxonomyTermsModal-list.SelectTermList",{className:t.some((function(t){return t.description()}))?"SelectTermList--with-descriptions":""},t.map(this.listAvailableTerm.bind(this))))},e.listAvailableTerm=function(t,o){var e=this;return m("li.SelectTermListItem",{"data-index":o,className:w()({colored:!!t.color(),selected:-1!==this.indexInSelectedTerms(t),active:this.activeListIndex===o}),style:{color:t.color()},onmouseover:function(){return e.activeListIndex=o},onclick:this.toggleTerm.bind(this,t)},[_(t),m("span.SelectTermListItem-name",t.exists?b()(t.name(),this.searchFilter):d().translator.trans("flamarkt-taxonomies.lib.modal.custom",{value:m("em",t.name())})),t.description()?m("span.SelectTermListItem-description",t.description()):""])},e.toggleTerm=function(t){var o=this;-1!==this.indexInSelectedTerms(t)?this.removeTerm(t):this.addTerm(t),this.searchFilter&&(this.searchFilter="",this.activeListIndex=0),setTimeout((function(){o.onready()}))},e.select=function(t){var o=this.getDomElement(this.activeListIndex);o.length?t.metaKey||t.ctrlKey||o.is(".selected")?this.selectedTerms.length&&this.onsubmit():o[0].dispatchEvent(new Event("click")):this.searchFilter=""},e.getDomElement=function(t){return this.$('.SelectTermListItem[data-index="'+t+'"]')},e.setIndex=function(t,o){var e=this.$(".ChooseTaxonomyTermsModal-list"),n=this.$(".SelectTermListItem").length;t<0?t=n-1:t>=n&&(t=0);var a=this.getDomElement(t);if(this.activeListIndex=t,m.redraw(),o){var r,i,s,l=e.scrollTop()||0,c=(null==(r=e.offset())?void 0:r.top)||0,u=c+(e.outerHeight()||0),d=(null==(i=a.offset())?void 0:i.top)||0,h=d+(a.outerHeight()||0);d<c?s=l-c+d-parseInt(e.css("padding-top"),10):h>u&&(s=l-u+h+parseInt(e.css("padding-bottom"),10)),void 0!==s&&e.stop(!0).animate({scrollTop:s},100)}},e.onsubmit=function(t){t&&t.preventDefault(),this.attrs.resource?this.saveResource():(this.attrs.onsubmit&&this.attrs.onsubmit(this.selectedTerms),d().modal.close())},e.saveResource=function(){this.saving=!0,this.attrs.resource.save({relationships:{taxonomies:[{verbatim:!0,type:"flamarkt-taxonomies",id:this.attrs.taxonomy.id(),relationships:{terms:{data:this.selectedTerms.map(O)}}}]}}).then(this.onsaved.bind(this),this.onerror.bind(this))},e.onsaved=function(){v()&&d().current.matches(v())&&d().current.get("stream").update(),this.saving=!1,m.redraw(),d().modal.close()},e.onerror=function(){this.saving=!1,m.redraw()},o}(p()),R=function(t){function o(){for(var o,e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];return(o=t.call.apply(t,[this].concat(n))||this).lastSaveState="neutral",o.dropdownIsFocused=!1,o.onmousedown=void 0,o}r(o,t);var e=o.prototype;return e.oninit=function(o){var e=this;t.prototype.oninit.call(this,o),this.navigator.when((function(t){return" "===t.key&&""===e.searchFilter?(t.preventDefault(),e.select(t),!1):"Tab"!==t.key}))},e.oncreate=function(t){var o=this;this.element=t.dom,this.onmousedown=function(e){var n=t.dom.querySelector(".Dropdown-menu");n&&n.contains(e.target)?o.dropdownIsFocused||(o.dropdownIsFocused=!0,m.redraw()):o.dropdownIsFocused&&(o.dropdownIsFocused=!1,m.redraw())},document.addEventListener("mousedown",this.onmousedown)},e.onbeforeremove=function(){},e.onremove=function(o){t.prototype.onremove.call(this,o),document.removeEventListener("mousedown",this.onmousedown)},e.view=function(){var t=this.attrs.taxonomy.description();return m(".ChooseTaxonomyTermsDropdown",m("form",{onsubmit:function(t){t.preventDefault()}},[m(".ChooseTaxonomyTermsInput",[m(".ChooseTaxonomyTermsModal-form",this.formItems().toArray()),this.listAvailableTerms(this.filteredAvailableTerms())]),t?m("p",t):null]))},e.formItems=function(){var o=t.prototype.formItems.call(this);o.remove("submit");var e=null;return this.saving?e=s().component():"success"===this.lastSaveState?e=c()("fas fa-check"):"error"===this.lastSaveState&&(e=c()("fas fa-times")),o.add("status",m(".ChooseTaxonomyTermsStatus",e)),o},e.listAvailableTerms=function(t){return!this.inputIsFocused&&!this.dropdownIsFocused||0===t.length?null:(o=null===this.availableTerms?s().component():t.map(this.listAvailableTerm.bind(this)),m("ul.Dropdown-menu.ChooseTaxonomyTermsModal-list",o));var o},e.listAvailableTerm=function(o,e){return m("li",t.prototype.listAvailableTerm.call(this,o,e))},e.toggleTerm=function(o){t.prototype.toggleTerm.call(this,o),this.lastSaveState="neutral",this.saveResource()},e.select=function(t){var o=this.getDomElement(this.activeListIndex);o.length?o[0].dispatchEvent(new Event("click")):this.searchFilter=""},e.onsaved=function(){this.lastSaveState="success",t.prototype.onsaved.call(this)},e.onerror=function(){this.lastSaveState="error",t.prototype.onerror.call(this)},o}(B);function q(t){return!1===t&&(t=[]),t.slice(0).sort((function(t,o){var e=t.order()-o.order();return 0!==e?e:t.name()>o.name()?1:t.name()<o.name()?-1:0}))}function U(t){return t.slice(0).sort((function(t,o){var e=t.order()-o.order();return 0!==e?e:t.name()>o.name()?1:t.name()<o.name()?-1:0}))}function j(t,o){void 0===o&&(o={});var e=[],n=S()(o,"discussionLink"),a=S()(o,"userLink");if(o.className="TaxonomiesLabel "+(o.className||""),t){var r=S()(o,"taxonomy");r||(r=t[0].taxonomy()),r&&(o["data-slug"]=r.slug(),r.showLabel()&&e.push(M(r,{className:"TaxonomyParentLabel"}))),U(t).forEach((function(o){(o||1===t.length)&&e.push(M(o,{discussionLink:n,userLink:a}))}))}else e.push(M());return m("span",o,e)}var H=function(t){function o(){for(var o,e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];return(o=t.call.apply(t,[this].concat(n))||this).type=E().attribute("type"),o.name=E().attribute("name"),o.slug=E().attribute("slug"),o.description=E().attribute("description"),o.color=E().attribute("color"),o.icon=E().attribute("icon"),o.order=E().attribute("order"),o.showLabel=E().attribute("showLabel"),o.showFilter=E().attribute("showFilter"),o.allowCustomValues=E().attribute("allowCustomValues"),o.customValueValidation=E().attribute("customValueValidation"),o.customValueSlugger=E().attribute("customValueSlugger"),o.minTerms=E().attribute("minTerms"),o.maxTerms=E().attribute("maxTerms"),o.createdAt=E().attribute("createdAt",E().transformDate),o.canSearch=E().attribute("canSearch"),o}r(o,t);var e=o.prototype;return e.apiEndpoint=function(){return"/flamarkt/taxonomies"+(this.exists?"/"+this.data.id:"")},e.apiOrderEndpoint=function(){return this.apiEndpoint()+"/terms/order"},e.apiTermsEndpoint=function(){return this.apiEndpoint()+"/terms"},o}(E()),$={"components/ChooseTaxonomyTermsDropdown":R,"components/ChooseTaxonomyTermsModal":B,"helpers/labelsFromMultipleTaxonomiesList":function(t,o){void 0===o&&(o={});var e=[];return t.forEach((function(t){var o=t.taxonomy();o&&-1===e.indexOf(o)&&e.push(o)})),q(e).map((function(e){return j(t.filter((function(t){return t.taxonomy()===e})),D({},o))}))},"helpers/taxonomyIcon":_,"helpers/termLabel":M,"helpers/termsLabel":j,"models/Taxonomy":H,"models/Term":A,"utils/sortTaxonomies":q,"utils/sortTerms":U,"utils/termToIdentifier":O},z=function(t){function o(){for(var o,e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];return(o=t.call.apply(t,[this].concat(n))||this).dirty=!1,o}r(o,t);var e=o.prototype;return e.className=function(){return"Modal--small TaxonomyEditModal"},e.title=function(){return n().translator.trans(this.translationPrefix()+"title."+(this.isNew()?"new":"edit"))},e.content=function(){return m(".Modal-body",[this.form(),m(".FormGroup",[y().component({type:"submit",className:"Button Button--primary",loading:this.loading,disabled:!this.dirty},n().translator.trans(this.translationPrefix()+"submit."+(this.isNew()?"new":"edit")))," ",this.isNew()?null:y().component({className:"Button Button--link TaxonomyEditModal-delete",loading:this.loading,onclick:this.ondelete.bind(this)},n().translator.trans(this.translationPrefix()+"delete"))])])},o}(p());const G=flarum.core.compat["common/components/Select"];var K=t.n(G);const J=flarum.core.compat["common/utils/string"],Q=flarum.core.compat["common/utils/withAttr"];var W=t.n(Q),X=function(t){function o(){for(var o,e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];return(o=t.call.apply(t,[this].concat(n))||this).type=void 0,o.name=void 0,o.slug=void 0,o.description=void 0,o.color=void 0,o.icon=void 0,o.showLabel=void 0,o.showFilter=void 0,o.allowCustomValues=void 0,o.customValueValidation=void 0,o.customValueSlugger=void 0,o.minTerms=void 0,o.maxTerms=void 0,o}r(o,t);var e=o.prototype;return e.oninit=function(o){t.prototype.oninit.call(this,o);var e=this.attrs.taxonomy;this.type=e?e.type():"discussions",this.name=e?e.name():"",this.slug=e?e.slug():"",this.description=e?e.description():"",this.color=e?e.color():"",this.icon=e?e.icon():"",this.showLabel=!!e&&e.showLabel(),this.showFilter=!!e&&e.showFilter(),this.allowCustomValues=!!e&&e.allowCustomValues(),this.customValueValidation=(e?e.customValueValidation():null)||"",this.customValueSlugger=(e?e.customValueSlugger():null)||"random",this.minTerms=e?e.minTerms():"",this.maxTerms=e?e.maxTerms():""},e.translationPrefix=function(){return"flamarkt-taxonomies.admin.edit-taxonomy."},e.isNew=function(){return!this.attrs.taxonomy},e.form=function(){return this.formItems().toArray()},e.formItems=function(){var t=this,o=new(F()),e={discussions:n().translator.trans(this.translationPrefix()+"type-options.discussions"),users:n().translator.trans(this.translationPrefix()+"type-options.users")};return("flamarkt-core"in flarum.extensions||"products"===this.type)&&(e.products=n().translator.trans(this.translationPrefix()+"type-options.products")),o.add("type",m(".Form-group",[m("label",n().translator.trans(this.translationPrefix()+"field.type")),m(".helpText",n().translator.trans(this.translationPrefix()+"field.typeDescription")),K().component({options:e,value:this.type,onchange:function(o){t.type=o,t.dirty=!0},disabled:!this.isNew()})])),o.add("name",m(".Form-group",[m("label",n().translator.trans(this.translationPrefix()+"field.name")),m("input.FormControl",{type:"text",value:this.name,oninput:W()("value",(function(o){t.name=o,t.slug=(0,J.slug)(o),t.dirty=!0}))})])),o.add("slug",m(".Form-group",[m("label",n().translator.trans(this.translationPrefix()+"field.slug")),m("input.FormControl",{type:"text",value:this.slug,oninput:W()("value",(function(o){t.slug=o,t.dirty=!0}))})])),o.add("description",m(".Form-group",[m("label",n().translator.trans(this.translationPrefix()+"field.description")),m("textarea.FormControl",{value:this.description,oninput:W()("value",(function(o){t.description=o,t.dirty=!0}))})])),o.add("color",m(".Form-group",[m("label",n().translator.trans(this.translationPrefix()+"field.color")),m("input.FormControl",{type:"text",value:this.color,oninput:W()("value",(function(o){t.color=o,t.dirty=!0}))})])),o.add("icon",m(".Form-group",[m("label",n().translator.trans(this.translationPrefix()+"field.icon")),m(".helpText",n().translator.trans(this.translationPrefix()+"field.iconDescription",{a:m("a",{href:"https://fontawesome.com/icons?m=free",tabindex:-1})})),m("input.FormControl",{type:"text",value:this.icon,oninput:W()("value",(function(o){t.icon=o,t.dirty=!0}))})])),o.add("show-label",m(".Form-group",[m("label",[m("input",{type:"checkbox",checked:this.showLabel,onchange:function(){t.showLabel=!t.showLabel,t.dirty=!0}})," ",n().translator.trans(this.translationPrefix()+"field.showLabel")])])),o.add("show-filter",m(".Form-group",[m("label",[m("input",{type:"checkbox",checked:this.showFilter,onchange:function(){t.showFilter=!t.showFilter,t.dirty=!0}})," ",n().translator.trans(this.translationPrefix()+"field.showFilter")])])),o.add("allow-custom",m(".Form-group",[m("label",[m("input",{type:"checkbox",checked:this.allowCustomValues,onchange:function(){t.allowCustomValues=!t.allowCustomValues,t.dirty=!0}})," ",n().translator.trans(this.translationPrefix()+"field.allowCustomValues")])])),o.add("validation",m(".Form-group",[m("label",n().translator.trans(this.translationPrefix()+"field.customValueValidation")),K().component({options:{"":n().translator.trans(this.translationPrefix()+"validation-options.default"),alpha_num:n().translator.trans(this.translationPrefix()+"validation-options.alpha_num"),alpha_dash:n().translator.trans(this.translationPrefix()+"validation-options.alpha_dash"),regex:n().translator.trans(this.translationPrefix()+"validation-options.regex")},value:0===this.customValueValidation.indexOf("/")?"regex":this.customValueValidation,onchange:function(o){t.customValueValidation="regex"===o?"//":o,t.dirty=!0},disabled:!this.allowCustomValues}),0===this.customValueValidation.indexOf("/")?m(".TaxonomyRegexInput",[m("span","/"),m("input.FormControl",{type:"text",value:this.customValueValidation.split("/")[1],oninput:W()("value",(function(o){t.customValueValidation="/"+o+"/"+t.customValueValidation.split("/")[2],t.dirty=!0})),disabled:!this.allowCustomValues}),m("span","/"),m("input.FormControl",{type:"text",value:this.customValueValidation.split("/")[2],oninput:W()("value",(function(o){t.customValueValidation="/"+t.customValueValidation.split("/")[1]+"/"+o,t.dirty=!0})),disabled:!this.allowCustomValues})]):null])),o.add("slugger",m(".Form-group",[m("label",n().translator.trans(this.translationPrefix()+"field.customValueSlugger")),m(".helpText",n().translator.trans(this.translationPrefix()+"field.customValueSluggerDescription")),K().component({options:{random:n().translator.trans(this.translationPrefix()+"slugger-options.random"),alpha_dash:n().translator.trans(this.translationPrefix()+"slugger-options.alpha_dash"),transliterator:n().translator.trans(this.translationPrefix()+"slugger-options.transliterator")},value:this.customValueSlugger,onchange:function(o){t.customValueSlugger=o,t.dirty=!0},disabled:!this.allowCustomValues})])),o.add("field-counts",m(".Form-group",[m("label",n().translator.trans(this.translationPrefix()+"field.countRequired")),m(".helpText",n().translator.trans(this.translationPrefix()+"field.countRequiredDescription")),m(".TaxonomyModal-rangeInput",[m("input.FormControl",{type:"number",min:0,step:1,value:this.minTerms,oninput:W()("value",(function(o){t.minTerms=parseInt(o)||"",t.dirty=!0}))})," ",n().translator.trans(this.translationPrefix()+"field.rangeSeparatorText")," ",m("input.FormControl",{type:"number",min:0,step:1,value:this.maxTerms,oninput:W()("value",(function(o){t.maxTerms=parseInt(o)||"",t.dirty=!0}))})])])),o},e.ondelete=function(){var t=this;confirm(P()(n().translator.trans(this.translationPrefix()+"deleteConfirmation",{name:this.attrs.taxonomy.name()})))&&(this.loading=!0,this.attrs.taxonomy.delete({errorHandler:this.onerror.bind(this)}).then((function(){n().modal.close(),t.attrs.ondelete&&t.attrs.ondelete()}),(function(){t.loaded()})))},e.onsubmit=function(t){var o=this;t.preventDefault(),this.loading=!0,(this.attrs.taxonomy||n().store.createRecord("flamarkt-taxonomies")).save({type:this.type,name:this.name,slug:this.slug,description:this.description,color:this.color,icon:this.icon,show_label:this.showLabel,show_filter:this.showFilter,allow_custom_values:this.allowCustomValues,custom_value_validation:this.customValueValidation,custom_value_slugger:this.customValueSlugger,min_terms:this.minTerms,max_terms:this.maxTerms},{errorHandler:this.onerror.bind(this)}).then((function(t){n().modal.close(),o.attrs.onsave&&o.attrs.onsave(t)}),(function(){o.loaded()}))},o}(z),Y=function(t){function o(){for(var o,e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];return(o=t.call.apply(t,[this].concat(n))||this).name=void 0,o.slug=void 0,o.description=void 0,o.color=void 0,o.icon=void 0,o}r(o,t);var e=o.prototype;return e.oninit=function(o){t.prototype.oninit.call(this,o);var e=this.attrs.term;this.name=e?e.name():"",this.slug=e?e.slug():"",this.description=e?e.description():"",this.color=e?e.color():"",this.icon=e?e.icon():""},e.translationPrefix=function(){return"flamarkt-taxonomies.admin.edit-term."},e.isNew=function(){return!this.attrs.term},e.form=function(){return this.formItems().toArray()},e.formItems=function(){var t=this,o=new(F());return o.add("name",m(".Form-group",[m("label",n().translator.trans(this.translationPrefix()+"field.name")),m("input.FormControl",{type:"text",value:this.name,oninput:W()("value",(function(o){t.name=o,t.slug=(0,J.slug)(o),t.dirty=!0}))})])),o.add("slug",m(".Form-group",[m("label",n().translator.trans(this.translationPrefix()+"field.slug")),m("input.FormControl",{type:"text",value:this.slug,oninput:W()("value",(function(o){t.slug=o,t.dirty=!0}))})])),o.add("description",m(".Form-group",[m("label",n().translator.trans(this.translationPrefix()+"field.description")),m("textarea.FormControl",{value:this.description,oninput:W()("value",(function(o){t.description=o,t.dirty=!0}))})])),o.add("color",m(".Form-group",[m("label",n().translator.trans(this.translationPrefix()+"field.color")),m("input.FormControl",{type:"text",value:this.color,oninput:W()("value",(function(o){t.color=o,t.dirty=!0}))})])),o.add("icon",m(".Form-group",[m("label",n().translator.trans(this.translationPrefix()+"field.icon")),m(".helpText",n().translator.trans(this.translationPrefix()+"field.iconDescription",{a:m("a",{href:"https://fontawesome.com/icons?m=free",tabindex:-1})})),m("input.FormControl",{type:"text",value:this.icon,oninput:W()("value",(function(o){t.icon=o,t.dirty=!0}))})])),o},e.ondelete=function(){var t=this;confirm(P()(n().translator.trans(this.translationPrefix()+"deleteConfirmation",{name:this.attrs.term.name()})))&&(this.loading=!0,this.attrs.term.delete({errorHandler:this.onerror.bind(this)}).then((function(){n().modal.close(),t.attrs.ondelete&&t.attrs.ondelete()}),(function(){t.loaded()})))},e.onsubmit=function(t){var o=this;t.preventDefault(),this.loading=!0;var e=this.attrs.term||n().store.createRecord("flamarkt-taxonomy-terms"),a={errorHandler:this.onerror.bind(this)};this.isNew()&&(a.url=n().forum.attribute("apiUrl")+this.attrs.taxonomy.apiTermsEndpoint()),e.save({name:this.name,slug:this.slug,description:this.description,color:this.color,icon:this.icon},a).then((function(t){n().modal.close(),o.attrs.onsave&&o.attrs.onsave(t)}),(function(){o.loaded()}))},o}(z);const Z=flarum.core.compat["common/components/Page"];var tt=t.n(Z);const ot=((flarum.extensions["flamarkt-backoffice"]||{}).common||{})["components/Sortable"];var et=t.n(ot);const nt=flarum.core.compat["common/Component"];var at=function(t){function o(){for(var o,e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];return(o=t.call.apply(t,[this].concat(n))||this).terms=null,o}r(o,t);var e=o.prototype;return e.oninit=function(o){var e=this;t.prototype.oninit.call(this,o),n().request({method:"GET",url:n().forum.attribute("apiUrl")+this.attrs.taxonomy.apiTermsEndpoint()}).then((function(t){e.terms=n().store.pushPayload(t),m.redraw()}))},e.view=function(){return m(".TaxonomyTermEdit",[null===this.terms?s().component({}):this.viewTerms(this.terms)])},e.viewTerms=function(t){var o=this;return[m(et(),{containerTag:"ol",className:"TaxonomyTermList",handleClassName:null,onsort:function(e,a){t.splice.apply(t,[a,0].concat(t.splice(e,1))),n().request({method:"POST",url:n().forum.attribute("apiUrl")+o.attrs.taxonomy.apiOrderEndpoint(),body:{order:t.map((function(t){return t.id()}))}}).then((function(t){n().store.pushPayload(t)})).catch((function(t){throw m.redraw(),t}))}},t.map((function(o,e){return m("li.TaxonomyTermListItem",{draggable:!0,key:o.id(),style:{color:o.color()}},[_(o),m("span.TaxonomyTermListItem-name",o.name()),y().component({className:"Button Button--link",icon:"fas fa-pencil-alt",onclick:function(){n().modal.show(Y,{term:o,ondelete:function(){t.splice(e,1)}})}})])}))),y().component({className:"Button",onclick:function(){n().modal.show(Y,{taxonomy:o.attrs.taxonomy,onsave:function(e){o.terms=U([].concat(t,[e]))}})}},n().translator.trans("flamarkt-taxonomies.admin.page.create.term"))," ",y().component({className:"Button",onclick:function(){n().request({method:"POST",url:n().forum.attribute("apiUrl")+o.attrs.taxonomy.apiOrderEndpoint(),body:{order:[]}}).then((function(t){o.terms=n().store.pushPayload(t),m.redraw()})).catch((function(t){throw m.redraw(),t}))}},n().translator.trans("flamarkt-taxonomies.admin.page.reset-term-order"))]},o}(t.n(nt)()),rt=function(t){function o(){for(var o,e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];return(o=t.call.apply(t,[this].concat(n))||this).tabIndex=0,o.taxonomies=null,o}r(o,t);var e=o.prototype;return e.oninit=function(o){var e=this;t.prototype.oninit.call(this,o),n().request({method:"GET",url:n().forum.attribute("apiUrl")+"/flamarkt/taxonomies"}).then((function(t){e.taxonomies=n().store.pushPayload(t),m.redraw()}))},e.view=function(){return m(".TaxonomiesPage",m(".container",[null===this.taxonomies?s().component({}):this.viewTaxonomies(this.taxonomies)]))},e.viewTaxonomies=function(t){var o=this;return[m("h2",n().translator.trans("flamarkt-taxonomies.admin.page.title")),m(et(),{className:"TaxonomyTabs",direction:"horizontal",handleClassName:null,onsort:function(e,a){t.splice.apply(t,[a,0].concat(t.splice(e,1))),n().request({method:"POST",url:n().forum.attribute("apiUrl")+"/flamarkt/taxonomies/order",body:{order:t.map((function(t){return t.id()}))}}).then((function(t){o.taxonomies=n().store.pushPayload(t),o.tabIndex=0})).catch((function(t){throw m.redraw(),t}))}},[].concat(t.map((function(e,a){return m(".TaxonomyTab",{draggable:!0,key:e.id(),onclick:function(){o.tabIndex=a},className:o.tabIndex===a?"active":"",style:{color:e.color()}},[_(e)," ",e.name()," ",y().component({className:"Button Button--link",icon:"fas fa-pencil-alt",onclick:function(){n().modal.show(X,{taxonomy:e,ondelete:function(){t.splice(a,1),o.tabIndex=0}})}})])})),[y().component({key:"new",className:"TaxonomyTab",icon:"fas fa-plus",onclick:function(){n().modal.show(X,{onsave:function(e){o.taxonomies=q([].concat(t,[e])),o.tabIndex=o.taxonomies.findIndex((function(t){return t===e}))}})}},n().translator.trans("flamarkt-taxonomies.admin.page.create.taxonomy"))])),this.tabIndex<t.length?m("div",m("div",{key:t[this.tabIndex].id()},at.component({taxonomy:t[this.tabIndex]}))):null]},o}(tt()),it={"components/AbstractEditModal":z,"components/EditTaxonomyModal":X,"components/EditTermModal":Y,"components/TaxonomiesPage":rt,"components/TaxonomyTermsList":at};const st=((flarum.extensions["flamarkt-backoffice"]||{}).backoffice||{})["components/BackofficeNav"];var lt=t.n(st);const mt=((flarum.extensions["flamarkt-core"]||{}).backoffice||{})["pages/ProductShowPage"];var ct=t.n(mt);const ut=flarum.core.compat["common/extend"],dt=flarum.core.compat["common/components/LinkButton"];var ht=t.n(dt);const pt=flarum.core.compat["common/models/Discussion"];var ft=t.n(pt);const vt=flarum.core.compat["common/models/Forum"];var xt=t.n(vt);const yt=flarum.core.compat["common/models/User"];var gt=t.n(yt);const bt=((flarum.extensions["flamarkt-core"]||{}).common||{})["models/Product"];var Tt=t.n(bt);n().initializers.add("flamarkt-taxonomies",(function(){d().store.models["flamarkt-taxonomies"]=H,d().store.models["flamarkt-taxonomy-terms"]=A,xt().prototype.taxonomies=E().hasMany("taxonomies"),ft().prototype.taxonomyTerms=E().hasMany("taxonomyTerms"),gt().prototype.taxonomyTerms=E().hasMany("taxonomyTerms"),Tt()&&(Tt().prototype.taxonomyTerms=E().hasMany("taxonomyTerms")),n().routes.taxonomies={path:"/taxonomies",component:rt},n().extensionData.for("flamarkt-taxonomies").registerSetting((function(){return m(".Form-group",ht().component({className:"Button",href:n().route("taxonomies")},n().translator.trans("flamarkt-taxonomies.admin.settings.goToPage")))})),(0,ut.extend)(lt().prototype,"items",(function(t){t.add("taxonomies",ht().component({href:n().route("taxonomies"),icon:"fas fa-tags"},n().translator.trans("flamarkt-taxonomies.admin.menu.title")))})),ct()&&(0,ut.extend)(ct().prototype,"fields",(function(t){var o=this;this.product.exists&&this.product.attribute("canEditTaxonomies")&&q(n().forum.taxonomies()).forEach((function(e){"products"===e.type()&&t.add("taxonomy-"+e.slug(),m(".Form-group",[m("label",e.name()),m(R,{resource:o.product,taxonomy:e})]),-100)}))}))}))})(),module.exports=o})();
//# sourceMappingURL=backoffice.js.map