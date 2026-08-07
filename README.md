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

5. After cloning and pullling the latest from the repo, Run this command in your branch:
   `npm install `

6. Now start working on your task, once task code is done, push the code to your own branch"
   `git add .`
   `git commit -m "Your task message"`
   `git add push -u origin <feature/yourname>`

   > By <feature/yourname> I mean the branch you have created already.

---

After this create a PR to development
