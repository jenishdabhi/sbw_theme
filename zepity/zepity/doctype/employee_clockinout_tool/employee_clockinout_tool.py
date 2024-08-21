import frappe
from frappe.model.document import Document
from datetime import datetime, timedelta

class EmployeeClockInOutTool(Document):
    @frappe.whitelist()
    def creat_emp_checkin(self):
        if not self.employee_checkin:
            frappe.msgprint("No employee checkin data provided.")
            return

        for entry in self.employee_checkin:
           
            start_datetime = datetime.strptime(f"{entry.date} {entry.start_time}", "%Y-%m-%d %H:%M:%S")
            end_datetime = datetime.strptime(f"{entry.date} {entry.end_time}", "%Y-%m-%d %H:%M:%S")
         
            if end_datetime <= start_datetime:
                end_datetime += timedelta(days=1)  

            emp_in = frappe.get_doc({
                'doctype': 'Employee Checkin',
                'employee': entry.employee,
                'log_type': 'IN',
                'time': start_datetime
            })
            emp_in.insert(ignore_permissions=True)  

            emp_out = frappe.get_doc({
                'doctype': 'Employee Checkin',
                'employee': entry.employee,
                'log_type': 'OUT',
                'time': end_datetime
            })
            emp_out.insert(ignore_permissions=True)

        frappe.msgprint("Employee check-in and check-out records have been successfully created.")
