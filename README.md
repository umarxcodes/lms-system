# Saylani-Bootcamp-LMS4

# Team E - Bootcamp LMS

1. Clone the repo https://github.com/SMIT-Bootcamp/Saylani-Bootcamp-LMS4.git

2. First of all check what branches exist:
   `git branch -a`

   > This will list all branches in the repo

3. Change your branch if you are not in the working branch "development" already, Pull the latest from your main working branch (In our case, it'll be "development")
   `git checkout development`
   `git pull origin development`

4. Change the branch again (⚠️Dont work on "main"!)
   `git checkout -b <feature/yourname>`
   If you want to change to a branch that has already been created run
   `git checkout <feature/yourname>`

5. Merge with development branch:
   `git merge development`

6. After cloning and pullling the latest from the repo, Run this command in your branch:
   `npm install `

7. Now start working on your task, once task code is done, push the code to your own branch"
   `git add .`
   `git commit -m "Your task message"`
   `git add push -u origin <feature/yourname>`

   > By <feature/yourname> I mean the branch you have created already.

---

After this create a PR to development

---

## Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── env.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── error.middleware.js
│   │   └── notFound.middleware.js
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.model.js
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.validation.js
│   │   │
│   │   ├── students/
│   │   │   ├── student.controller.js
│   │   │   ├── student.model.js
│   │   │   ├── student.routes.js
│   │   │   ├── student.service.js
│   │   │   └── student.validation.js
│   │   │
│   │   ├── attendance/
│   │   │   ├── attendance.controller.js
│   │   │   ├── attendance.model.js
│   │   │   ├── attendance.routes.js
│   │   │   ├── attendance.service.js
│   │   │   └── attendance.validation.js
│   │   │
│   │   ├── teams/
│   │   │   ├── team.controller.js
│   │   │   ├── team.model.js
│   │   │   ├── team.routes.js
│   │   │   ├── team.service.js
│   │   │   └── team.validation.js
│   │   │
│   │   ├── projects/
│   │   │   ├── project.controller.js
│   │   │   ├── project.model.js
│   │   │   ├── project.routes.js
│   │   │   ├── project.service.js
│   │   │   └── project.validation.js
│   │   │
│   │   ├── tasks/
│   │   │   ├── task.controller.js
│   │   │   ├── task.model.js
│   │   │   ├── task.routes.js
│   │   │   ├── task.service.js
│   │   │   └── task.validation.js
│   │   │
│   │   └── dashboard/
│   │       ├── dashboard.controller.js
│   │       ├── dashboard.routes.js
│   │       └── dashboard.service.js
│   │
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── password.js
│   │   ├── response.js
│   │   └── logger.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── yarn.lock
```
