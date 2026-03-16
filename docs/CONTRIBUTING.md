To contribute to this repository, clone it and work on a branch. Commit often such that your commits are small and easy to review. When you are ready to submit your changes, create a pull request against the main branch with a brief description of changes. 

Make sure you run a git pull every time you begin working! This will ensure that you have the latest version of the codebase, and will help prevent merge conflicts. Also, run git pull before creeating a pull request.

There is a .env.example file in both the frontend and backend folders, which contains the necessary environment variables for the project to be run locally. Copy these folders and rename them to '.env' so that they are not tracked by git and API keys are not publicly posted. In order to obtain some values, you may need to reach out to the polypool team at calpolypool@gmail.com. 

**When you begin working on the project, make sure to run 'npm install' in the root directory. This will install all necessary dependencies for the project.**

Before pushing your changes, run 'npm run format' in the root directory. This will format your code according to the project's coding standards, ensuring consistency across the codebase.

Before pushing your changes, cd into the 'packages/react-frontend' directory and run 'npm run lint' to check code for any linting errors which cause our tests to fail. 
