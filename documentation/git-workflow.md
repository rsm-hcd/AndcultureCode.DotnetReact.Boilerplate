# Git Workflow

Explanation of the project's BitBucket configuration and Git workflow.

---

## Bitbucket Setup

_User must be added as an Admin for the repository._

-   Branches > Create Branch
    -   Type = Other
    -   From Branch = `master`
    -   Branch Name = `development`
    -   Also create `working` and `staging` branches.
-   Settings > Merge Strategies > Default Merge Strategy = Squash
-   Settings > Branching Model
    -   Development Branch = Use specific branch
    -   Select `development`
    -   Production Branch = User main branch
    -   This should show "Currently set to `master`"
-   Settings > Branching Model
    -   Branch Prefixes
        -   Bugfix: `bugfix/`
        -   Feature: `feature/`
        -   Hotfix: `hotfix/`
-   Settings > Excluded Files (See excluded files template below.)
-   Settings > Branch Permissions
    -   On `development` everyone should have write access and require two PR approvals.
    -   On `working` everyone should have write access.
    -   On `staging` everyone should have write access.
    -   On `master` everyone should have write access.
-   Settings > User and group access
    -   An Gravity Boots user group was created by a BitBucket admin.
    -   They were added to the "Gravity Boots - External" group and given "Read" access to the repo.
-   Settings > Default reviewers
    -   Add the internal developers as default reviewers.
    -   Add the Gravity Boots team members as default reviewers.
-   Settings > Default Description (See pull request template below.)
-   Settings > Chat Notifications > Settings
    -   Add Slack integration by following on screen instructions.
    -   Notification settings include:
        -   Repository-wide: none
        -   `master`: branch merged
        -   `feature/**`: branch created, branch merged
        -   `development`: pull request created, commits pushed
        -   `working`: branch merged
        -   `staging`: branch merged

---

## Branching Strategy

### Branches

-   Feature Branches (Created for each JIRA PBI or sub-task.)
-   `development`
-   `working`
-   `staging`
-   `master` (Production Environment)

### Git Workflow

All development work should be completed from a feature branch. In most cases branches will be created from the `development` branch and merged back into the `development` branch when work is completed. These feature branches should be prefixed with either `feature/` or `bugifx/`. They should also include the JIRA PBI (i.e. GB-46) as part of the branch name. For example `feature/GB-46-source-control--/-create-git-rep`. The easiest way to create these branches with the proper identification and name is from within JIRA and the feature's detail page (i.e. [https://andculture.atlassian.net/browse/GB-46](https://andculture.atlassian.net/browse/GB-46)).

Hotfixes to production are the exception. Hotifx branches should be prefixed with `hotfix/`. The choice of where to branch from will depend on the scenario, but a common scenario is to branch from production and then merge back to staging.

As features and bugfixes are completed a Pull Request should be created with the development branch as the merge destination. All members of the development team should be added as reviewers in addition to designated members of the Gravity Boots team. The developer creating the Pull Request should complete the Pull Request template by answering the questions and ensuring that the checklist has been completed.

Pull Requests are an opportunity to review, discuss, and learn from the code. After at least 2 members of the team have approved the pull request and any outstanding discussion points have been resolved, the pull request may be merged.

The developer should check that the Jenkins build for the project completes successfully on the `development` branch and the they can promote the `development` branch to the `working` branch. The quality assurance (QA) process will be completed on the `working` branch.

Releases will be staged on the `staging` branch for user acceptance testing (UAT). The `master` branch will be reserved for the current production release.

---

## Pull Requests

### Template Instructions

On creating a new pull request, Bitbucket will populate the pull request description with the below template. The template is meant as a tool to ensure that the requester has followed the practices and procedures of the development team. For each pull request, please add a subject and description as noted below in the template and ensure that all of the checklist items have been completed.

When completing the template, provide a short description, including PBI first, for the pull request (50 characters or less please). Below the first line, please explain the what and why of the proposed changes (not the how). The goal is to provide context for the changes, not explain the code. At a minimum, a sentence or two is fine.

Finally, review the checklist and ensure that all steps have been followed. Make sure to review the checklist after making any changes to the code from PR feedback.

After a pull request has been approved, please copy the pull request subject and description, excluding the checklist. Then click on the "Merge" button in Bitbucket. This will open a merge modal with a commit message field. Everything except the pull request approvers should be removed from that field and replaced with the copied pull request description.

### Template

```
[Commit message subject with PBI and short message.  Less than 50 characters.]

[Commit message description.  In at least a sentence or two answer: Why is the change being made? How do things work after the change and why was the problem solved this way?]

-   [] Destination branch has been merged before build and testing
-   [] Code has been formatted and follows coding patterns
-   [] Code builds cleanly (no warnings or errors)
-   [] All tests are passing (dotnet, jest, cypress)
-   [] Changes have been manually tested
-   [] Front-end work is responsive and 508 compliant
-   [] Documentation updated (docs, swagger, storybook, comments, etc.)
-   [] Checklist reviewed after changes and before merging
-   [] Initial design, QA, and product owner review prior to merge

```

### Git Hooks

There is a folder at the root of the repository ([.githooks](.githooks)) to hold git hook scripts specific to this project for tapping into git events such as before or after comitting, pushing, etc. As of writing this, only a `pre-commit` hook exists in order to run the Prettier CLI on any modified files.

In order to configure your local git repository to look at this directory for hooks (as opposed to `.git/hooks/`, where it would normally exist), you can run this command to specify the hooks path:
`git config core.hooksPath .githooks`

See [Two Ways to Share Git Hooks with Your Team](https://www.viget.com/articles/two-ways-to-share-git-hooks-with-your-team/) for reference.

### Excluded Files Template

Add this template to the [Bitbucket Refined](https://github.com/refined-bitbucket/refined-bitbucket) Chrome extension to prevent files that don't need to be reviewed from showing up in the Pull Request diff.

```
# Most specifically for .net data migration files but could include other auto-gen files we don't care about
*.Designer.cs

# Not concerned with the code snapshot of the database in PRs
LmsContextModelSnapshot.cs
```

### References

-   [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
-   [ThoughtBot Code Review Guide](https://github.com/thoughtbot/guides/tree/master/code-review)
-   [RailsConf 2015 - Implementing a Strong Code-Review Culture](https://www.youtube.com/watch?v=PJjmw9TRB7s)
