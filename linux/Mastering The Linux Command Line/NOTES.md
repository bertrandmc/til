### Aliases

`alias commandName="<command>"`
Add the alias to .bashrc or .bash_profile so it is set in every session.


### Create environment variables

`export VARNAME="value"`

type `env` to see all environment variables (cannot see shell-local variables)
type `set` to see all environment variables (can see shell-local variables)

Shell can have variables of two types
 1. *locals*: which are only accessible from the current shell.
 2. *(exported) environment variables*: which are passed on to every executed program.

Since `set` is a built-in shell command, it also sees shell-local variables (including shell functions). `env` on the other hand is an independent executable; it only sees the variables that shell passes to it or environment variables.

When you type a command like `a=1`, then a local variable is created (unless it already existed in the environment). Environment variables are created with `export a=1`.

Example: PS environment variable.
Used to defined what is shown in the command line prompt.
PS1='[\u@\h \W]\$ '


## Commands

### Bash History
`history -c` // clear history


**find**
Search for files in a directory hierarchy.

`find . -name "cron*"`   // find by name  // . = from this directory
`find . -type f -name "cron*"`  //  -type f means only files (not directories)
`find . -type d -name cron*`  //  -type d means only directories (not files)
`find . -perm 777`  // -perm 777 search all files with permission 777

`find . -perm 777 -exec chmod 555 {} \;`
						 // -exec means execute the following command
					   // chmod 555 is the command we want to executed
					   // {} is replaced by the pathname of each file
					   // \; to finish the statement

`find / -mtime -1`   // search all files modified in the last day (+1 for modified before 24 hours)
`find / -a +1`       // last access time 1 day		
`find /  -size 1M`   // search files with size 1MB


**locate**
Locate files by name, the locate command reads the database prepared by `updatedb` instead of actually searching in the disk, by default it does not check if the found file in database still exist (it does require that all parent directories exist if database was build with --require-visibility). Locate does not report files created after the last updatedb execution. FAST compared to search for obvious reasons.


**updatedb**
Update database used by locate command

`updatedb` // command used to update the database used by locate


**cat**
Concatenate files and print to standard output
Display content of files
`cat fileName`
`cat fileName1 fileName2` ...   //concatenate file together


**wc**
Print newline, word, and byte counts for each file.
`wc -l fileName` // count number of lines
`cat fileName | wc -l`  // same as before but piping the result of cat


**split**
Split a file into pieces

`split -l 5 fileName splitFilePrefix`


**diff**
Compare files line by line

`diff fineName1 fileName2`



### Streams
Input and output in Linux is distributed across three streams.
stdin: Standard Input (0)   // 0 is its number
stdout: Standard Output (1) // 1 is its number
stderr: Error output (2)    // 2 is its number

During standard interactions between the user and the terminal, standard input is transmitted through the user's keyboard. Standard output and standard error are displayed on the user's terminal as text. Collectively, the three streams are referred to as the standard streams.



### Redirects
Linux allows us to redirect streams in many ways, for example we can redirect the output of a command to a file or another stream.

Redirect commands are the following:

    `>`  - standard output
    `<`  - standard input
    `2>` - standard error
    Commands with a single bracket overwrite the destination's existing contents

    `>>`  - standard output
    `<<`  - standard input
    `2>>` - standard error
    Commands with a double bracket do not overwrite the destination's existing contents.

`cat file.txt > newFile.txt` => Here we are using `cat` to read the file.txt and redirecting its stdout to the stdin of newFile.txt.

`cat file2.txt >> newFile.txt` => Here we are using `cat` to read the file2.txt and redirecting its stdout to the stdin of newFile.txt (append its content).

`ls /etc > result_of_list_etc.txt` => Here we are using `ls` to list the contents of `/etc` folder, the result of the command, its stdout, is redirected to `result_of_list_etc.txt` file.

To redirect to nowhere we use `> /dev/null`

when we execute a command we usually get two streams, stdout if the command was successful or stderr if there is an error, to redirect stderr we use `2>`. So lets say we are going to cat a file that doesn't exist:

`cat nonexist.txt > file.txt 2> error.txt`

The result of the command above is an empty file.txt and a error.txt file with the error `cat: nonexist.txt: No such file or directory`



### Pipes
Pipes allow us to take the output of one command and pipe it into the input of another.
The Linux pipe is represented by a vertical bar `|`

For example, lets list the content of `/etc` folder and use grep to search for anything related to hosts.

`ls /etc | grep hosts`

The result os ls, which is the content of the folder /etc is piped to the grep command, which then filters the result and return the lines that match the pattern `hosts`.


**Pipes vs Redirects**
The difference between pipes and redirects it that we use Pipe to pass stdout of a command to another command while Redirect is used to pass the stdout of a command to either a file or another stream.

