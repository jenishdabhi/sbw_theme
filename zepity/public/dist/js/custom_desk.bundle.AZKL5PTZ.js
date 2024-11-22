(() => {
  // frappe-html:/home/dell/frappeTheme/apps/zepity/zepity/public/js/frappe/ui/page.html
  frappe.templates["page"] = `<div class="page-head flex">
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
</div>`;

  // ../zepity/zepity/public/js/frappe/list/list_filter.js
  frappe.provide("frappe.ui");
  var ListFilter = class {
    constructor({ wrapper, doctype }) {
      Object.assign(this, arguments[0]);
      this.can_add_global = frappe.user.has_role(["System Manager", "Administrator"]);
      this.filters = [];
      this.make();
      this.bind();
      this.refresh();
    }
    make() {
      this.wrapper.html(`
			<li class="input-area"></li>
			<li class="sidebar-action">
				<a class="saved-filters-preview">${__("Show Saved")}</a>
			</li>
			<div class="saved-filters"></div>
		`);
      this.$input_area = this.wrapper.find(".input-area");
      this.$list_filters = this.wrapper.find(".list-filters");
      this.$saved_filters = this.wrapper.find(".saved-filters").hide();
      this.$saved_filters_preview = this.wrapper.find(".saved-filters-preview");
      this.saved_filters_hidden = true;
      this.toggle_saved_filters(true);
      this.filter_input = frappe.ui.form.make_control({
        df: {
          fieldtype: "Data",
          placeholder: __("Filter Name"),
          input_class: "input-xs"
        },
        parent: this.$input_area,
        render_input: 1
      });
      this.is_global_input = frappe.ui.form.make_control({
        df: {
          fieldtype: "Check",
          label: __("Is Global")
        },
        parent: this.$input_area,
        render_input: 1
      });
    }
    bind() {
      this.bind_save_filter();
      this.bind_toggle_saved_filters();
      this.bind_click_filter();
      this.bind_remove_filter();
    }
    refresh() {
      this.get_list_filters().then(() => {
        this.filters.length ? this.$saved_filters_preview.show() : this.$saved_filters_preview.hide();
        const html = this.filters.map((filter) => this.filter_template(filter));
        this.wrapper.find(".filter-pill").remove();
        this.$saved_filters.append(html);
      });
      this.is_global_input.toggle(false);
      this.filter_input.set_description("");
    }
    filter_template(filter) {
      return `<div class="list-link filter-pill list-sidebar-button btn btn-default" data-name="${filter.name}">
			<a class="ellipsis filter-name">${filter.filter_name}</a>
			<a class="remove">${frappe.utils.icon("close")}</a>
		</div>`;
    }
    bind_toggle_saved_filters() {
      this.wrapper.find(".saved-filters-preview").click(() => {
        this.toggle_saved_filters(this.saved_filters_hidden);
      });
    }
    toggle_saved_filters(show) {
      this.$saved_filters.toggle(show);
      const label = show ? __("Hide Saved") : __("Show Saved");
      this.wrapper.find(".saved-filters-preview").text(label);
      this.saved_filters_hidden = !this.saved_filters_hidden;
    }
    bind_click_filter() {
      this.wrapper.on("click", ".filter-pill .filter-name", (e) => {
        let $filter = $(e.currentTarget).parent(".filter-pill");
        this.set_applied_filter($filter);
        const name = $filter.attr("data-name");
        this.list_view.filter_area.clear().then(() => {
          this.list_view.filter_area.add(this.get_filters_values(name));
        });
      });
    }
    bind_remove_filter() {
      this.wrapper.on("click", ".filter-pill .remove", (e) => {
        const $li = $(e.currentTarget).closest(".filter-pill");
        const filter_label = $li.text().trim();
        frappe.confirm(
          __("Are you sure you want to remove the {0} filter?", [filter_label.bold()]),
          () => {
            const name = $li.attr("data-name");
            const applied_filters = this.get_filters_values(name);
            $li.remove();
            this.remove_filter(name).then(() => this.refresh());
            this.list_view.filter_area.remove_filters(applied_filters);
          }
        );
      });
    }
    bind_save_filter() {
      this.filter_input.$input.keydown(
        frappe.utils.debounce((e) => {
          const value = this.filter_input.get_value();
          const has_value = Boolean(value);
          if (e.which === frappe.ui.keyCode["ENTER"]) {
            if (!has_value || this.filter_name_exists(value))
              return;
            this.filter_input.set_value("");
            this.save_filter(value).then(() => this.refresh());
            this.toggle_saved_filters(true);
          } else {
            let help_text = __("Press Enter to save");
            if (this.filter_name_exists(value)) {
              help_text = __("Duplicate Filter Name");
            }
            this.filter_input.set_description(has_value ? help_text : "");
            if (this.can_add_global) {
              this.is_global_input.toggle(has_value);
            }
          }
        }, 300)
      );
    }
    save_filter(filter_name) {
      return frappe.db.insert({
        doctype: "List Filter",
        reference_doctype: this.list_view.doctype,
        filter_name,
        for_user: this.is_global_input.get_value() ? "" : frappe.session.user,
        filters: JSON.stringify(this.get_current_filters())
      });
    }
    remove_filter(name) {
      if (!name)
        return;
      return frappe.db.delete_doc("List Filter", name);
    }
    get_filters_values(name) {
      const filter = this.filters.find((filter2) => filter2.name === name);
      return JSON.parse(filter.filters || "[]");
    }
    get_current_filters() {
      return this.list_view.filter_area.get();
    }
    filter_name_exists(filter_name) {
      return (this.filters || []).find((f) => f.filter_name === filter_name);
    }
    get_list_filters() {
      if (frappe.session.user === "Guest")
        return Promise.resolve();
      return frappe.db.get_list("List Filter", {
        fields: ["name", "filter_name", "for_user", "filters"],
        filters: { reference_doctype: this.list_view.doctype },
        or_filters: [
          ["for_user", "=", frappe.session.user],
          ["for_user", "=", ""]
        ],
        order_by: "filter_name asc"
      }).then((filters) => {
        this.filters = filters || [];
      });
    }
    set_applied_filter($filter) {
      this.$saved_filters.find(".btn-primary-light").toggleClass("btn-primary-light btn-default");
      $filter.toggleClass("btn-default btn-primary-light");
    }
  };

  // ../zepity/zepity/public/js/frappe/list/list_sidebar.js
  frappe.provide("frappe.views");
  frappe.views.ListSidebar = class ListSidebar {
    constructor(opts) {
      $.extend(this, opts);
      this.make();
    }
    make() {
      var sidebar_content = frappe.render_template("list_sidebar", { doctype: this.doctype });
      this.sidebar = $('<div class="list-sidebar overlay-sidebar hidden-xs hidden-sm"></div>').html(sidebar_content).appendTo(this.page.sidebar.empty());
      this.setup_list_filter();
      this.setup_list_group_by();
      $(document).trigger("list_sidebar_setup");
      if (this.list_view.list_view_settings && this.list_view.list_view_settings.disable_sidebar_stats) {
        this.sidebar.find(".list-tags").remove();
      } else {
        this.sidebar.find(".list-stats").on("show.bs.dropdown", (e) => {
          this.reload_stats();
        });
      }
      if (frappe.user.has_role("System Manager")) {
        this.add_insights_banner();
      }
    }
    setup_views() {
      var show_list_link = false;
      if (frappe.views.calendar[this.doctype]) {
        this.sidebar.find('.list-link[data-view="Calendar"]').removeClass("hide");
        this.sidebar.find('.list-link[data-view="Gantt"]').removeClass("hide");
        show_list_link = true;
      }
      this.sidebar.find('.list-link[data-view="Kanban"]').removeClass("hide");
      if (this.doctype === "Communication" && frappe.boot.email_accounts.length) {
        this.sidebar.find('.list-link[data-view="Inbox"]').removeClass("hide");
        show_list_link = true;
      }
      if (frappe.treeview_settings[this.doctype] || frappe.get_meta(this.doctype).is_tree) {
        this.sidebar.find(".tree-link").removeClass("hide");
      }
      this.current_view = "List";
      var route = frappe.get_route();
      if (route.length > 2 && frappe.views.view_modes.includes(route[2])) {
        this.current_view = route[2];
        if (this.current_view === "Kanban") {
          this.kanban_board = route[3];
        } else if (this.current_view === "Inbox") {
          this.email_account = route[3];
        }
      }
      this.sidebar.find('.list-link[data-view="' + this.current_view + '"] a').attr("disabled", "disabled").addClass("disabled");
      this.sidebar.find('.list-link[data-view="Kanban"] a, .list-link[data-view="Inbox"] a').attr("disabled", null).removeClass("disabled");
      if (this.list_view.meta.image_field) {
        this.sidebar.find('.list-link[data-view="Image"]').removeClass("hide");
        show_list_link = true;
      }
      if (this.list_view.settings.get_coords_method || this.list_view.meta.fields.find((i) => i.fieldname === "latitude") && this.list_view.meta.fields.find((i) => i.fieldname === "longitude") || this.list_view.meta.fields.find(
        (i) => i.fieldname === "location" && i.fieldtype == "Geolocation"
      )) {
        this.sidebar.find('.list-link[data-view="Map"]').removeClass("hide");
        show_list_link = true;
      }
      if (show_list_link) {
        this.sidebar.find('.list-link[data-view="List"]').removeClass("hide");
      }
    }
    setup_reports() {
      var me = this;
      var added = [];
      var dropdown = this.page.sidebar.find(".reports-dropdown");
      var divider = false;
      var add_reports = function(reports2) {
        $.each(reports2, function(name, r) {
          if (!r.ref_doctype || r.ref_doctype == me.doctype) {
            var report_type = r.report_type === "Report Builder" ? `List/${r.ref_doctype}/Report` : "query-report";
            var route = r.route || report_type + "/" + (r.title || r.name);
            if (added.indexOf(route) === -1) {
              added.push(route);
              if (!divider) {
                me.get_divider().appendTo(dropdown);
                divider = true;
              }
              $(
                '<li><a href="#' + route + '">' + __(r.title || r.name) + "</a></li>"
              ).appendTo(dropdown);
            }
          }
        });
      };
      if (this.list_view.settings.reports) {
        add_reports(this.list_view.settings.reports);
      }
      var reports = Object.values(frappe.boot.user.all_reports).sort(
        (a, b) => a.title.localeCompare(b.title)
      ) || [];
      add_reports(reports);
    }
    setup_list_filter() {
      this.list_filter = new ListFilter({
        wrapper: this.page.sidebar.find(".list-filters"),
        doctype: this.doctype,
        list_view: this.list_view
      });
    }
    setup_kanban_boards() {
      const $dropdown = this.page.sidebar.find(".kanban-dropdown");
      frappe.views.KanbanView.setup_dropdown_in_sidebar(this.doctype, $dropdown);
    }
    setup_keyboard_shortcuts() {
      this.sidebar.find(".list-link > a, .list-link > .btn-group > a").each((i, el) => {
        frappe.ui.keys.get_shortcut_group(this.page).add($(el));
      });
    }
    setup_list_group_by() {
      this.list_group_by = new frappe.views.ListGroupBy({
        doctype: this.doctype,
        sidebar: this,
        list_view: this.list_view,
        page: this.page
      });
    }
    get_stats() {
      var me = this;
      let dropdown_options = me.sidebar.find(".list-stats-dropdown .stat-result");
      this.set_loading_state(dropdown_options);
      frappe.call({
        method: "frappe.desk.reportview.get_sidebar_stats",
        type: "GET",
        args: {
          stats: me.stats,
          doctype: me.doctype,
          filters: (me.list_view.filter_area ? me.list_view.get_filters_for_args() : me.default_filters) || []
        },
        callback: function(r) {
          let stats = (r.message.stats || {})["_user_tags"] || [];
          me.render_stat(stats);
          let stats_dropdown = me.sidebar.find(".list-stats-dropdown");
          frappe.utils.setup_search(stats_dropdown, ".stat-link", ".stat-label");
        }
      });
    }
    set_loading_state(dropdown) {
      dropdown.html(`<li>
			<div class="empty-state">
				${__("Loading...")}
			</div>
		</li>`);
    }
    render_stat(stats) {
      let args = {
        stats,
        label: __("Tags")
      };
      let tag_list = $(frappe.render_template("list_sidebar_stat", args)).on(
        "click",
        ".stat-link",
        (e) => {
          let fieldname = $(e.currentTarget).attr("data-field");
          let label = $(e.currentTarget).attr("data-label");
          let condition = "like";
          let existing = this.list_view.filter_area.filter_list.get_filter(fieldname);
          if (existing) {
            existing.remove();
          }
          if (label == "No Tags") {
            label = "%,%";
            condition = "not like";
          }
          this.list_view.filter_area.add(this.doctype, fieldname, condition, label);
        }
      );
      this.sidebar.find(".list-stats-dropdown .stat-result").html(tag_list);
    }
    reload_stats() {
      this.sidebar.find(".stat-link").remove();
      this.sidebar.find(".stat-no-records").remove();
      this.get_stats();
    }
    add_insights_banner() {
      try {
        if (this.list_view.view != "Report") {
          return;
        }
        if (localStorage.getItem("show_insights_banner") == "false") {
          return;
        }
        if (this.insights_banner) {
          this.insights_banner.remove();
        }
        const message = __("Get more insights with");
        const link = "https://frappe.io/s/insights";
        const cta = __("Frappe Insights");
        this.insights_banner = $(`
				<div style="position: relative;">
					<div class="pr-3">
						${message} <a href="${link}" target="_blank" style="color: var(--text-color)">${cta} &rarr; </a>
					</div>
					<div style="position: absolute; top: -1px; right: -4px; cursor: pointer;" title="Dismiss"
						onclick="localStorage.setItem('show_insights_banner', 'false') || this.parentElement.remove()">
						<svg class="icon  icon-sm" style="">
							<use class="" href="#icon-close"></use>
						</svg>
					</div>
				</div>
			`).appendTo(this.sidebar);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // frappe-html:/home/dell/frappeTheme/apps/zepity/zepity/public/js/frappe/list/list_sidebar.html
  frappe.templates["list_sidebar"] = `<ul class="list-unstyled sidebar-menu user-actions hide">
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
`;

  // ../zepity/zepity/public/js/frappe/upload.js
  if (frappe.require) {
    frappe.require("file_uploader.bundle.js");
  } else {
    frappe.ready(function() {
      frappe.require("file_uploader.bundle.js");
    });
  }
})();
//# sourceMappingURL=custom_desk.bundle.AZKL5PTZ.js.map
