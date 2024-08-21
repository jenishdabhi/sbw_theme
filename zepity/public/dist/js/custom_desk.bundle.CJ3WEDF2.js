(()=>{frappe.templates.page=`<div class="page-head flex">
    <div class="w-100">
        <div class="row flex align-center page-head-content justify-between">
            <div class="col-md-6 col-sm-6 col-xs-8 page-title page-actions">
                <!-- <div class="title-image hide hidden-md hidden-lg"></div> -->
                <!-- title -->
                <span class="sidebar-toggle-btn">
                    <svg class="icon icon-md sidebar-toggle-placeholder">
                        <use href="#icon-menu"></use>
                    </svg>
                    <span class="sidebar-toggle-icon">
                        <svg class="icon icon-md">
                            <use href="#icon-sidebar-collapse">
                            </use>
                        </svg>
                    </span>
                </span>
                <button class="btn btn-primary btn-sm hide primary-action"></button>
                <div class="actions-btn-group hide">
                    <button type="button" class="btn btn-primary btn-sm" data-toggle="dropdown"
                        aria-expanded="false">
                        <span>
                            <span class="hidden-xs actions-btn-group-label">{%= __("Actions") %}</span>
                            <svg class="icon icon-xs">
                                <use href="#icon-selected">
                                </use>
                            </svg>
                        </span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-right" role="menu">
                    </ul>
                </div>
                <div class="flex fill-width title-area hide">
                    <div>
                        <div class="flex">
                            <h3 class="ellipsis title-text"></h3>
                            <span class="indicator-pill whitespace-nowrap"></span>
                        </div>
                        <div class="ellipsis sub-heading hide text-muted"></div>
                    </div>
                    <button class="btn btn-default more-button hide">
                        <svg class="icon icon-sm">
                            <use href="#icon-dot-horizontal">
                            </use>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="flex col page-actions justify-content-end">
                <!-- buttons -->
                <div class="custom-actions hide hidden-xs hidden-md"></div>
                <div class="standard-actions flex">
                    <span class="page-icon-group hide hidden-xs hidden-sm"></span>
                    <div class="menu-btn-group hide">
                        <button type="button" class="btn btn-default icon-btn" data-toggle="dropdown"
                            aria-expanded="false">
                            <span>
                                <span class="menu-btn-group-label">
                                    <svg class="icon icon-sm">
                                        <use href="#icon-dot-horizontal">
                                        </use>
                                    </svg>
                                </span>
                            </span>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-right" role="menu"></ul>
                    </div>
                    <button class="btn btn-secondary btn-default btn-sm hide"></button> 
                </div>
            </div>
        </div>
    </div>
</div>
<div class="page-body">
    <div class="page-toolbar hide">
        <div class="container">
		
        </div>
    </div>
    <div class="page-wrapper">
        <div class="page-content">
            <div class="workflow-button-area btn-group pull-right hide"></div>
            <div class="clearfix"></div>
        </div>
    </div>
</div>`;frappe.provide("frappe.ui");var o=class{constructor({wrapper:e,doctype:t}){Object.assign(this,arguments[0]),this.can_add_global=frappe.user.has_role(["System Manager","Administrator"]),this.filters=[],this.make(),this.bind(),this.refresh()}make(){this.wrapper.html(`
			<li class="input-area"></li>
			<li class="sidebar-action">
				<a class="saved-filters-preview">${__("Show Saved")}</a>
			</li>
			<div class="saved-filters"></div>
		`),this.$input_area=this.wrapper.find(".input-area"),this.$list_filters=this.wrapper.find(".list-filters"),this.$saved_filters=this.wrapper.find(".saved-filters").hide(),this.$saved_filters_preview=this.wrapper.find(".saved-filters-preview"),this.saved_filters_hidden=!0,this.toggle_saved_filters(!0),this.filter_input=frappe.ui.form.make_control({df:{fieldtype:"Data",placeholder:__("Filter Name"),input_class:"input-xs"},parent:this.$input_area,render_input:1}),this.is_global_input=frappe.ui.form.make_control({df:{fieldtype:"Check",label:__("Is Global")},parent:this.$input_area,render_input:1})}bind(){this.bind_save_filter(),this.bind_toggle_saved_filters(),this.bind_click_filter(),this.bind_remove_filter()}refresh(){this.get_list_filters().then(()=>{this.filters.length?this.$saved_filters_preview.show():this.$saved_filters_preview.hide();let e=this.filters.map(t=>this.filter_template(t));this.wrapper.find(".filter-pill").remove(),this.$saved_filters.append(e)}),this.is_global_input.toggle(!1),this.filter_input.set_description("")}filter_template(e){return`<div class="list-link filter-pill list-sidebar-button btn btn-default" data-name="${e.name}">
			<a class="ellipsis filter-name">${e.filter_name}</a>
			<a class="remove">${frappe.utils.icon("close")}</a>
		</div>`}bind_toggle_saved_filters(){this.wrapper.find(".saved-filters-preview").click(()=>{this.toggle_saved_filters(this.saved_filters_hidden)})}toggle_saved_filters(e){this.$saved_filters.toggle(e);let t=e?__("Hide Saved"):__("Show Saved");this.wrapper.find(".saved-filters-preview").text(t),this.saved_filters_hidden=!this.saved_filters_hidden}bind_click_filter(){this.wrapper.on("click",".filter-pill .filter-name",e=>{let t=$(e.currentTarget).parent(".filter-pill");this.set_applied_filter(t);let i=t.attr("data-name");this.list_view.filter_area.clear().then(()=>{this.list_view.filter_area.add(this.get_filters_values(i))})})}bind_remove_filter(){this.wrapper.on("click",".filter-pill .remove",e=>{let t=$(e.currentTarget).closest(".filter-pill"),i=t.text().trim();frappe.confirm(__("Are you sure you want to remove the {0} filter?",[i.bold()]),()=>{let s=t.attr("data-name"),a=this.get_filters_values(s);t.remove(),this.remove_filter(s).then(()=>this.refresh()),this.list_view.filter_area.remove_filters(a)})})}bind_save_filter(){this.filter_input.$input.keydown(frappe.utils.debounce(e=>{let t=this.filter_input.get_value(),i=Boolean(t);if(e.which===frappe.ui.keyCode.ENTER){if(!i||this.filter_name_exists(t))return;this.filter_input.set_value(""),this.save_filter(t).then(()=>this.refresh()),this.toggle_saved_filters(!0)}else{let s=__("Press Enter to save");this.filter_name_exists(t)&&(s=__("Duplicate Filter Name")),this.filter_input.set_description(i?s:""),this.can_add_global&&this.is_global_input.toggle(i)}},300))}save_filter(e){return frappe.db.insert({doctype:"List Filter",reference_doctype:this.list_view.doctype,filter_name:e,for_user:this.is_global_input.get_value()?"":frappe.session.user,filters:JSON.stringify(this.get_current_filters())})}remove_filter(e){if(!!e)return frappe.db.delete_doc("List Filter",e)}get_filters_values(e){let t=this.filters.find(i=>i.name===e);return JSON.parse(t.filters||"[]")}get_current_filters(){return this.list_view.filter_area.get()}filter_name_exists(e){return(this.filters||[]).find(t=>t.filter_name===e)}get_list_filters(){return frappe.session.user==="Guest"?Promise.resolve():frappe.db.get_list("List Filter",{fields:["name","filter_name","for_user","filters"],filters:{reference_doctype:this.list_view.doctype},or_filters:[["for_user","=",frappe.session.user],["for_user","=",""]],order_by:"filter_name asc"}).then(e=>{this.filters=e||[]})}set_applied_filter(e){this.$saved_filters.find(".btn-primary-light").toggleClass("btn-primary-light btn-default"),e.toggleClass("btn-default btn-primary-light")}};frappe.provide("frappe.views");frappe.views.ListSidebar=class{constructor(e){$.extend(this,e),this.make()}make(){var e=frappe.render_template("list_sidebar",{doctype:this.doctype});this.sidebar=$('<div class="list-sidebar overlay-sidebar hidden-xs hidden-sm"></div>').html(e).appendTo(this.page.sidebar.empty()),this.setup_list_filter(),this.setup_list_group_by(),$(document).trigger("list_sidebar_setup"),this.list_view.list_view_settings&&this.list_view.list_view_settings.disable_sidebar_stats?this.sidebar.find(".list-tags").remove():this.sidebar.find(".list-stats").on("show.bs.dropdown",t=>{this.reload_stats()}),frappe.user.has_role("System Manager")&&this.add_insights_banner()}setup_views(){var e=!1;frappe.views.calendar[this.doctype]&&(this.sidebar.find('.list-link[data-view="Calendar"]').removeClass("hide"),this.sidebar.find('.list-link[data-view="Gantt"]').removeClass("hide"),e=!0),this.sidebar.find('.list-link[data-view="Kanban"]').removeClass("hide"),this.doctype==="Communication"&&frappe.boot.email_accounts.length&&(this.sidebar.find('.list-link[data-view="Inbox"]').removeClass("hide"),e=!0),(frappe.treeview_settings[this.doctype]||frappe.get_meta(this.doctype).is_tree)&&this.sidebar.find(".tree-link").removeClass("hide"),this.current_view="List";var t=frappe.get_route();t.length>2&&frappe.views.view_modes.includes(t[2])&&(this.current_view=t[2],this.current_view==="Kanban"?this.kanban_board=t[3]:this.current_view==="Inbox"&&(this.email_account=t[3])),this.sidebar.find('.list-link[data-view="'+this.current_view+'"] a').attr("disabled","disabled").addClass("disabled"),this.sidebar.find('.list-link[data-view="Kanban"] a, .list-link[data-view="Inbox"] a').attr("disabled",null).removeClass("disabled"),this.list_view.meta.image_field&&(this.sidebar.find('.list-link[data-view="Image"]').removeClass("hide"),e=!0),(this.list_view.settings.get_coords_method||this.list_view.meta.fields.find(i=>i.fieldname==="latitude")&&this.list_view.meta.fields.find(i=>i.fieldname==="longitude")||this.list_view.meta.fields.find(i=>i.fieldname==="location"&&i.fieldtype=="Geolocation"))&&(this.sidebar.find('.list-link[data-view="Map"]').removeClass("hide"),e=!0),e&&this.sidebar.find('.list-link[data-view="List"]').removeClass("hide")}setup_reports(){var e=this,t=[],i=this.page.sidebar.find(".reports-dropdown"),s=!1,a=function(l){$.each(l,function(d,r){if(!r.ref_doctype||r.ref_doctype==e.doctype){var f=r.report_type==="Report Builder"?`List/${r.ref_doctype}/Report`:"query-report",p=r.route||f+"/"+(r.title||r.name);t.indexOf(p)===-1&&(t.push(p),s||(e.get_divider().appendTo(i),s=!0),$('<li><a href="#'+p+'">'+__(r.title||r.name)+"</a></li>").appendTo(i))}})};this.list_view.settings.reports&&a(this.list_view.settings.reports);var n=Object.values(frappe.boot.user.all_reports).sort((l,d)=>l.title.localeCompare(d.title))||[];a(n)}setup_list_filter(){this.list_filter=new o({wrapper:this.page.sidebar.find(".list-filters"),doctype:this.doctype,list_view:this.list_view})}setup_kanban_boards(){let e=this.page.sidebar.find(".kanban-dropdown");frappe.views.KanbanView.setup_dropdown_in_sidebar(this.doctype,e)}setup_keyboard_shortcuts(){this.sidebar.find(".list-link > a, .list-link > .btn-group > a").each((e,t)=>{frappe.ui.keys.get_shortcut_group(this.page).add($(t))})}setup_list_group_by(){this.list_group_by=new frappe.views.ListGroupBy({doctype:this.doctype,sidebar:this,list_view:this.list_view,page:this.page})}get_stats(){var e=this;let t=e.sidebar.find(".list-stats-dropdown .stat-result");this.set_loading_state(t),frappe.call({method:"frappe.desk.reportview.get_sidebar_stats",type:"GET",args:{stats:e.stats,doctype:e.doctype,filters:(e.list_view.filter_area?e.list_view.get_filters_for_args():e.default_filters)||[]},callback:function(i){let s=(i.message.stats||{})._user_tags||[];e.render_stat(s);let a=e.sidebar.find(".list-stats-dropdown");frappe.utils.setup_search(a,".stat-link",".stat-label")}})}set_loading_state(e){e.html(`<li>
			<div class="empty-state">
				${__("Loading...")}
			</div>
		</li>`)}render_stat(e){let t={stats:e,label:__("Tags")},i=$(frappe.render_template("list_sidebar_stat",t)).on("click",".stat-link",s=>{let a=$(s.currentTarget).attr("data-field"),n=$(s.currentTarget).attr("data-label"),l="like",d=this.list_view.filter_area.filter_list.get_filter(a);d&&d.remove(),n=="No Tags"&&(n="%,%",l="not like"),this.list_view.filter_area.add(this.doctype,a,l,n)});this.sidebar.find(".list-stats-dropdown .stat-result").html(i)}reload_stats(){this.sidebar.find(".stat-link").remove(),this.sidebar.find(".stat-no-records").remove(),this.get_stats()}add_insights_banner(){try{if(this.list_view.view!="Report"||localStorage.getItem("show_insights_banner")=="false")return;this.insights_banner&&this.insights_banner.remove();let e=__("Get more insights with"),t="https://frappe.io/s/insights",i=__("Frappe Insights");this.insights_banner=$(`
				<div style="position: relative;">
					<div class="pr-3">
						${e} <a href="${t}" target="_blank" style="color: var(--text-color)">${i} &rarr; </a>
					</div>
					<div style="position: absolute; top: -1px; right: -4px; cursor: pointer;" title="Dismiss"
						onclick="localStorage.setItem('show_insights_banner', 'false') || this.parentElement.remove()">
						<svg class="icon  icon-sm" style="">
							<use class="" href="#icon-close"></use>
						</svg>
					</div>
				</div>
			`).appendTo(this.sidebar)}catch(e){console.error(e)}}};frappe.templates.list_sidebar=`<ul class="list-unstyled sidebar-menu user-actions hide">
	<li class="divider"></li>
</ul>
<ul class="list-unstyled sidebar-menu">
	<div class="sidebar-section views-section hide">
		<li class="sidebar-label">
		</li>
		<div class="current-view">
			<li class="list-link">
				<a class="btn btn-default btn-sm list-sidebar-button"
					data-toggle="dropdown"
					aria-haspopup="true"
					aria-expanded="false"
					href="#"
				>
					<span class="selected-view ellipsis"> 
					</span>
					<span>
						<svg class="icon icon-xs">
							<use href="#icon-selected"></use>
						</svg>
					</span>
				</a>
				<ul class="dropdown-menu views-dropdown" role="menu">
				</ul>
			</li>
			<li class="sidebar-action">
				<a class="view-action"></a>
			</li>
		</div>
	</div>

	<div class="sidebar-section filter-section">
		<li class="sidebar-label">
			{{ __("Filtered By") }}
		</li>

		<div class="list-group-by">
		</div>

		<div class="list-tags">
			<li class="list-stats list-link">
				<a
					class="btn btn-default btn-sm list-sidebar-button"
					data-toggle="dropdown"
					aria-haspopup="true"
					aria-expanded="false"
					href="#"
				>
					<span>{{ __("Tags") }}</span>
					<span>
						<svg class="icon icon-xs">
							<use href="#icon-selected"></use>
						</svg>
					</span>
				</a>
				<ul class="dropdown-menu list-stats-dropdown" role="menu">
					<div class="dropdown-search">
						<input type="text" placeholder={{__("Search") }} data-element="search" class="form-control input-xs">
					</div>
					<div class="stat-result">
					</div>
				</ul>
			</li>
			<li class="sidebar-action show-tags">
				<a class="list-tag-preview">{{ __("Show Tags") }}</a>
			</li>
		</div>
	</div>

	<div class="sidebar-section save-filter-section">
		<li class="sidebar-label">
			{{ __("Save Filter") }}
		</li>
		<li class="list-filters list-link"></li>
</ul>
`;frappe.require?frappe.require("file_uploader.bundle.js"):frappe.ready(function(){frappe.require("file_uploader.bundle.js")});})();
//# sourceMappingURL=custom_desk.bundle.CJ3WEDF2.js.map
