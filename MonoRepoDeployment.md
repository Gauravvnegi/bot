# MonoRepo Botshot Development deployment procedure using GitLab Pipeline


**Requirements:**

 - **Variables:**
    ssh_user, ssh-port, work_dir, server_ip, ssh_key

 - **Files:**
        Ensure .gitlab-ci.yml file is available in your desired branch of repo.
    Script File (Restart.sh) in deploy dir.

 - **Runner:**
        - Runner is defined (Single time Administrative Activity per repo):
    Go to Project first, inside settings choose CI / CD, expand runner.
<!-- Identifiers, in alphabetical order -->
[identifier]: https://docs.gitlab.com/12.10/runner/install
```ruby
Note: Variables are essential to run pipeline. 

```
**Add variables:**
  Go to Project first, inside settings choose CI / CD.
  expand variables, add variable. First define Key (Variable Name) then value and most important defaine Environments for your variables.

**Setup & Register Runner:**
         Follow the link to [Setup & register Runner][identifier].

## Deployment Procedure:
- Go to Repository (If Variables are already defined properly) **>** Projects **>** Search your project **i.e. Hospitality Bot**

- Select your branch (i.e. For Development choose developent, For prod choose master branch)
    Here you need to choose Development branch

- Chase CI / CD for pipelines from left pane bar

- Run Pipeline from the top to run with latest commit

- Choose your desired deployment (i.e Deploy to Development-web-user / Deploy to Development-admin) from manual job of specific commit

- Go to jobs to select your job, Once you select your job you will get your running deployment on terminal.
```
Note: You can check your any deployment (failed / success) later as well.
```


# Configuration Files (For Admin Use Only)

cat gitlab-ci.yml

```
stages:
  - deploy

before_script:
  - cp deploy/* .
  - chmod +x *.sh
  - rm -rf deploy
  - ls -l
  - ls | wc -l

deploy to Development-web-user:
  stage: deploy
  environment:
    name: development-web-user
  when: manual

  script:
    - ssh -p "$ssh_port" "$ssh_user"@"$server_ip" "cd $web_user_work_dir; pwd; ls;"
    - scp -r -P$ssh_port * "$ssh_user"@"$server_ip":"$web_user_work_dir"
    - ssh -p "$ssh_port" "$ssh_user"@"$server_ip" "cd $web_user_work_dir; free -h; sh -x web-user_dev.sh"
    - ssh -p "$ssh_port" "$ssh_user"@"$server_ip" "sleep 40; rm -rf $web_user_work_dir/*.sh; ls $web_user_work_dir && netstat -tnlp"
  only:
    - development
    
deploy to Development-admin:
  stage: deploy
  environment:
    name: development-admin
  when: manual

  script:
    - ssh -p "$ssh_port" "$ssh_user"@"$server_ip" "cd $admin_work_dir; pwd; ls"
    - scp -r -P$ssh_port * "$ssh_user"@"$server_ip":"$admin_work_dir"
    - ssh -p "$ssh_port" "$ssh_user"@"$server_ip" "cd $admin_work_dir; free -h; sh -x admin.sh"
    - ssh -p "$ssh_port" "$ssh_user"@"$server_ip" "sleep 40; rm -rf $admin_work_dir/*.sh; ls $admin_work_dir && netstat -tnlp"
  only:
    - development
```

cat web-user_dev.sh
```
#!/bin/bash
npm i && ng run web-user:build --configuration=development
```

cat admin.sh
```
#!/bin/bash
#npm i && ng run admin:build --configuration=development
npm i && ng run admin:build --configuration=production
```