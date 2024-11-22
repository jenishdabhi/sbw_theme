app_name = "zepity"
app_title = "Zepity"
app_publisher = "M Haroon Abbas"
app_description = "Zepity Theme"
app_email = "walkin.logic@gmail.com"
app_license = "mit"


# Includes in <head>
# ------------------
#app_logo_url = "/assets/zepity/images/logo.png"

website_context = {
    "favicon": "/assets/zepity/images/sbw.png",
    "splash_image": "/assets/zepity/images/logo.png",
}

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
app_include_css = ["/assets/zepity/theme.css"]
app_include_js = ["custom_desk.bundle.js","/assets/zepity/theme.js"]

# required_apps = []

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/zepity/css/zepity.css"
# app_include_js = "/assets/zepity/js/zepity.js"

# include js, css files in header of web template
# web_include_css = "/assets/zepity/css/zepity.css"
# web_include_js = "/assets/zepity/js/zepity.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "zepity/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
app_include_icons = "zepity/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "zepity.utils.jinja_methods",
# 	"filters": "zepity.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "zepity.install.before_install"
# after_install = "zepity.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "zepity.uninstall.before_uninstall"
# after_uninstall = "zepity.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "zepity.utils.before_app_install"
# after_app_install = "zepity.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "zepity.utils.before_app_uninstall"
# after_app_uninstall = "zepity.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "zepity.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"zepity.tasks.all"
# 	],
# 	"daily": [
# 		"zepity.tasks.daily"
# 	],
# 	"hourly": [
# 		"zepity.tasks.hourly"
# 	],
# 	"weekly": [
# 		"zepity.tasks.weekly"
# 	],
# 	"monthly": [
# 		"zepity.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "zepity.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "zepity.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "zepity.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["zepity.utils.before_request"]
# after_request = ["zepity.utils.after_request"]

# Job Events
# ----------
# before_job = ["zepity.utils.before_job"]
# after_job = ["zepity.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"zepity.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

# python module path
extend_bootinfo = "zepity.boot_session.boot_session" 