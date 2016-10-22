# GIT Basics

*Initialisation*: Creating an empty repo for use.
*Clone*: Making a local copy on your workstation.
*Checking Out*: Locking a copy of one or more files for exclusive use.
*Branching*: Allowing a set of files to be developed concurrent and at different speeds for different reasons.
*Merging*: Taking different branches or sets of changes and integrating into one set or branch.
*Resolving*: Taking conflicts changes from multiple people on the same file and manually addressing .
*Commit*: Taking changes from the local system and committing them to the branch.
*Push/Pull*: Taking changes locally or remotely and merging into one or more branches.


// global configuration
`git config --global user.name "Bema"`
`git config --global user.email "bema@localhost"`

// list global configuration
`git config —list  `

###There are 3 types of git configuration files:
*System level*: Applies to the entire system (client or server) (gitconfig inside /etc/)
*Global level*: Applies to client globally (.gitconfig in users root directory)
*Local level*: Applies to client locally to project. (.gitconfig inside project dir)

`Local -> overwrites Global -> overwrites System`

To add configuration to system or global:
`git config —system …`
`git config —global …`


Git config anatomy:
	`git config <level> <section_name>.<variable_name> "<value>"`

	eg.:
		`git config --system system.name "Git Repo Server 1"`


### Excluding files with .gitignore
Create a .gitignore_global in user root folder and list files and folders
then
	git config —global core.excludesfile ~/.gitignore_global



### Clone repositories
`git clone <repo_to_clone> <to_folder_name>`
`git checkout <remote_repo>`


### TAGS

Git has the ability to tag specific points in history as being important. Typically people use this functionality to mark release points (v1.0, and so on). Tags shouldn’t be confused confused with Branches.

The difference between a Tag and a Branch is that the tag is created at a point of a specific commit and won’t change with future changes while branches keep changing.

// List all tags
`git tag`

*Types of Tags*
Git uses two main types of tags: *lightweight* and *annotated*

  *Lightweight*: is very much like a branch that doesn’t change - It is just a pointer to a specific commit.

  // Tag lightweight as v1.0
  `git tag v1.0.0`

  *Annotated*: Are stored as full objects in the Git database. They are checksummed; contain the tagger name, email and date; have a tagging message; and can be signed and verified with GNU Privacy Guard (GPG). It is generally recommended that you create annotated tags so you can have all this information; but if you want a temporary tag or for some reason don’t want to keep the other information, lightweight tags are available.

  // Tag annotated as v1.0.0
  `git tag -a v1.0.0 -m "Version 1.0.0"`

    -a: specify annotated
    -m: specifies the message (if you don’t specify -m Git opens an editor so you can type))


  // Displays information about a specific tag
  `git show v1.0`


  // You can tag commits after you have moved past them,   
  `git tag -a v1.0 <commit_checksum(or part of it)>`


  By default git push command doesn’t transfer tags to remote servers. You will have to explicitly push tags to a shared server after creating them.
  `git push origin [tagname]`
  `git push origin —tags (will push all tags)`


  *Checking out Tags*

  You can’t really check out a tag in Git, since they can’t be moved around. If you want to put a version of your repository in your working directory that looks like a specific tag, you can create a new branch at a specific tag with:
  `git checkout -b [branch_name] [tagname]`



### Branches

Branching means you diverge from the main line of development and continue to do work without messing with that main line.
Git doesn’t sore data as a series of change sets or differences, but instead as a series of snapshots.
When you make a commit, Git stores a commit object that contains a pointer to the snapshot of the content you staged. This object also contains the authors name and email, the message, and pointers to the commit or commits that directly came before this commit (its parent or parents): zero parents for the initial commit, one parent for a normal commit, and multiple parents for a commit that results from a merge of two or more branches.

To visualize this, let’s assume that you have a directory containing three files, and you stage them all and commit. Staging the files checksums each one (the SHA-1 hash), stores that version of the file in the Git repository (blobs), and adds that checksum to the staging area.

`git add file1 file2 file3`
`git commit -m "First Commit"`

When you create the commit by running `git commit`, Git checksums each subdirectory (in this case, just the root project directory) and stores those tree objects in the Git repository. Git then creates a commit object that has the metadata and a pointer to the root project tree so it can re-create that snapshot when needed.

Your git repository now contains the following objects:
  1. one blob for the contents of each of your three files.
  2. one tree that lists the contents of the directory and specifies which file names are stored as which blobs
  3. one commit with the pointer to that root tree and all the commit metadata.


*To create a new branch*
`git checkout -b <branch_name>`

*Switch branches*
`git checkout <branch_name>`

*List branches*
`git branch -a`



### Merging

Merge changes from different branches to specific branch.
To merge, inside the branch where you want the changes, lets say master:
`git merge <branchname> —no-ff`     // no-ff means keep commit messages from other branch


### Git Log
Shows git commits history.

`git log -p -2`

   -p: show difference introduced in each commit
   -2: limits the length of each difference
   —stat: Displays more information about changes
   —pretty=oneline
   —pretty=format:”%h %an, %ae, %cn, %cd, - %s”
         %h = hash
	%an = author name
 	%ae = Authors email
	%cn = Committer name
	%cd = Commit date
	%s = Commit Subject
   —graph = display changes graphic
