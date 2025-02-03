Users- (user_id, user_name, user_email, user_roles, user_phoneNumber, {project_id, project_Name, project_description, start_date, end_date, milestone_id, milestone_type, duedate, {task_id, task_name, task_description, status, resource_id, resource_name, resource_type, subtask_id, subtask_name, description, status, comment_id, comment_text, comment_date}}) 



Users - 1 (user_id, user_name, user_email, user_roles, user_phoneNumber)
Users-Project -1 (project_id, project_Name, project_description, start_date, end_date, milestone_id, milestone_type, duedate, user_id*)
Users-Project-Task -1 (task_id, task_name, task_description, status, resource_id, resource_name, resource_type, duedate) 
User-Project-Task






1NF:
User-1 => (user_id(PK), user_name, user_email, user_roles, user_phoneNumber)
User-Project-1 => (project_id(PK), project_name, project_description, start_date, end_date, user_id*)
User-Project-MileStone-1 => (milestone_id(PK), milestone_name, milestone_description, milestone_duedate, user_id*, project_id*)
User-Project-Task-1 => (task_id(PK), task_name, task_description, task_status, user_id*, project_id*)
User-Project-Task-Subtasks-1 => (subtask_id, subtask_name, subtask_description, subtask_status, user_id*, project_id*, task_id*)
User-Project-Task-Comment-1 => (comment_id, comment_text, comment_date, user_id*, project_id*, task_id*)
User-Project-Task-Resource-1 => (resource_id, resource_name, resource_type, user_id*, project_id*, task_id*)

2NF:
User-2 => (user_id(PK), user_name, user_email, user_roles, user_phoneNumber)
User-project-2 => (user_id, project_id) (FK)
Project-2 => (project_id(PK), project_name, project_description, start_date, end_date)
User-Project-MileStone-2 => (milestone_id, user_id, project_id) (FK)
Milestone-2 => (milestone_id (PK), milestone_name, milestone_description, due_date)
User-Project-Task-2 => (user_id, project_id, task_id) (FK)
Task-2 => (task_id(PK), task_name, task_description, start_date, end_date)
User-Project-Task-Subtasks-2 => (subtask_id, user_id, project_id, task_id) (FK)
Subtasks-2 => (subtask_id(PK), subtask_name, subtask_description, subtask_status)
User-Project-Task-Comment-2 => (comment_id, user_id, project_id, task_id) (FK)
Comment-2 => (comment_id, comment_text, comment_date)
User-Project-Task-Resource-2 => (resource_id, user_id, project_id, task_id) (FK)
Resource-2 => (resource_id, resource_name, resource_type)

3NF

User-3 => (user_id, user_name, user_email, user_phoneNumber)
User_Role-3 => (user_id, role_id)
Role-3 => (role_id, role_name)
User-project-3 => (user_id, project_id) (FK)
Project-3 => (project_id(PK), project_name, project_description, start_date, end_date)
User-Project-MileStone-3 => (milestone_id, user_id, project_id) (FK)
Milestone-3 => (milestone_id (PK), milestone_name, milestone_description, due_date)
User-Project-Task-3 => (user_id, project_id, task_id) (FK)
Task-3 => (task_id(PK), task_name, task_description, start_date, end_date)
User-Project-Task-Subtasks-3 => (subtask_id, user_id, project_id, task_id) (FK)
Subtasks-3 => (subtask_id(PK), subtask_name, subtask_description, subtask_status)
User-Project-Task-Comment-3 => (comment_id, user_id, project_id, task_id) (FK)
Comment-3 => (comment_id, comment_text, comment_date)
User-Project-Task-Resource-3 => (resource_id, user_id, project_id, task_id) (FK)
Resource-3 => (resource_id, resource_name, resource_type)

---------------------------------------------------------------------------------------------------------------------------------   

Users- (user_id, user_name, user_email, user_roles, user_phoneNumber,{task_id, task_name, task_description, status, {subtask_id, subtask_name, description, status}, {comment_id, comment_text, comment_date}, {resource_id, resource_name, resource_type}, {project_id, project_Name, project_description, start_date, end_date, {milestone_id, milestone_name, description, duedate}}})

1NF:
User-1 => (user_id(PK), user_name, user_email, user_roles, user_phoneNumber)
User-Task-1 => (task_id, task_name, task_description, task_status, user_id*)
User-Task-Subtask-1 => (subtask_id(PK), subtask_name, subtaskdescription, subtask_status, user_id*, task_id*)
User-Task-Comment-1 => (comment_id(PK), comment_text, comment_date, user_id*, task_id*)
User-Task-Resource-1 => (resource_id(PK), resource_name, resource_type, user_id*, task_id*)
User-Task-Project-1 => (project_id(PK), project_name, project_description, start_date, end_date, user_id*, task_id*)
User-Task-Project-Milestone-1 => (milestone_id(PK), milestone_name, milestone_description, milestone_duedate, user_id*, task_id*, project_id*)

2NF:
User-2 => (user_id(PK), user_name, user_email, user_roles, user_phoneNumber)
Task-2 => (task_id(PK), task_name, task_description, task_status)
User-Task-2 => (user_id, task_id) (FK)
Subtask-2 => (subtask_id(PK), subtask_name, subtask_description, subtask_status)
User-Task-Subtask-2 => (user_id, task_id, subtask_id) (FK)
Comment-2 => (comment_id(PK), comment_text, comment_date)
User-Task-Comment-2 => (user_id, task_id, comment_id) (FK)
Resource-2 => (resource_id(PK), resource_name, resource_type)
User-Task-Resource-2 => (user_id, task_id, resource_id) (FK)
Project-2 => (project_id(PK), project_name, project_description, start_date, end_date)
User-Task-Project-2 => (user_id, task_id, project_id) (FK)
Milestone-2 => (milestone_id(PK), milestone_name, milestone_description, milestone_duedate)
User-Task-Project-Milestone-2 => (user_id, task_id, project_id, milestone_id) (FK)


User-3 => (user_id(PK), user_name, user_email, user_phoneNumber)
Role-3 => (role_id(PK), role_name)
Task-3 => (task_id(PK), task_name, task_description, task_status)
Comment-3 => (comment_id(PK), comment_text, comment_date)
Resource-3 => (resource_id(PK), resource_name, resource_type)
Milestone-3 => (milestone_id(PK), milestone_name, milestone_description, milestone_duedate)
Subtask-3 => (subtask_id(PK), subtask_name, subtask_description, subtask_status)
Project-3 => (project_id(PK), project_name, project_description, start_date, end_date)


User-Task-3 => (user_id, task_id) (FK)
User-Task-Comment-3 => (user_id, task_id, comment_id) (FK)
User-Task-Subtask-3 => (user_id, task_id, subtask_id) (FK)
User-Task-Project-3 => (user_id, task_id, project_id) (FK)
User-Task-Resource-3 => (user_id, task_id, resource_id) (FK)
User-Task-Project-Milestone-3 => (user_id, task_id, project_id, milestone_id) (FK)

User-Role-3 => (user_id, role_id)
