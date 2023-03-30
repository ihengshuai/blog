---
title: Gitlab流水线配置
description: 带你理解gitlab流水线的概念，熟练掌握流水线的常用技巧
keywords: gitlab流水线,流水线,CI/CD,自动化构建
logo: https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/icon-gitlab.png
---

# Gitlab流水线配置

流水线的流程是，提交代码后，gitlab会检测项目根目录里的`.github-ci.yml`文件，根据文件中的流水线自动构建，配置文件格式正确性可以在gitlab进行文件校验，格式使用yaml文件格式，一个yaml文件就是一个流水线，里面会定义多个作业

## 示例

```yaml
stages:
 - install
 - build
 - deploy
 
install_job:
 stage: install
 tags:
 - docker
 script:
 - echo install stage

build_job:
 stage: build
 script:
 - echo build stage
 
deploy_job:
 stage: deploy
 script:
 - echo deploy stage
```

## 默认变量

gitlab会提供一些默认变量使用，这里列出默认变量

https://docs.gitlab.com/ee/ci/variables/predefined_variables.html

### 通用变量

| 变量                                            | GitLab | Runner | 描述                                                         |
| :---------------------------------------------- | :----- | :----- | :----------------------------------------------------------- |
| `CHAT_CHANNEL`                                  | 10.6   | all    | 触发 ChatOps 命令的源聊天频道。                              |
| `CHAT_INPUT`                                    | 10.6   | all    | 使用 ChatOps 命令传递的附加参数。                            |
| `CHAT_USER_ID`                                  | 14.4   | all    | 触发 ChatOps 命令的用户的聊天服务用户 ID。                   |
| `CI`                                            | all    | 0.4    | 适用于在 CI/CD 中执行的所有作业。可用时为 `true`。           |
| `CI_API_V4_URL`                                 | 11.7   | all    | GitLab API v4 根 URL。                                       |
| `CI_BUILDS_DIR`                                 | all    | 11.10  | 执行构建的顶级目录。                                         |
| `CI_COMMIT_AUTHOR`                              | 13.11  | all    | `Name <email>` 格式的提交作者。                              |
| `CI_COMMIT_BEFORE_SHA`                          | 11.2   | all    | 出现在分支或标签上的上一个最新提交。在合并请求的流水线中总是 `0000000000000000000000000000000000000000`。 |
| `CI_COMMIT_BRANCH`                              | 12.6   | 0.5    | 提交分支名称。在分支流水线中可用，包括默认分支的流水线。在合并请求流水线或标签流水线中不可用。 |
| `CI_COMMIT_DESCRIPTION`                         | 10.8   | all    | 提交的描述。如果标题短于 100 个字符，则消息没有第一行。      |
| `CI_COMMIT_MESSAGE`                             | 10.8   | all    | 完整的提交消息。                                             |
| `CI_COMMIT_REF_NAME`                            | 9.0    | all    | 为其构建项目的分支或标签名称。                               |
| `CI_COMMIT_REF_PROTECTED`                       | 11.11  | all    | 如果作业正在运行以获取受保护的 ref 为 `true` 。              |
| `CI_COMMIT_REF_SLUG`                            | 9.0    | all    | `CI_COMMIT_REF_NAME` 小写，缩短为 63 字节，除了 `0-9` 和 `a-z` 之外的所有内容都替换为 `-`。没有前导/尾随`-`。 在 URL、主机名和域名中使用。 |
| `CI_COMMIT_SHA`                                 | 9.0    | all    | 项目为其构建的提交修订。                                     |
| `CI_COMMIT_SHORT_SHA`                           | 11.7   | all    | `CI_COMMIT_SHA` 的前八个字符。                               |
| `CI_COMMIT_TAG`                                 | 9.0    | 0.5    | 提交标签名称。仅在标签流水线中可用。                         |
| `CI_COMMIT_TAG_MESSAGE`                         | 15.5   | all    | 提交标签消息。仅在标签流水线中可用。                         |
| `CI_COMMIT_TIMESTAMP`                           | 13.4   | all    | ISO 8601 格式的提交时间戳。                                  |
| `CI_COMMIT_TITLE`                               | 10.8   | all    | 提交的标题。消息的完整第一行。                               |
| `CI_CONCURRENT_ID`                              | all    | 11.10  | 单个 executor 中构建执行的唯一 ID。                          |
| `CI_CONCURRENT_PROJECT_ID`                      | all    | 11.10  | 单个 executor 和项目中构建执行的唯一 ID。                    |
| `CI_CONFIG_PATH`                                | 9.4    | 0.5    | CI/CD 配置文件的路径。默认为`.gitlab-ci.yml`。在正在运行的流水线中只读。 |
| `CI_DEBUG_TRACE`                                | all    | 1.7    | 如果 [debug 日志 (跟踪)](https://docs.gitlab.cn/jh/ci/variables/index.html#debug-日志) 已启用为`true`。 |
| `CI_DEBUG_SERVICES`                             | 15.7   | 15.7   | `true` 如果启用了[服务容器日志](https://docs.gitlab.cn/jh/ci/services/index.html#capturing-service-container-logs)，值为 `true`。 |
| `CI_DEFAULT_BRANCH`                             | 12.4   | all    | 项目默认分支的名称。                                         |
| `CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX`        | 13.7   | all    | 通过 Dependency Proxy 拉取镜像的顶级群组镜像前缀。           |
| `CI_DEPENDENCY_PROXY_DIRECT_GROUP_IMAGE_PREFIX` | 14.3   | all    | 通过 Dependency Proxy 拉取镜像的直接群组镜像前缀。           |
| `CI_DEPENDENCY_PROXY_PASSWORD`                  | 13.7   | all    | 通过 Dependency Proxy 拉取镜像的密码。                       |
| `CI_DEPENDENCY_PROXY_SERVER`                    | 13.7   | all    | 用于登录 Dependency Proxy 的服务器。相当于 `$CI_SERVER_HOST:$CI_SERVER_PORT`。 |
| `CI_DEPENDENCY_PROXY_USER`                      | 13.7   | all    | 通过 Dependency Proxy 拉取镜像的用户名。                     |
| `CI_DEPLOY_FREEZE`                              | 13.2   | all    | 仅当流水线在部署冻结窗口期间运行时才可用。可用时为 `true` 。 |
| `CI_DEPLOY_PASSWORD`                            | 10.8   | all    | GitLab Deploy Token 的认证密码，如果项目有的话。             |
| `CI_DEPLOY_USER`                                | 10.8   | all    | GitLab Deploy Token 的认证用户名，如果项目有的话。           |
| `CI_DISPOSABLE_ENVIRONMENT`                     | all    | 10.1   | 仅当作业在一次性环境中执行时才可用（仅为该作业创建并在执行后处理/销毁 - 除 `shell` 和 `ssh` 之外的所有 executor）。可用时为 `true`。 |
| `CI_ENVIRONMENT_NAME`                           | 8.15   | all    | 此作业的环境名称。 如果设置了 [`environment:name`](https://docs.gitlab.cn/jh/ci/yaml/index.html#environmentname)，则可用。 |
| `CI_ENVIRONMENT_SLUG`                           | 8.15   | all    | 环境名称的简化版本，适合包含在 DNS、URL、Kubernetes labels 等。如果设置了 [`environment:name`](https://docs.gitlab.cn/jh/ci/yaml/index.html#environmentname)，则可用。Slug 被截断为 24 个字符。 |
| `CI_ENVIRONMENT_URL`                            | 9.3    | all    | 此作业的环境 URL。如果设置了 [`environment:url`](https://docs.gitlab.cn/jh/ci/yaml/index.html#environmenturl)，则可用。 |
| `CI_ENVIRONMENT_ACTION`                         | 13.11  | all    | 为此作业的环境指定的操作注释。如果设置了 [`environment:action`](https://docs.gitlab.cn/jh/ci/yaml/index.html#environmentaction)，则可用。可以是`start`、`prepare` 或 `stop`。 |
| `CI_ENVIRONMENT_TIER`                           | 14.0   | all    | 此作业的环境部署级别。                                       |
| `CI_RELEASE_DESCRIPTION`                        | 15.5   | all    | 发布的描述。仅在标签流水线上可用。描述长度限制为前 1024 个字符。 |
| `CI_GITLAB_FIPS_MODE`                           | 14.10  | all    | 实例中是否启用 FIPS 模式的配置设置。                         |
| `CI_HAS_OPEN_REQUIREMENTS`                      | 13.1   | all    | 仅当流水线的项目具有打开的[需求](https://docs.gitlab.cn/jh/user/project/requirements/index.html) 时才可用。可用时为 `true`。 |
| `CI_JOB_ID`                                     | 9.0    | all    | 作业的内部 ID，在 GitLab 实例中的所有作业中是唯一的。        |
| `CI_JOB_IMAGE`                                  | 12.9   | 12.9   | 运行作业的 Docker 镜像的名称。                               |
| `CI_JOB_JWT`                                    | 12.10  | all    | 一个 RS256 JSON Web 令牌，用于与支持 JWT 身份验证的第三方系统进行身份验证，例如 [HashiCorp’s Vault](https://docs.gitlab.cn/jh/ci/secrets/index.html)。 |
| `CI_JOB_JWT_V1`                                 | 14.6   | all    | 与 `CI_JOB_JWT` 相同的值。                                   |
| `CI_JOB_MANUAL`                                 | 8.12   | all    | 如果作业是手动启动为 `true`。                                |
| `CI_JOB_NAME`                                   | 9.0    | 0.5    | 作业名称                                                     |
| `CI_JOB_NAME_SLUG`                              | 15.4   | all    | `CI_JOB_NAME_SLUG` 的小写，缩短为 63 字节，除 `0-9` 和 `a-z` 以外的所有内容都替换为 `-`。没有前导/尾随的 `-`。在路径中使用。 |
| `CI_JOB_STAGE`                                  | 9.0    | 0.5    | 作业阶段名称                                                 |
| `CI_JOB_STATUS`                                 | all    | 13.5   | 执行每个 runner 阶段时的作业状态。与 [`after_script`](https://docs.gitlab.cn/jh/ci/yaml/index.html#after_script) 一起使用。可以是 `success`，`failed` 或 `canceled`。 |
| `CI_JOB_TOKEN`                                  | 9.0    | 1.2    | 使用某些 API 端点进行身份验证的令牌。只要作业正在运行，令牌就有效。 |
| `CI_JOB_URL`                                    | 11.1   | 0.5    | 作业详细信息 URL。                                           |
| `CI_JOB_STARTED_AT`                             | 13.10  | all    | 作业开始时的 UTC 日期时间，采用 [ISO 8601](https://www.rfc-editor.org/rfc/rfc3339#appendix-A) 格式。 |
| `CI_KUBERNETES_ACTIVE`                          | 13.0   | all    | 仅当流水线具有可用于部署的 Kubernetes 集群时才可用。可用时为 `true`。 |
| `CI_NODE_INDEX`                                 | 11.5   | all    | 作业集中的作业 index。仅当作业使用 [`parallel`](https://docs.gitlab.cn/jh/ci/yaml/index.html#parallel) 时可用。 |
| `CI_NODE_TOTAL`                                 | 11.5   | all    | 此作业并行运行的实例总数。如果作业不使用 [`parallel`](https://docs.gitlab.cn/jh/ci/yaml/index.html#parallel)，则设置为 `1`。 |
| `CI_OPEN_MERGE_REQUESTS`                        | 13.8   | all    | 使用当前分支和项目作为合并请求源的最多四个合并请求的逗号分隔列表。如果分支具有关联的合并请求，则仅在分支和合并请求流水线中可用。例如，`gitlab-org/gitlab!333,gitlab-org/gitlab-foss!11`。 |
| `CI_PAGES_DOMAIN`                               | 11.8   | all    | 托管 GitLab Pages 的配置域名。                               |
| `CI_PAGES_URL`                                  | 11.8   | all    | GitLab Pages 站点的 URL。始终是 `CI_PAGES_DOMAIN` 的子域名。 |
| `CI_PIPELINE_ID`                                | 8.10   | all    | 当前流水线的实例级 ID。该 ID 在实例上的所有项目中都是唯一的。 |
| `CI_PIPELINE_IID`                               | 11.0   | all    | 当前流水线的项目级 IID（内部 ID）。此 ID 仅在当前项目中是唯一的。 |
| `CI_PIPELINE_SOURCE`                            | 10.0   | all    | 流水线是如何触发的。可以是 `push`、`web`、`schedule`、`api`、`external`、`chat`、`webide`、`merge_request_event`、`external_pull_request_event`、`parent_pipeline`、[`trigger` 或 `pipeline `](https://docs.gitlab.cn/jh/ci/triggers/index.html#身份验证令牌)。 |
| `CI_PIPELINE_TRIGGERED`                         | all    | all    | 如果作业是[触发的](https://docs.gitlab.cn/jh/ci/triggers/index.html)为 true。 |
| `CI_PIPELINE_URL`                               | 11.1   | 0.5    | 流水线详细信息的 URL。                                       |
| `CI_PIPELINE_CREATED_AT`                        | 13.10  | all    | 创建流水线时的 UTC 日期时间，采用 [ISO 8601](https://tools.ietf.org/html/rfc3339#appendix-A) 格式。 |
| `CI_PROJECT_DIR`                                | all    | all    | 仓库克隆到的完整路径，以及作业从哪里运行。如果设置了 GitLab Runner `builds_dir` 参数，这个变量是相对于 `builds_dir` 的值设置的。 |
| `CI_PROJECT_ID`                                 | all    | all    | 当前项目的 ID。该 ID 在实例上的所有项目中都是唯一的。        |
| `CI_PROJECT_NAME`                               | 8.10   | 0.5    | 项目目录的名称。例如，如果项目 URL 是 `gitlab.example.com/group-name/project-1`，则 `CI_PROJECT_NAME` 是 `project-1`。 |
| `CI_PROJECT_NAMESPACE`                          | 8.10   | 0.5    | 作业的项目命名空间（用户名或组名）。                         |
| `CI_PROJECT_PATH_SLUG`                          | 9.3    | all    | `$CI_PROJECT_PATH` 小写，不是 `a-z` 或 `0-9` 的字符替换为 `-` 并缩短为 63 字节。 在 URL 和域名中使用。 |
| `CI_PROJECT_PATH`                               | 8.10   | 0.5    | 包含项目名称的项目命名空间。                                 |
| `CI_PROJECT_REPOSITORY_LANGUAGES`               | 12.3   | all    | 仓库中使用的语言的逗号分隔的小写列表。例如`ruby,javascript,html,css`。 |
| `CI_PROJECT_ROOT_NAMESPACE`                     | 13.2   | 0.5    | 作业的根项目命名空间（用户名或组名）。例如，如果`CI_PROJECT_NAMESPACE` 是 `root-group/child-group/grandchild-group`，则 `CI_PROJECT_ROOT_NAMESPACE` 是 `root-group`。 |
| `CI_PROJECT_TITLE`                              | 12.4   | all    | Web 界面中显示的人类可读的项目名称。                         |
| `CI_PROJECT_DESCRIPTION`                        | 15.1   | all    | Web 界面中显示的项目描述。                                   |
| `CI_PROJECT_URL`                                | 8.10   | 0.5    | 项目的 HTTP(S) 地址。                                        |
| `CI_PROJECT_VISIBILITY`                         | 10.3   | all    | 项目可见性。可以是 `internal`、`private` 或 `public`。       |
| `CI_PROJECT_CLASSIFICATION_LABEL`               | 14.2   | all    | 项目外部授权分类标记。                                       |
| `CI_REGISTRY_IMAGE`                             | 8.10   | 0.5    | 项目的 Container Registry 的地址。仅当为项目启用了 Container Registry 时才可用。 |
| `CI_REGISTRY_PASSWORD`                          | 9.0    | all    | 将容器推送到项目的 GitLab Container Registry 的密码。仅当为项目启用了 Container Registry 时才可用。 此密码值与 `CI_JOB_TOKEN` 相同，并且仅在作业运行时有效。使用 `CI_DEPLOY_PASSWORD` 长期访问镜像库。 |
| `CI_REGISTRY_USER`                              | 9.0    | all    | 将容器推送到项目的 GitLab Container Registry 的用户名。仅当为项目启用了 Container Registry 时才可用。 |
| `CI_REGISTRY`                                   | 8.10   | 0.5    | GitLab Container Registry 的地址。仅当为项目启用了 Container Registry 时才可用。 如果在镜像库配置中指定了一个值，则此变量包括一个 `:port` 值。 |
| `CI_REPOSITORY_URL`                             | 9.0    | all    | 克隆 Git 仓库的 URL。                                        |
| `CI_RUNNER_DESCRIPTION`                         | 8.10   | 0.5    | runner 的描述。                                              |
| `CI_RUNNER_EXECUTABLE_ARCH`                     | all    | 10.6   | GitLab Runner 可执行文件的操作系统/架构。可能和 executor 的环境不一样。 |
| `CI_RUNNER_ID`                                  | 8.10   | 0.5    | 正在使用的 runner 的唯一 ID。                                |
| `CI_RUNNER_REVISION`                            | all    | 10.6   | 运行作业的 runner 的修订版。                                 |
| `CI_RUNNER_SHORT_TOKEN`                         | all    | 12.3   | runner 的唯一 ID，用于验证新的作业请求。在 14.9 及更高版本中，令牌包含前缀，并且使用前 17 个字符。在 14.9 版本之前，使用前八个字符。 |
| `CI_RUNNER_TAGS`                                | 8.10   | 0.5    | 以逗号分隔的 runner 标签列表。                               |
| `CI_RUNNER_VERSION`                             | all    | 10.6   | 运行作业的 GitLab Runner 的版本。                            |
| `CI_SERVER_HOST`                                | 12.1   | all    | GitLab 实例 URL 的主机，没有协议或端口。例如`gitlab.example.com`。 |
| `CI_SERVER_NAME`                                | all    | all    | 协调作业的 CI/CD 服务器的名称。                              |
| `CI_SERVER_PORT`                                | 12.8   | all    | GitLab 实例 URL 的端口，没有主机或协议。例如 `8080`。        |
| `CI_SERVER_PROTOCOL`                            | 12.8   | all    | GitLab 实例 URL 的协议，没有主机或端口。例如 `https`。       |
| `CI_SERVER_REVISION`                            | all    | all    | 计划作业的 GitLab 修订版。                                   |
| `CI_SERVER_TLS_CA_FILE`                         | all    | all    | 包含 TLS CA 证书的文件，用于在 runner 设置中设置 `tls-ca-file` 时验证极狐GitLab 服务器。 |
| `CI_SERVER_TLS_CERT_FILE`                       | all    | all    | 包含 TLS 证书的文件，用于在 runner 设置中设置 `tls-ca-file` 时验证极狐GitLab 服务器。 |
| `CI_SERVER_TLS_KEY_FILE`                        | all    | all    | 包含 TLS 密钥的文件，用于在 runner 设置中设置 `tls-ca-file` 时验证极狐GitLab 服务器。 |
| `CI_SERVER_URL`                                 | 12.7   | all    | GitLab 实例的基本 URL，包括协议和端口。 例如`https://gitlab.example.com:8080`。 |
| `CI_SERVER_VERSION_MAJOR`                       | 11.4   | all    | GitLab 实例的主版本。例如，如果版本为 `13.6.1`，则`CI_SERVER_VERSION_MAJOR` 为 `13`。 |
| `CI_SERVER_VERSION_MINOR`                       | 11.4   | all    | GitLab 实例的小版本。例如，如果版本为 `13.6.1`，则`CI_SERVER_VERSION_MINOR` 为 `6`。 |
| `CI_SERVER_VERSION_PATCH`                       | 11.4   | all    | GitLab 实例的补丁版本。例如，如果版本为 `13.6.1`，则`CI_SERVER_VERSION_PATCH` 为 `1`。 |
| `CI_SERVER_VERSION`                             | all    | all    | GitLab 实例的完整版本。                                      |
| `CI_SERVER`                                     | all    | all    | 适用于在 CI/CD 中执行的所有作业。可用时为 `true`。           |
| `CI_SHARED_ENVIRONMENT`                         | all    | 10.1   | 仅当作业在共享环境中执行时才可用（跨 CI/CD 调用持久化的，如 `shell` 或 `ssh` executor）。可用时为 `true`。 |
| `GITLAB_CI`                                     | all    | all    | 适用于在 CI/CD 中执行的所有作业。可用时为 `true`。           |
| `GITLAB_FEATURES`                               | 10.6   | all    | 可用于实例和许可证的许可功能的逗号分隔列表。                 |
| `GITLAB_USER_EMAIL`                             | 8.12   | all    | 开始作业的用户的电子邮件。                                   |
| `GITLAB_USER_ID`                                | 8.12   | all    | 启动作业的用户的 ID。                                        |
| `GITLAB_USER_LOGIN`                             | 10.0   | all    | 开始作业的用户的用户名。                                     |
| `GITLAB_USER_NAME`                              | 10.0   | all    | 启动作业的用户的姓名。                                       |
| `TRIGGER_PAYLOAD`                               | 13.9   | all    | webhook 负载。仅当流水线使用 webhook 触发时可用。            |

### 合并请求变量

| 变量                                       | GitLab | Runner | 描述                                                         |
| :----------------------------------------- | :----- | :----- | :----------------------------------------------------------- |
| `CI_MERGE_REQUEST_APPROVED`                | 14.1   | all    | 合并请求的批准状态。当[合并请求批准](https://docs.gitlab.cn/jh/user/project/merge_requests/approvals/index.html) 可用并且合并请求已被批准时为 `true`。 |
| `CI_MERGE_REQUEST_ASSIGNEES`               | 11.9   | all    | 合并请求的指派人用户名的逗号分隔列表。                       |
| `CI_MERGE_REQUEST_ID`                      | 11.6   | all    | 合并请求的实例级 ID。这是 GitLab 上所有项目的唯一 ID。       |
| `CI_MERGE_REQUEST_IID`                     | 11.6   | all    | 合并请求的项目级 IID（内部 ID）。此 ID 对于当前项目是唯一的。 |
| `CI_MERGE_REQUEST_LABELS`                  | 11.9   | all    | 合并请求的逗号分隔标签名称。                                 |
| `CI_MERGE_REQUEST_MILESTONE`               | 11.9   | all    | 合并请求的里程碑标题。                                       |
| `CI_MERGE_REQUEST_PROJECT_ID`              | 11.6   | all    | 合并请求的项目 ID。                                          |
| `CI_MERGE_REQUEST_PROJECT_PATH`            | 11.6   | all    | 合并请求的项目路径。例如 `namespace/awesome-project`。       |
| `CI_MERGE_REQUEST_PROJECT_URL`             | 11.6   | all    | 合并请求的项目的 URL。例如，`http://192.168.10.15:3000/namespace/awesome-project`。 |
| `CI_MERGE_REQUEST_REF_PATH`                | 11.6   | all    | 合并请求的引用路径。例如，`refs/merge-requests/1/head`。     |
| `CI_MERGE_REQUEST_SOURCE_BRANCH_NAME`      | 11.6   | all    | 合并请求的源分支名称。                                       |
| `CI_MERGE_REQUEST_SOURCE_BRANCH_SHA`       | 11.9   | all    | 合并请求的源分支的 HEAD SHA。该变量在合并请求流水线中为空。SHA 仅存在于[合并结果流水线](https://docs.gitlab.cn/jh/ci/pipelines/merged_results_pipelines.html)中。 |
| `CI_MERGE_REQUEST_SOURCE_PROJECT_ID`       | 11.6   | all    | 合并请求的源项目的 ID。                                      |
| `CI_MERGE_REQUEST_SOURCE_PROJECT_PATH`     | 11.6   | all    | 合并请求的源项目路径。                                       |
| `CI_MERGE_REQUEST_SOURCE_PROJECT_URL`      | 11.6   | all    | 合并请求的源项目的 URL。                                     |
| `CI_MERGE_REQUEST_TARGET_BRANCH_NAME`      | 11.6   | all    | 合并请求的目标分支名称。                                     |
| `CI_MERGE_REQUEST_TARGET_BRANCH_PROTECTED` | 15.2   | all    | 合并请求的目标分支的保护状态。                               |
| `CI_MERGE_REQUEST_TARGET_BRANCH_SHA`       | 11.9   | all    | 合并请求的目标分支的 HEAD SHA。该变量在合并请求流水线中为空。SHA 仅存在于[合并结果流水线](https://docs.gitlab.cn/jh/ci/pipelines/merged_results_pipelines.html)中。 |
| `CI_MERGE_REQUEST_TITLE`                   | 11.9   | all    | 合并请求的标题。                                             |
| `CI_MERGE_REQUEST_EVENT_TYPE`              | 12.3   | all    | 合并请求的事件类型。可以是 `detached`、`merged_result` 或 `merge_train`。 |
| `CI_MERGE_REQUEST_DIFF_ID`                 | 13.7   | all    | 合并请求差异的版本。                                         |
| `CI_MERGE_REQUEST_DIFF_BASE_SHA`           | 13.7   | all    | 合并请求差异的基本 SHA。                                     |

## 流水线

gitlabrunner会通过项目根目录下的`.gitlab-ci.yml`文件来检测并执行流水线的，那么流水线的执行过程就通过`.gitlab-ci.yml`文件设置的

### job

https://docs.gitlab.com/ee/ci/yaml/#job-keywords

一个流水线中可以定义多个作业，每个作业的名字必须唯一(不能是关键字)，每个作业独立执行，作业定义了在约束条件下进行相关操作，每个作业必须包含一个script，script以数组的形式存在；如果作业中没有before_script或after_script，若全局有，将会先执行全局的；以`.` 开头的作业不会被执行，一般用来模板继承

`befor_script`失败会导致整个作业的失败，其他作业将不会再执行，作业的失败不会影响`after_script`运行

```yaml
job1:
	stage: "build"
	before_script:
		- echo "before script"
	script:
		- echo "hello job1"
		- echo "hello job2"
	after_script:
		- echo "after script"

job2:
	stage: "deploy"
	script:
		- "hello job2"
	after_script:
		- echo "after script"

.deploy
	stage: deploy
```

### stages

https://docs.gitlab.com/ee/ci/yaml/#stages

流水线全局定义作业的执行的阶段，作业按照阶段的顺序执行，统一阶段的作业并行运行，不同阶段的按顺序执行

```yaml
stages:
	- build
	- test
	- deploy
	# ...

build:
	stage: "build"
	script:
		- yum install node
		- npm install

test:
	stage: "test"
	script:
		- npm run test

depoly_pod:
	stage: "deploy"
	script:
		- npm publish
```

### stage

https://docs.gitlab.com/ee/ci/yaml/#stage

stage是在作业中使用的字段，用来标识当前作业的执行阶段，方便全局的stages进行调度管理，若果一个阶段有多个作业，需要注意配置多个runner，以便可以同时执行多个job

<aside> 💡 vim /etc/gitlab-runner/config.toml concurrent=10 配置后无需重启



</aside>

### .pre&.post

.pre始终是整个流水线第一个运行的作业，.post始终是整个流水线最后运行的作业。用户定义的阶段都在两者之间运行，.pre和.post的顺序无法更改，如果流水线中仅包含.pre和.post作业，整个流水线将不会执行

```yaml
test:
	- stage: .pre
	tags:
		- build
	only:
		- master
	script:
		- echo "test..."
```

### variables

https://docs.gitlab.com/ee/ci/yaml/#variables

定义变量，pipeline、job变量，job变量的优先级大

```yaml
variables:
	DOMIAN: blog.domain.cc
	
job1:
	stage: "build"
	variables:
		NAME: k8s
	script:
		- echo "$DOMAIN"
		- echo "$NAME"
```

### tags

https://docs.gitlab.com/ee/ci/yaml/#tags

用于从允许运行该项目中的所有runner列表中选择指定的runner，在runner注册期间，可以指定runner标签，标签可以指定多个

```yaml
job1:
	tags:
		- k8s
		- windows
		# ...

job2:
	tags:
		- k8s
		- docker
```

### allow_failure

https://docs.gitlab.com/ee/ci/yaml/#allow_failure

允许作业失败，默认值false，启动后，如果作业运行失败，改作业将会在用户界面中显示橙色警告，但是，整个流水将认为作业通过，并且不会阻塞后面的作业执行

```yaml
job:
	allow_failure: true
	script:
		- echo 22
```

![image-20230318104441601](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/image-20230318104441601.png)

### when

https://docs.gitlab.com/ee/ci/yaml/#when

控制作业的运行，指定作业什么状态下才会执行，选项值：

- on_success：前面阶段中的所有作业都成功时才会执行(默认值)
- on_failure：当前面阶段出现失败时执行
- always：总是执行作业
- manual：手动执行作业
- delayed：延迟执行作业

```yaml
job:
	when: on_success

job2:
	when: delayed
	start_in: "20"

job3:
	when: manaul # 手动执行，比如手动发布
```

### retry

https://docs.gitlab.com/ee/ci/yaml/#retry

设置作业失败情况下重试的次数，只能设置正整数(0≤n≤2)，最大设置次数2，也就是重试2次，总共运行3次

可以在指定类型失败情况下重试，达到精确匹配

- `always`: Retry on any failure (default).
- `unknown_failure`: Retry when the failure reason is unknown.
- `script_failure`: Retry when the script failed.
- `api_failure`: Retry on API failure.
- `stuck_or_timeout_failure`: Retry when the job got stuck or timed out.
- `runner_system_failure`: Retry if there is a runner system failure (for example, job setup failed).
- `runner_unsupported`: Retry if the runner is unsupported.
- `stale_schedule`: Retry if a delayed job could not be executed.
- `job_execution_timeout`: Retry if the script exceeded the maximum execution time set for the job.
- `archived_failure`: Retry if the job is archived and can’t be run.
- `unmet_prerequisites`: Retry if the job failed to complete prerequisite tasks.
- `scheduler_failure`: Retry if the scheduler failed to assign the job to a runner.
- `data_integrity_failure`: Retry if there is a structural integrity problem detected.

```yaml
job:
	retry: 1

job2:
	retry:
		when: api_failure
		max: 2

job3:
	retry:
		when:
			- api_failure
			- scheduler_failure
		max: 2
```

### timeout

https://docs.gitlab.com/ee/ci/yaml/#timeout

作业级别的超时，可以超过项目级别的超时，但不能超过runner特定的超时

```yaml
job:
	timeout: 2h 30m
```

### parallel

https://docs.gitlab.com/ee/ci/yaml/#parallel

配置要并行运行的作业实例数，此值必须大于或等于2并且小于等于50，这将创建N个并行运行的统一作业的实例，他们从job_name 1/N到job_name N/N依次命名

```yaml
job:
	parallel: 5
```

### only/except

https://docs.gitlab.com/ee/ci/yaml/#only--except

only和except用分支策略来限制jobs的构建

- only定义哪些分支和标签的git项目将会被执行job
- except定义哪些分支和标签的git项目将不会执行job

```yaml
job:
	only:
		- master
```

### rules

https://docs.gitlab.com/ee/ci/yaml/#rules

rules允许按顺序评估单个规则，知道匹配并作为动态提供属性，不能与only/except组合使用

- if
- changes
- exists
- allow_failure
- variables
- when

```yaml
variables:
	DOMAIN: example.com

job:
	rules:
		if: '$DOMAIN == "example.com"'
		- when: manual
		allow_failure: true

job2:
	rules:
		if: $CI_MERGE_REQUEST_SOURCE_BRANCH_NAME =~ /^feature/ && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME != $CI_DEFAULT_BRANCH
		- when: never
		if: $CI_MERGE_REQUEST_SOURCE_BRANCH_NAME =~ /^feature/
		- when: manual
		allow_failure: true
```

### workflow

https://docs.gitlab.com/ee/ci/yaml/#workflow

顶级workflow关键字适用于整个管道，并确定是否创建管道，when：可以设置always和never，如果未提供，则默认值always

```yaml
variables:
	DOMAIN: example.com

workflow:
	rules:
		if: '$DOMAIN == "example.com"'
		- when: never
		- when: always
```

### cache

https://docs.gitlab.com/ee/ci/yaml/#cache

使用缓存指定要在作业之间缓存的文件和目录列表。只能使用本地工作包中的路径；管道和工作之间共享缓存。在[artifacts](https://docs.gitlab.com/ee/ci/yaml/#artifacts)之前恢复缓存。

```yaml
cache:
	paths:
		- .yarn

job:
	tag:
		- build
	cache:
		key: cache-build
		paths:
			- dist
			- public
		policy: pull # 不下载缓存

job2:
	cache:
		key:
			files:
				- package.json
				- yarn.lock
		paths:
			- public
```

### artifacts

https://docs.gitlab.com/ee/ci/yaml/#artifacts

用于指定在作业成功或失败时应附加到作业的文件或目录列表，作业完成后，工件将被发送至gitlab，并可在gitlab对应的ci/cd中下载

```yaml
build:
	scripts:
		- ls
		- pwd
	artifacts:
		name: '$CI_JOB_NAME'  # 默认 artifacts.zip
		exclude:
			- node_modules/**
		paths:
			- dist
			- public
		expose_as: 'artifact 1' # 合并时暴露工件
		expire_in: 1 day  # 默认30天会清除掉
		reports: # 单元测试报告
			jest: report.xml
		when: on_success
	only:
		- tags

depoly:
	dependencies: # 使用工件
		- build # job name
```

### dependencies

https://docs.gitlab.com/ee/ci/yaml/#dependencies

定义获取工件的作业列表，只能从当前阶段之前执行的阶段定义作业，定义一个空数组将跳过下载该作业的任何工件不会考虑先前作业的状态，因此，如果它失败或是未运行的手动作业，则不会发生错误，如果设置为依赖项的作业的工件已过期或删除，那么依赖作业将失败

### needs

https://docs.gitlab.com/ee/ci/yaml/#needs

可无序执行作业，无需按照阶段运行某些作业，可以让多个阶段同时运行

```yaml
stages:
	- build
	- test
build1:
	stage: build
	scripts:
		- ls
build2:
	stage: build
	scripts:
		- pwd

test1:
	stage: test
	scripts:
		- npm run test
	needs: ['build1'] # job name

test2:
	stage: test2
	needs:
		- job: 'build2'
			artifacts: true
```

### include

https://docs.gitlab.com/ee/ci/yaml/#include

可以将相同的配置单独写出，在项目配置文件中引入

- local：本地当前项目当前分支的文件
- file：gitlab其他项目其他分支的某个文件
- remote：远程文件，http://example.com/xxx/.gitlab-ci.yml
- template：使用官方的模板，https://gitlab.com/gitlab-org/gitlab/-/tree/master/lib/gitlab/ci/templates

```yaml
# deploy.yml
deploy:
	stage: deploy
	scripts:
		- echo deploy
# .gitlab-ci.yml
include:
	local: 'deploy.yml' # 当前项目当前分支下的文件
	# file
	project: fontend/web-demo # gitlab下指定的项目
	ref: master  # 分支
	file: .gitlab-ci.yml
	# template 使用官方的模板
	template: npm.gitlab-ci.yml
	# remote
	remote: <http://example.com/xx/.gitlab-ci.yml>
```

### extends

https://docs.gitlab.com/ee/ci/yaml/#extends

继承其他作业的配置

```yaml
.tests:
  script: rake test
  stage: test
  only:
    refs:
      - branches

rspec:
  extends: .tests
  script: rake rspec
  only:
    variables:
      - $RSPEC
```

### trigger

https://docs.gitlab.com/ee/ci/yaml/#trigger

多项目管道、父子管道

### image

https://docs.gitlab.com/ee/ci/yaml/#image

默认在注册runner的时候需要填写一个基础镜像，只要使用执行器为docker类型的runner所有的操作运行都会在容器中运行，如果全局指定了image则所有的job使用此image创建容器并在其中运行，全局未指定image，再次检查job中是否指定，如果有此job按照指定镜像创建容器并执行，没有则使用注册runner时指定的默认镜像

```yaml
image:
	node:alpine
	entrypoint: ["node -v"]

job:
	stage: build
	scripts:
		- npm install
		- npm run build
```

### services

工作期间运行的另一个docker镜像，并link到image关键字定义的docker镜像，这样就可以在构建期间访问服务镜像，服务镜像可以运行任何应用程序，但是最常见的是运行数据库容器，

```yaml
image:
	node: alpine

services:
	- name: mysql:latest
		alias: mysql
```

### environment

https://docs.gitlab.com/ee/ci/yaml/#environment

定义job发布的环境

```yaml
depoly:
	scripts:
		- npm login
		- npm publish
	environment:
		name: production
		url: <https://www.baidu.com>
	
```

### inherit

https://docs.gitlab.com/ee/ci/yaml/#inherit

使用或禁用全局定义的环境变量或默认值

```yaml
default:
	retry: 2
	image: node:alpine

variables:
	NODE_VERSION: 16.2.1
	USER_NAME: root

job1:
	script: echo hello
	inherit:
		default: false # 禁止使用default变量
		variables:
			- NODE_VERSION # 继承变量 NODE_VERSION

job2:
	script: echo job2
	inherit:
		default:
			- retry # 继承retry
		variables: false # 禁止使用variables变量
```

## 参考文档

- https://docs.gitlab.com/ee/ci/
- https://docs.gitlab.com/ee/ci/yaml/

<Reward />
<Gitalk />