We can mix Pipes and redirects like:
`ls /etc | grep hosts > result.txt`

We can pipe infinitelly:
`ls /etc | grep hosts | wc -l > result.txt`



### Grep (egrep and fgrep)
The grep utility searches any given input files, selecting lines that match one or more patterns. Grep is used for simple patterns and basic regular expressions. **egrep** can handle more extended regular expressions and **fgrep** is quicker than both grep and egrep but can only handle fixed patterns (it does not interprets regex).

`grep <pattern> <filename>`
The above command is same as
`cat <filename> | grep <pattern>`

`grep ^password file.txt` => search lines starting with password
`grep password$ file.txt` => search lines ending with password
`grep ^[abjd] file.txt` => character reference, will match any line that starts with any of the characters listed inside the brackets.

Instead of passing a patter to grep we can also pass a file where the patter is, lets say we have a complex pattern we use very often, we write the patter `^hello` ta file patter.txt and run grep using the file instead of pattern directly.
`grep -f patter.txt file.txtx` => -f flag indicates it is a file which has a pattern in it.


`grep -lr <pattern> <folder>` => Search for files where the name has the specified pattern. (-l: files-with-matches, Only the names of files containing selected lines are written to standard output) (-r:  recursive)

Example with a more complex regular expression with **egrep**:
`egrep '^[a-zA-Z]+$' myfile.txt`

Example with literal search with **fgrep**
`fgrep ^a myfile.txtx` => fgrep wont try to interpret the ^ character as regex, it will search for `^a` literally.  

**fgrep == grep -F**
**egrep == grep -E**


### Cut
Print selected parts of file (s) to standard output

`cut -f<fieldnbr> -d<delimiter> filename`


### Sed editor
Sed is a stream editor, it is used to perform baisc text transformation on an input stream (a file or input from a pipeline). Sed is similar to other editors that permit scripted edits (such as `ed`) but it works by making only one pass over the input(s), consequently being more performant, but sed's ability to filter text in a pipeline is what distinguishes it from other types of editors.

`sed SCRIPT INPUTFILE`
`sed 's/<pattern>/<replace>/' file.txt`
substitute <pattern> with <replace> value from file.txt

`sed 's/pattern_to_substitute/replace_with/w file_to_write_to.txt' file.txt`
substitute <pattern> with <replace> value from file.txt and write (w) to file_to_write_to.

We can use sed for searches only:
`sed '/<search_patter>/w result.txt' file.txt`
search for pattern in file and write result of search in result.txt

We can use range to specify which occurrence of a pattern we want to act on:
`sed '0,/<search_pattern>/s/<search_pattern>/<replace_with>' file.txt`
0, => specifies we want to act on the first occurrence of searched pattern.

We can use regular expressions
`sed 's/<[^>]*>//' index.html` (replace html tags with nothing)


### Tee command
Reads from standard input and write to standard output and files

`ls | tee newfile.txt`

The above command is the same as `ls > newfile.txt `, but we are using the tee command instead. So we piped the result of `ls` to tee's stdin and we wrote the result to a file.

we can write to multiple files
`ls | tee file1 file2 file3`

The default write behavior to a file is `overwrite`, but we can append
`ls | tree -a existingfile`


### Test command
Check file types and compare values. Test command is a beast and man page must be checked for all the options available.
IMPORTANT: The test command return 0 when the test passes, and if it fails it will return a non-true value, this allows us to chain tasks with with command && or ||.
`test -f file && echo 'File exists'`
`test -f file && echo 'File exists' || echo 'File doe not exist'`

`test EXPRESSION`

Test is file index.html exist
`test -f index.html && echo 'File exists'`

Test if file is writable to user
`test -w file`

Test if value is greater than another
`test 5 -gt 2 && echo 'YES'`

Test if a website is responding 200 OK
`curl -sLI google.com | egrep -ci "200 OK" > /dev/null && echo 'Website is responding OK' || echo 'Website is down'`

Email developer in case of error:
`curl -sLI google.com | egrep -ci "200 OK" > /dev/null || mail -s 'Website is down, hurry!' bema@xxxx.xxx`

Add that to a cron job and we have a silly monitoring tool.



### Brackets []
Brackets can be used to evaluate expressions inside it, it output 0 when true or 1 when false
`[ 1 -eq 2 ]`.

`[ 1 -eq 2 ]; echo $?`   // `$?` $? always expands to the status of the most recently executed foreground command or pipeline. Linux commands have several parameters or variables that can be use to find out their exit status.
`[ "string" = "string" ]; echo $?`



### For loop in the command line
```
for name in `ls`
do
echo $name
done;
```

```
for name in `ls`; do test -f $name && echo $name is a file || echo $name is a directory; done;
```
