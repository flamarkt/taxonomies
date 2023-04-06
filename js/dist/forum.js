(()=>{var t={n:o=>{var e=o&&o.__esModule?()=>o.default:()=>o;return t.d(e,{a:e}),e},d:(o,e)=>{for(var n in e)t.o(e,n)&&!t.o(o,n)&&Object.defineProperty(o,n,{enumerable:!0,get:e[n]})},o:(t,o)=>Object.prototype.hasOwnProperty.call(t,o),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},o={};(()=>{"use strict";t.r(o),t.d(o,{common:()=>Q,forum:()=>it});const e=flarum.core.compat["forum/app"];var n=t.n(e);function r(t,o){return r=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,o){return t.__proto__=o,t},r(t,o)}function a(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,r(t,o)}const s=flarum.core.compat["common/components/LoadingIndicator"];var i=t.n(s);const l=flarum.core.compat["common/helpers/icon"];var c=t.n(l);const u=flarum.core.compat["common/app"];var f=t.n(u);const d=flarum.core.compat["common/components/Modal"];var p=t.n(d);const h=flarum.core.compat["forum/components/DiscussionPage"];var y=t.n(h);const x=flarum.core.compat["common/components/Button"];var v=t.n(x);const g=flarum.core.compat["common/components/Switch"];var T=t.n(g);const b=flarum.core.compat["common/helpers/highlight"];var w=t.n(b);const I=flarum.core.compat["common/utils/classList"];var k=t.n(I);const S=flarum.core.compat["common/utils/ItemList"];var L=t.n(S);const C=flarum.core.compat["common/utils/extractText"];var E=t.n(C);const F=((flarum.extensions["flamarkt-backoffice"]||{}).common||{})["utils/KeyboardNavigatable"];var P=t.n(F);const A=flarum.core.compat["common/components/Link"];var O=t.n(A);const D=flarum.core.compat["common/utils/extract"];var N=t.n(D);const M=flarum.core.compat["common/Model"];var q=t.n(M),B=function(t){function o(){for(var o,e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return(o=t.call.apply(t,[this].concat(n))||this).name=q().attribute("name"),o.slug=q().attribute("slug"),o.description=q().attribute("description"),o.color=q().attribute("color"),o.icon=q().attribute("icon"),o.order=q().attribute("order"),o.createdAt=q().attribute("createdAt",q().transformDate),o.taxonomy=q().hasOne("taxonomy"),o}return a(o,t),o.prototype.apiEndpoint=function(){return"/flamarkt/taxonomy-terms"+(this.exists?"/"+this.data.id:"")},o}(q());function _(t,o,e){void 0===o&&(o={}),void 0===e&&(e={});var n=t&&t.icon(),r=e.useColor,a=void 0===r||r;return o.className=k()([o.className,"icon",n?t.icon():"TaxonomyIcon"]),t?(o.style=o.style||{},n?o.style.color=a?t.color():"":o.style.backgroundColor=t.color()):o.className+=" untagged",n?m("i",o):m("span",o)}function R(t,o){void 0===t&&(t=null),void 0===o&&(o={}),o.style=o.style||{},o.className="TaxonomyLabel "+(o.className||"");var e=N()(o,"discussionLink"),n=N()(o,"userLink"),r=N()(o,"productLink"),a=t?t.name():f().translator.trans("flarum-tags.lib.deleted_tag_text"),s="span";if(t){var i=t.color();i&&(o.style.backgroundColor=o.style.color=i,o.className+=" colored"),o.title=t.description()||void 0;var l=t instanceof B&&t.taxonomy();if(l&&l.canSearch()){var c,u,d=null;e&&(d=f().route("index",((c={})[l.slug()]=t.slug(),c))),n&&f().routes.fof_user_directory&&(d=f().route("fof_user_directory",{q:"taxonomy:"+l.slug()+":"+t.slug()})),r&&(d=f().route("flamarkt.products.index",((u={})[l.slug()]=t.slug(),u))),d&&(o.href=d,s=O())}}else o.className+=" untagged";return m(s,o,m("span.TaxonomyLabel-text",[t&&t.icon()&&_(t,{},{useColor:!1})," "+a]))}function U(){return U=Object.assign?Object.assign.bind():function(t){for(var o=1;o<arguments.length;o++){var e=arguments[o];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])}return t},U.apply(this,arguments)}function j(t){return t.id()?q().getIdentifier(t):U({},q().getIdentifier(t),{attributes:{name:t.name()}})}function V(t){return f().request({method:"GET",url:f().forum.attribute("apiUrl")+t.apiTermsEndpoint()}).then((function(o){var e=f().store.pushPayload(o);return e.forEach((function(o){o.pushData({relationships:{taxonomy:t}})})),e}))}var z=function(t){function o(){for(var o,e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return(o=t.call.apply(t,[this].concat(n))||this).availableTerms=null,o.selectedTerms=[],o.searchFilter="",o.activeListIndex=0,o.inputIsFocused=!1,o.saving=!1,o.bypassReqs=!1,o.navigator=void 0,o}a(o,t);var e=o.prototype;return e.oninit=function(o){var e=this;t.prototype.oninit.call(this,o),this.attrs.selectedTerms?this.attrs.selectedTerms.forEach(this.addTerm.bind(this)):this.attrs.resource&&this.attrs.resource.taxonomyTerms().forEach((function(t){t.taxonomy().id()===e.attrs.taxonomy.id()&&e.addTerm(t)})),V(this.attrs.taxonomy).then((function(t){e.availableTerms=t,m.redraw()})),this.navigator=new(P()),this.navigator.onUp((function(){return e.setIndex(e.activeListIndex-1,!0)})).onDown((function(){return e.setIndex(e.activeListIndex+1,!0)})).onSelect(this.select.bind(this)).onRemove((function(){e.selectedTerms.length&&e.toggleTerm(e.selectedTerms[e.selectedTerms.length-1])})).when((function(t){return" "!==t.key||""!==e.searchFilter||(t.preventDefault(),e.select(t),!1)}))},e.indexInSelectedTerms=function(t){return this.selectedTerms.findIndex((function(o){return n=t,(e=o).data.type===n.data.type&&(e.id()&&n.id()?e.id()===n.id():!e.id()==!n.id()&&e.name()===n.name());var e,n}))},e.addTerm=function(t){this.selectedTerms.push(t)},e.removeTerm=function(t){var o=this.indexInSelectedTerms(t);-1!==o&&this.selectedTerms.splice(o,1)},e.className=function(){return"ChooseTaxonomyTermsModal"},e.title=function(){return this.attrs.resource?f().translator.trans("flamarkt-taxonomies.lib.modal.title.edit",{taxonomy:this.attrs.taxonomy.name(),title:m("em",this.attrs.resource.title?this.attrs.resource.title():this.attrs.resource.displayName())}):f().translator.trans("flamarkt-taxonomies.lib.modal.title.new",{taxonomy:this.attrs.taxonomy.name()})},e.getInstruction=function(){if(this.bypassReqs)return"";var t=this.selectedTerms.length;if(this.attrs.taxonomy.minTerms()&&t<this.attrs.taxonomy.minTerms()){var o=this.attrs.taxonomy.minTerms()-t;return f().translator.trans("flamarkt-taxonomies.lib.modal.placeholder",{count:o})}return 0===t?f().translator.trans("flamarkt-taxonomies.lib.modal.placeholderOptional"):""},e.filteredAvailableTerms=function(){var t=null===this.availableTerms?[]:this.availableTerms,o=this.searchFilter.toLowerCase();if(o&&(t=t.filter((function(t){return t.name().substr(0,o.length).toLowerCase()===o})),this.attrs.taxonomy.allowCustomValues()&&!t.some((function(t){return t.name().toLowerCase()===o})))){var e=this.attrs.taxonomy.customValueValidation(),n=null;if("alpha_num"===e)n=/^[a-z0-9]$/i;else if("alpha_dash"===e)n=/^[a-z0-9_-]$/i;else if(0===e.indexOf("/")){var r=e.split("/");3===r.length&&(n=new RegExp(r[1],r[2]))}n&&!n.test(this.searchFilter)||t.push(f().store.createRecord("flamarkt-taxonomy-terms",{attributes:{name:this.searchFilter}}))}return!this.bypassReqs&&this.attrs.taxonomy.maxTerms()&&this.selectedTerms.length>=this.attrs.taxonomy.maxTerms()&&(t=[]),t},e.content=function(){return this.contentItems().toArray()},e.contentItems=function(){var t=this,o=new(L());return o.add("form",this.viewForm(),20),o.add("terms",this.listAvailableTerms(this.filteredAvailableTerms()),10),this.attrs.taxonomy.canBypassTermCounts()&&(this.attrs.taxonomy.minTerms()||this.attrs.taxonomy.maxTerms())&&o.add("bypass",m(".Modal-body.ChooseTaxonomyTermsModal-form-bypass",T().component({state:this.bypassReqs,onchange:function(o){t.bypassReqs=o}},f().translator.trans("flamarkt-taxonomies.lib.modal.bypassTermCounts"))),-10),o},e.viewForm=function(){var t=this.attrs.taxonomy.description();return m(".Modal-body",[t?m("p",t):null,m(".ChooseTaxonomyTermsModal-form",this.formItems().toArray())])},e.formItems=function(){var t=new(L());return t.add("input",m(".ChooseTaxonomyTermsModal-form-input",m(".TermsInput.FormControl",{className:this.inputIsFocused?"focus":""},this.inputItems().toArray())),20),t.add("submit",m(".ChooseTaxonomyTermsModal-form-submit.App-primaryControl",v().component({type:"submit",className:"Button Button--primary",disabled:!this.bypassReqs&&this.attrs.taxonomy.minTerms()&&this.selectedTerms.length<this.attrs.taxonomy.minTerms(),icon:"fas fa-check",loading:this.saving},f().translator.trans("flamarkt-taxonomies.lib.modal.submit"))),10),t},e.inputItems=function(){var t=this,o=new(L());return o.add("selected",this.selectedTerms.map((function(o){return m("span.TermsInput-term",{onclick:function(){t.toggleTerm(o),t.onready()}},R(o))})),20),o.add("control",m("input.FormControl",{placeholder:E()(this.getInstruction()),value:this.searchFilter,oninput:function(o){t.searchFilter=o.target.value,t.activeListIndex=0},onkeydown:this.navigator.navigate.bind(this.navigator),onfocus:this.oninputfocus.bind(this),onblur:this.oninputblur.bind(this)}),10),o},e.oninputfocus=function(){this.inputIsFocused=!0},e.oninputblur=function(){this.inputIsFocused=!1},e.listAvailableTerms=function(t){return m(".Modal-footer",null===this.availableTerms?i().component():m("ul.ChooseTaxonomyTermsModal-list.SelectTermList",{className:t.some((function(t){return t.description()}))?"SelectTermList--with-descriptions":""},t.map(this.listAvailableTerm.bind(this))))},e.listAvailableTerm=function(t,o){var e=this;return m("li.SelectTermListItem",{"data-index":o,className:k()({colored:!!t.color(),selected:-1!==this.indexInSelectedTerms(t),active:this.activeListIndex===o}),style:{color:t.color()},onmouseover:function(){return e.activeListIndex=o},onclick:this.toggleTerm.bind(this,t)},[_(t),m("span.SelectTermListItem-name",t.exists?w()(t.name(),this.searchFilter):f().translator.trans("flamarkt-taxonomies.lib.modal.custom",{value:m("em",t.name())})),t.description()?m("span.SelectTermListItem-description",t.description()):""])},e.toggleTerm=function(t){var o=this;-1!==this.indexInSelectedTerms(t)?this.removeTerm(t):this.addTerm(t),this.searchFilter&&(this.searchFilter="",this.activeListIndex=0),setTimeout((function(){o.onready()}))},e.select=function(t){var o=this.getDomElement(this.activeListIndex);o.length?t.metaKey||t.ctrlKey||o.is(".selected")?this.selectedTerms.length&&this.onsubmit():o[0].dispatchEvent(new Event("click")):this.searchFilter=""},e.getDomElement=function(t){return this.$('.SelectTermListItem[data-index="'+t+'"]')},e.setIndex=function(t,o){var e=this.$(".ChooseTaxonomyTermsModal-list"),n=this.$(".SelectTermListItem").length;t<0?t=n-1:t>=n&&(t=0);var r=this.getDomElement(t);if(this.activeListIndex=t,m.redraw(),o){var a,s,i,l=e.scrollTop()||0,c=(null==(a=e.offset())?void 0:a.top)||0,u=c+(e.outerHeight()||0),f=(null==(s=r.offset())?void 0:s.top)||0,d=f+(r.outerHeight()||0);f<c?i=l-c+f-parseInt(e.css("padding-top"),10):d>u&&(i=l-u+d+parseInt(e.css("padding-bottom"),10)),void 0!==i&&e.stop(!0).animate({scrollTop:i},100)}},e.onsubmit=function(t){t&&t.preventDefault(),this.attrs.resource?this.saveResource():(this.attrs.onsubmit&&this.attrs.onsubmit(this.selectedTerms),f().modal.close())},e.saveResource=function(){this.saving=!0,this.attrs.resource.save({relationships:{taxonomies:[{verbatim:!0,type:"flamarkt-taxonomies",id:this.attrs.taxonomy.id(),relationships:{terms:{data:this.selectedTerms.map(j)}}}]}}).then(this.onsaved.bind(this),this.onerror.bind(this))},e.onsaved=function(){y()&&f().current.matches(y())&&f().current.get("stream").update(),this.saving=!1,m.redraw(),f().modal.close()},e.onerror=function(){this.saving=!1,m.redraw()},o}(p()),$=function(t){function o(){for(var o,e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return(o=t.call.apply(t,[this].concat(n))||this).lastSaveState="neutral",o.dropdownIsFocused=!1,o.onmousedown=void 0,o}a(o,t);var e=o.prototype;return e.oninit=function(o){var e=this;t.prototype.oninit.call(this,o),this.navigator.when((function(t){return" "===t.key&&""===e.searchFilter?(t.preventDefault(),e.select(t),!1):"Tab"!==t.key}))},e.oncreate=function(t){var o=this;this.element=t.dom,this.onmousedown=function(e){var n=t.dom.querySelector(".Dropdown-menu");n&&n.contains(e.target)?o.dropdownIsFocused||(o.dropdownIsFocused=!0,m.redraw()):o.dropdownIsFocused&&(o.dropdownIsFocused=!1,m.redraw())},document.addEventListener("mousedown",this.onmousedown)},e.onbeforeremove=function(){},e.onremove=function(o){t.prototype.onremove.call(this,o),document.removeEventListener("mousedown",this.onmousedown)},e.view=function(){var t=this.attrs.taxonomy.description();return m(".ChooseTaxonomyTermsDropdown",m("form",{onsubmit:function(t){t.preventDefault()}},[m(".ChooseTaxonomyTermsInput",[m(".ChooseTaxonomyTermsModal-form",this.formItems().toArray()),this.listAvailableTerms(this.filteredAvailableTerms())]),t?m("p",t):null]))},e.formItems=function(){var o=t.prototype.formItems.call(this);o.remove("submit");var e=null;return this.saving?e=i().component():"success"===this.lastSaveState?e=c()("fas fa-check"):"error"===this.lastSaveState&&(e=c()("fas fa-times")),o.add("status",m(".ChooseTaxonomyTermsStatus",e)),o},e.listAvailableTerms=function(t){return!this.inputIsFocused&&!this.dropdownIsFocused||0===t.length?null:(o=null===this.availableTerms?i().component():t.map(this.listAvailableTerm.bind(this)),m("ul.Dropdown-menu.ChooseTaxonomyTermsModal-list",o));var o},e.listAvailableTerm=function(o,e){return m("li",t.prototype.listAvailableTerm.call(this,o,e))},e.toggleTerm=function(o){t.prototype.toggleTerm.call(this,o),this.lastSaveState="neutral",this.saveResource()},e.select=function(t){var o=this.getDomElement(this.activeListIndex);o.length?o[0].dispatchEvent(new Event("click")):this.searchFilter=""},e.onsaved=function(){this.lastSaveState="success",t.prototype.onsaved.call(this)},e.onerror=function(){this.lastSaveState="error",t.prototype.onerror.call(this)},o}(z);function H(t){return!1===t&&(t=[]),t.slice(0).sort((function(t,o){var e=t.order()-o.order();return 0!==e?e:t.name()>o.name()?1:t.name()<o.name()?-1:0}))}function K(t){return t.slice(0).sort((function(t,o){var e=t.order()-o.order();return 0!==e?e:t.name()>o.name()?1:t.name()<o.name()?-1:0}))}function G(t,o){void 0===o&&(o={});var e=[],n=N()(o,"discussionLink"),r=N()(o,"userLink"),a=N()(o,"productLink");if(o.className="TaxonomiesLabel "+(o.className||""),t){var s=N()(o,"taxonomy");s||(s=t[0].taxonomy()),s&&(o["data-slug"]=s.slug(),s.showLabel()&&e.push(R(s,{className:"TaxonomyParentLabel"}))),K(t).forEach((function(o){(o||1===t.length)&&e.push(R(o,{discussionLink:n,userLink:r,productLink:a}))}))}else e.push(R());return m("span",o,e)}function W(t,o){void 0===o&&(o={});var e=[];return t.forEach((function(t){var o=t.taxonomy();o&&-1===e.indexOf(o)&&e.push(o)})),H(e).map((function(e){return G(t.filter((function(t){return t.taxonomy()===e})),U({},o))}))}var J=function(t){function o(){for(var o,e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return(o=t.call.apply(t,[this].concat(n))||this).type=q().attribute("type"),o.name=q().attribute("name"),o.slug=q().attribute("slug"),o.description=q().attribute("description"),o.color=q().attribute("color"),o.icon=q().attribute("icon"),o.order=q().attribute("order"),o.showLabel=q().attribute("showLabel"),o.showFilter=q().attribute("showFilter"),o.enableFilter=q().attribute("enableFilter"),o.enableFulltextSearch=q().attribute("enableFulltextSearch"),o.allowCustomValues=q().attribute("allowCustomValues"),o.customValueValidation=q().attribute("customValueValidation"),o.customValueSlugger=q().attribute("customValueSlugger"),o.minTerms=q().attribute("minTerms"),o.maxTerms=q().attribute("maxTerms"),o.createdAt=q().attribute("createdAt",q().transformDate),o.canSearch=q().attribute("canSearch"),o.canBypassTermCounts=q().attribute("canBypassTermCounts"),o.tagIds=q().attribute("tagIds"),o}a(o,t);var e=o.prototype;return e.apiEndpoint=function(){return"/flamarkt/taxonomies"+(this.exists?"/"+this.data.id:"")},e.apiOrderEndpoint=function(){return this.apiEndpoint()+"/terms/order"},e.apiTermsEndpoint=function(){return this.apiEndpoint()+"/terms"},o}(q()),Q={"components/ChooseTaxonomyTermsDropdown":$,"components/ChooseTaxonomyTermsModal":z,"helpers/labelsFromMultipleTaxonomiesList":W,"helpers/taxonomyIcon":_,"helpers/termLabel":R,"helpers/termsLabel":G,"models/Taxonomy":J,"models/Term":B,"utils/retrieveTerms":V,"utils/sortTaxonomies":H,"utils/sortTerms":K,"utils/termToIdentifier":j};const X=flarum.core.compat["common/Component"];var Y=t.n(X),Z=function(t){function o(){return t.apply(this,arguments)||this}return a(o,t),o.prototype.view=function(){var t=this.attrs.product.taxonomyTerms()||[];this.attrs.originalProduct!==this.attrs.product&&(this.attrs.originalProduct.taxonomyTerms()||[]).forEach((function(o){-1===t.indexOf(o)&&t.push(o)}));var o=[];return t.forEach((function(t){var e=t.taxonomy();e&&-1===o.indexOf(e)&&o.push(e)})),m("section.ProductShowSection.ProductShowSection--taxonomies",m(".ProductTaxonomies-list",H(o).map((function(o){return m("dl.ProductTaxonomies-taxonomy",[m("dt",o.name()),m("dd",G(t.filter((function(t){return t.taxonomy()===o})),{productLink:!0}))])}))))},o}(Y());const tt=flarum.core.compat["common/components/Dropdown"];var ot=t.n(tt),et=function(t){function o(){for(var o,e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return(o=t.call.apply(t,[this].concat(n))||this).termsInitialized=!1,o.terms=null,o}a(o,t);var e=o.prototype;return e.oninit=function(o){t.prototype.oninit.call(this,o),this.attrs.activeTermSlug&&this.loadTerms()},e.loadTerms=function(){var t=this;this.termsInitialized||(this.termsInitialized=!0,V(this.attrs.taxonomy).then((function(o){t.terms=o,m.redraw()})))},e.view=function(){var t=this,o=this.terms&&this.terms.find((function(o){return o.slug()===t.attrs.activeTermSlug}));return ot().component({buttonClassName:"Button",label:this.attrs.taxonomy.name()+(o?": "+o.name():""),onshow:function(){t.loadTerms()}},null===this.terms?[i().component()]:this.terms.map((function(o){var e=t.attrs.activeTermSlug===o.slug();return v().component({icon:!e||"fas fa-check",onclick:function(){return t.attrs.onchange(o)},active:e},o.name())})))},o}(Y());const nt=flarum.core.compat["forum/components/UserPage"];var rt=t.n(nt),at=function(t){function o(){return t.apply(this,arguments)||this}a(o,t);var e=o.prototype;return e.oninit=function(o){t.prototype.oninit.call(this,o),this.loadUser(m.route.param("username"))},e.content=function(){var t=this.user.taxonomyTerms();if(!t||!t.length)return null;var o=[];return t.forEach((function(t){var e=t.taxonomy();e&&-1===o.indexOf(e)&&o.push(e)})),H(o).map((function(o){return[m("h2",o.name()),G(t.filter((function(t){return t.taxonomy()===o})),{userLink:!0})]}))},o}(rt());function st(t,o){return void 0===o&&(o=!1),function(e){return e.type()===t&&e.canSearch()&&(e.showFilter()||o)}}var it={"components/ProductTaxonomySection":Z,"components/TaxonomyDropdown":et,"components/UserTaxonomyPage":at,"utils/showsFilterFor":st};const mt=flarum.core.compat["common/extend"],lt=flarum.core.compat["forum/components/DiscussionComposer"];var ct=t.n(lt);function ut(t,o){if(!n().forum.attribute("canUseTaxonomiesOnNewDiscussion"))return!1;if(0===t.tagIds().length)return!0;var e=o.composer.fields.tags;return!!Array.isArray(e)&&e.some((function(o){return-1!==t.tagIds().indexOf(o.id())}))}const ft=flarum.core.compat["forum/utils/DiscussionControls"];var dt=t.n(ft);function pt(t,o){o.attribute("canEditTaxonomies")&&H(n().forum.taxonomies()).forEach((function(e){if("discussions"===e.type()){if(e.tagIds().length){if(!("flarum-tags"in flarum.extensions))return;var r=o.tags();if(!Array.isArray(r))return;if(!r.some((function(t){return-1!==e.tagIds().indexOf(t.id())})))return}t.add("taxonomy-"+e.slug(),v().component({icon:"fas fa-tag",onclick:function(){return n().modal.show(z,{resource:o,taxonomy:e})}},n().translator.trans("flamarkt-taxonomies.forum.discussion.edit",{taxonomy:e.name()})))}}))}const ht=flarum.core.compat["forum/components/IndexPage"];var yt=t.n(ht);const xt=flarum.core.compat["forum/states/DiscussionListState"];var vt=t.n(xt);const gt=flarum.core.compat["forum/states/GlobalSearchState"];var Tt=t.n(gt);const bt=flarum.core.compat["forum/components/DiscussionListItem"];var wt=t.n(bt);const It=flarum.core.compat["forum/components/DiscussionHero"];var kt=t.n(It);const St=((flarum.extensions["flamarkt-core"]||{}).forum||{})["layouts/ProductShowLayout"];var Lt=t.n(St);const Ct=((flarum.extensions["flamarkt-core"]||{}).forum||{})["layouts/ProductIndexLayout"];var Et=t.n(Ct);const Ft=((flarum.extensions["flamarkt-core"]||{}).forum||{})["pages/ProductIndexPage"];var Pt=t.n(Ft);const At=flarum.core.compat["forum/utils/UserControls"];var Ot=t.n(At);const Dt=flarum.core.compat["common/components/LinkButton"];var Nt=t.n(Dt);const Mt=flarum.core.compat["common/models/Discussion"];var qt=t.n(Mt);const Bt=flarum.core.compat["common/models/Forum"];var _t=t.n(Bt);const Rt=flarum.core.compat["common/models/User"];var Ut=t.n(Rt);const jt=((flarum.extensions["flamarkt-core"]||{}).common||{})["models/Product"];var Vt=t.n(jt);n().initializers.add("flamarkt-taxonomies",(function(){var t;"v17development/blog/components/BlogItemSidebar"in flarum.core.compat&&(0,mt.extend)(flarum.core.compat["v17development/blog/components/BlogItemSidebar"].prototype,"items",(function(t){t.setPriority("author",50),t.setPriority("categories",30);var o=this.attrs.article;if(o){var e=o.taxonomyTerms();e&&e.length&&t.add("taxonomies",m(".BlogTaxonomies.BlogSideWidget",[m("h3",n().translator.trans("flamarkt-taxonomies.forum.blog.widget.title")),m(".BlogTaxonomiesContainer",W(e,{discussionLink:!0}))]),29)}})),(0,mt.extend)(ct().prototype,"oninit",(function(){this.composer.fields.taxonomyTerms||(this.composer.fields.taxonomyTerms={})})),(0,mt.extend)(ct().prototype,"headerItems",(function(t){var o=this;H(n().forum.taxonomies()).forEach((function(e){var r=e.id();"discussions"===e.type()&&r&&ut(e,o)&&t.add("taxonomy-"+e.slug(),m("a.DiscussionComposer-changeTaxonomies",{"data-taxonomy-name":e.name(),href:"#",onclick:function(t){t.preventDefault(),n().modal.show(z,{taxonomy:e,selectedTerms:(o.composer.fields.taxonomyTerms[r]||[]).slice(0),onsubmit:function(t){o.composer.fields.taxonomyTerms[e.id()]=t,o.$("textarea").trigger("focus")}})}},o.composer.fields.taxonomyTerms[r]&&o.composer.fields.taxonomyTerms[r].length?G(o.composer.fields.taxonomyTerms[r],{taxonomy:e}):m("span.TaxonomyLabel.untagged",[e.icon()?[c()(e.icon())," "]:null,n().translator.trans("flamarkt-taxonomies.forum.composer.choose",{taxonomy:e.name()})])),9)}))})),(0,mt.override)(ct().prototype,"onsubmit",(function(t){var o=this,e=[];if(H(n().forum.taxonomies()).forEach((function(t){var r=t.id();if("discussions"===t.type()&&r&&ut(t,o)){var a=(o.composer.fields.taxonomyTerms[r]||[]).length;t.minTerms()&&a<t.minTerms()&&e.push((function(e){n().modal.show(z,{taxonomy:t,selectedTags:(o.composer.fields.taxonomyTerms[r]||[]).slice(0),onsubmit:function(t){o.composer.fields.taxonomyTerms[r]=t,e()}})}))}})),e.length){var r=function o(){e.length?new Promise(e.shift()).then((function(){setTimeout((function(){o()}),400)})):t()};n().modal.modal?setTimeout((function(){r()}),400):r()}else t()})),(0,mt.extend)(ct().prototype,"data",(function(t){var o=this;if(this.composer.fields.taxonomyTerms){var e=[];(n().forum.taxonomies()||[]).forEach((function(t){var n=t.id();"discussions"===t.type()&&n&&ut(t,o)&&o.composer.fields.taxonomyTerms[n]&&o.composer.fields.taxonomyTerms[n].length&&e.push({verbatim:!0,type:"flamarkt-taxonomies",id:n,relationships:{terms:{data:o.composer.fields.taxonomyTerms[n].map(j)}}})})),t.relationships=t.relationships||{},t.relationships.taxonomies=e}})),(0,mt.extend)(ct().prototype,"view",(function(t){(this.taxonomiesHeaderItemsCount||0)<5||(t.children||[]).forEach((function(t){t&&t.attrs&&t.attrs.className&&-1!==t.attrs.className.indexOf("ComposerBody ")&&(t.attrs.className+=" ComposerBody--taxonomies-compact")}))})),(0,mt.extend)(dt(),"moderationControls",(function(t,o){pt(t,o)})),"v17development/blog/components/BlogPostController"in flarum.core.compat&&(0,mt.extend)(flarum.core.compat["v17development/blog/components/BlogPostController"].prototype,"manageArticleButtons",(function(t){pt(t,this.attrs.article)})),(t=flarum.extensions["fof-drafts"])&&t.models&&t.models.Draft&&(0,mt.extend)(t.models.Draft.prototype,"loadRelationships",(function(t){var o=this.relationships();o&&o.taxonomies&&o.taxonomies.data.length&&(t.taxonomyTerms={},o.taxonomies.data.forEach((function(o){if(o){var e=n().store.getById("flamarkt-taxonomies",o.id);if(e)if("discussions"===e.type()){if(o.relationships&&o.relationships.terms&&o.relationships.terms.data&&o.relationships.terms.data.length){var r=function(o){var n=e.id();t.taxonomyTerms[n]||(t.taxonomyTerms[n]=[]),t.taxonomyTerms[n].push(o)},a=[];o.relationships.terms.data.forEach((function(t){if(t.id){var o=n().store.getById("flamarkt-taxonomy-terms",t.id);if(!o)return void a.push(t.id);var s=o.taxonomy();if(!s)return void console.warn("[flamarkt-taxonomies + fof/drafts] Taxonomy for Term #"+t.id+" not available");if(s!==e)return void console.warn("[flamarkt-taxonomies + fof/drafts] Invalid Term #"+t.id+"; taxonomy mismatch");r(o)}else t.attributes&&t.attributes.name&&r(n().store.createRecord("flamarkt-taxonomy-terms",{attributes:{name:t.attributes.name}}))})),a.length&&V(e).then((function(t){t.forEach((function(t){var o=a.indexOf(t.id());-1!==o&&(r(t),a.splice(o,1))})),a.forEach((function(t){console.warn("[flamarkt-taxonomies + fof/drafts] Failed to load term #"+t+"; asynchronously: not found")})),m.redraw()}))}}else console.warn("[flamarkt-taxonomies + fof/drafts] Invalid taxonomy #"+o.id);else console.warn("[flamarkt-taxonomies + fof/drafts] Invalid taxonomy #"+o.id)}else console.warn("[flamarkt-taxonomies + fof/drafts] No data for taxonomy in saved relationship")})))})),(0,mt.extend)(yt().prototype,"viewItems",(function(t){var o=this;H(n().store.all("flamarkt-taxonomies")).filter(st("discussions")).forEach((function(e){if(1===e.tagIds().length&&"flarum-tags"in flarum.extensions){var r=o.currentTag();if(!r)return;if(-1===e.tagIds().indexOf(r.id())){var a=r.parent();if(!a)return;if(-1===e.tagIds().indexOf(a.id()))return}}t.add("taxonomy-"+e.slug(),et.component({taxonomy:e,activeTermSlug:n().search.params()[e.slug()],onchange:function(t){var r=n().search.params(),a=r[e.slug()];t.slug()===a?delete r[e.slug()]:r[e.slug()]=t.slug();var s=o.attrs.routeName;m.route.set(n().route(s,r))}}))}))})),(0,mt.extend)(Tt().prototype,"stickyParams",(function(t){H(n().store.all("flamarkt-taxonomies")).filter(st("discussions",!0)).forEach((function(o){t[o.slug()]=m.route.param(o.slug())}))})),(0,mt.extend)(vt().prototype,"requestParams",(function(t){var o=this;t.include.push("taxonomyTerms","taxonomyTerms.taxonomy"),H(n().store.all("flamarkt-taxonomies")).filter(st("discussions",!0)).forEach((function(e){var n=o.params[e.slug()];n&&(t.filter.q?t.filter.q=(t.filter.q||"")+" taxonomy:"+e.slug()+":"+n:(t.filter.taxonomy=t.filter.taxonomy||{},t.filter.taxonomy[e.slug()]=n))}))})),(0,mt.extend)(wt().prototype,"infoItems",(function(t){var o=this.attrs.discussion.taxonomyTerms();o&&o.length&&t.add("taxonomies",W(o),10)})),(0,mt.extend)(kt().prototype,"items",(function(t){var o=this.attrs.discussion.taxonomyTerms();o&&o.length&&t.add("taxonomies",W(o,{discussionLink:!0}),5)})),n().routes.flamarktTaxonomiesUser={path:"/u/:username/taxonomies",component:at},n().route.flamarktTaxonomiesUser=function(t){return n().route("flamarktTaxonomiesUser",{username:t.username()})},Lt()&&(0,mt.extend)(Lt().prototype,"sections",(function(t,o){(o.taxonomyTerms()||[]).length<1&&(this.attrs.product.taxonomyTerms()||[]).length<1||t.add("taxonomies",Z.component({product:o,originalProduct:this.attrs.product}))})),Et()&&Pt()&&((0,mt.extend)(Et().prototype,"filters",(function(t){H(n().store.all("flamarkt-taxonomies")).filter(st("products")).forEach((function(o){t.add("taxonomy-"+o.slug(),et.component({taxonomy:o,activeTermSlug:m.route.param()[o.slug()],onchange:function(t){var e=U({},m.route.param());delete e.key;var r=e[o.slug()];t.slug()===r?delete e[o.slug()]:e[o.slug()]=t.slug();var a=n().current.data.routeName;m.route.set(n().route(a,e))}}))}))})),(0,mt.extend)(Pt().prototype,"initState",(function(t){var o=m.route.param();H(n().store.all("flamarkt-taxonomies")).filter(st("products",!0)).forEach((function(e){var n=o[e.slug()];n&&(t.params.q=(t.params.q||"")+" taxonomy:"+e.slug()+":"+n)}))}))),(0,mt.extend)(Ot(),"userControls",(function(t,o){o.attribute("canEditTaxonomies")&&H(n().forum.taxonomies()).forEach((function(e){"users"===e.type()&&t.add("taxonomy-"+e.slug(),v().component({icon:"fas fa-tag",onclick:function(){return n().modal.show(z,{resource:o,taxonomy:e})}},n().translator.trans("flamarkt-taxonomies.forum.user.edit",{taxonomy:e.name()})))}))})),(0,mt.extend)(rt().prototype,"navItems",(function(t){H(n().forum.taxonomies()).some((function(t){return"users"===t.type()}))&&t.add("taxonomies",Nt().component({href:n().route.flamarktTaxonomiesUser(this.user),icon:"fas fa-tags"},n().translator.trans("flamarkt-taxonomies.forum.user.nav")),120)})),f().store.models["flamarkt-taxonomies"]=J,f().store.models["flamarkt-taxonomy-terms"]=B,_t().prototype.taxonomies=q().hasMany("taxonomies"),qt().prototype.taxonomyTerms=q().hasMany("taxonomyTerms"),Ut().prototype.taxonomyTerms=q().hasMany("taxonomyTerms"),Vt()&&(Vt().prototype.taxonomyTerms=q().hasMany("taxonomyTerms")),function(){if(flarum.extensions["fof-user-directory"]&&flarum.extensions["fof-user-directory"].searchTypes&&flarum.extensions["fof-user-directory"].searchTypes.AbstractType&&flarum.extensions["fof-user-directory"].components&&flarum.extensions["fof-user-directory"].components.SearchField){var t=function(t){function o(){for(var o,e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return(o=t.call.apply(t,[this].concat(n))||this).allTerms=null,o.loadingAllTermsPromise=null,o.loading=!1,o.suggestions=[],o}a(o,t);var e=o.prototype;return e.resourceType=function(){return"flamarkt-taxonomy-terms"},e.search=function(t){var o=this;this.loading=!0,this.loadTerms().then((function(){o.loading=!1,o.suggestions=[],t?(t=t.toLowerCase(),o.allTerms.forEach((function(e){-1!==e.name().toLowerCase().indexOf(t)&&o.suggestions.push(e)})),m.redraw()):m.redraw()}))},e.loadTerms=function(){var t=this;if(this.loadingAllTermsPromise)return this.loadingAllTermsPromise;if(null!==this.allTerms)return Promise.resolve(null);this.allTerms=[];var o=[];return n().store.all("flamarkt-taxonomies").filter(st("users")).forEach((function(e){o.push(V(e).then((function(o){var e;(e=t.allTerms).push.apply(e,o)})))})),this.loadingAllTermsPromise=Promise.all(o),this.loadingAllTermsPromise.then((function(){t.loadingAllTermsPromise=null}))},e.renderKind=function(t){var o=t.taxonomy();return o&&o.name()},e.renderLabel=function(t){return m(".UserDirectorySearchLabel",t.color()?{className:"colored",style:{backgroundColor:t.color()}}:{},[t.icon()?[c()(t.icon())," "]:null,t.name()])},e.applyFilter=function(t,o){t.q=t.q?t.q+" ":"",t.q+="taxonomy:"+o.taxonomy().slug()+":"+o.slug()},e.initializeFromParams=function(t){var o=this;if(!t.q)return Promise.resolve([]);var e=t.q.split(" ").filter((function(t){return 0===t.indexOf("taxonomy:")}));return e.length?this.loadTerms().then((function(){var t=[];return e.forEach((function(e){var n=e.split(":");if(!(n.length<3)){var r=o.allTerms.find((function(t){return t.slug()===n[2]&&t.taxonomy().slug()===n[1]}));r&&t.push(r)}})),t})):Promise.resolve([])},o}(flarum.extensions["fof-user-directory"].searchTypes.AbstractType);(0,mt.extend)(flarum.extensions["fof-user-directory"].components.SearchField.prototype,"filterTypes",(function(o){o.add("flamarkt-taxonomies",new t,15)}))}}()})),n().initializers.add("flamarkt-taxonomies-delayed",(function(){(0,mt.extend)(ct().prototype,"headerItems",(function(t){this.taxonomiesHeaderItemsCount=Object.keys(t.toObject()).length}))}),-500)})(),module.exports=o})();
//# sourceMappingURL=forum.js.map