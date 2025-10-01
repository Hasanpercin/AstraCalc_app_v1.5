# MCP (Model Context Protocol) Setup for GitHub Copilot

This workspace has MCP servers configured for enhanced development experience with GitHub Copilot.

## 🚀 Configured MCP Servers

### ⭐ Yüksek Öncelikli (High Priority)

#### 1. Filesystem MCP ✅
- **Purpose:** Access and modify workspace files
- **Status:** Active (No auth required)
- **Path:** Workspace root

#### 2. GitHub MCP 🔐
- **Purpose:** Repository operations, issues, PRs
- **Status:** Requires GitHub Token
- **Setup:** See below

#### 3. PostgreSQL MCP (Supabase) 🗄️
- **Purpose:** Database queries and operations
- **Status:** Requires DB password
- **Setup:** See below

### 🔶 Orta Öncelikli (Medium Priority)

#### 4. Brave Search MCP 🔍
- **Purpose:** Web search for documentation and current info
- **Status:** Requires Brave API Key (Optional)
- **Setup:** Get free API key from https://brave.com/search/api/

#### 5. Time MCP ⏰
- **Purpose:** Timezone conversions, date calculations
- **Status:** Active (No auth required)
- **Use Case:** Critical for astrology birth chart calculations!

#### 6. Fetch MCP 🌐
- **Purpose:** Fetch web content, test API endpoints
- **Status:** Active (No auth required)
- **Use Case:** Test n8n webhooks, validate APIs

#### 7. Memory MCP 🧠
- **Purpose:** Knowledge graph for project context
- **Status:** Active (No auth required)
- **Use Case:** Learn and remember project patterns

### 🔵 Düşük Öncelikli (Low Priority)

#### 8. Git MCP 🌿
- **Purpose:** Git operations (commit, log, diff, branch)
- **Status:** Active (No auth required)
- **Use Case:** Advanced git operations within Copilot

#### 9. Puppeteer MCP 🎭
- **Purpose:** Browser automation and screenshots
- **Status:** Active (No auth required)
- **Use Case:** Test web views, capture UI screenshots

#### 10. Slack MCP 💬
- **Purpose:** Slack team collaboration
- **Status:** Requires Slack Bot Token (Optional)
- **Use Case:** Send notifications, create channels

#### 11. Google Drive MCP 📁
- **Purpose:** Google Drive file management
- **Status:** Requires OAuth2 (Optional)
- **Use Case:** Backup exports, share documentation

## 🔧 Setup Instructions

### GitHub Token Setup

1. Go to https://github.com/settings/tokens
2. Generate a new token (classic) with these scopes:
   - `repo` (Full control of private repositories)
   - `read:org` (Read org and team membership)
   - `read:user` (Read user profile data)
3. Copy the token
4. Add to `.env.local`:
   ```bash
   GITHUB_TOKEN=ghp_your_token_here
   ```

### Supabase Database Password

1. Go to https://supabase.com/dashboard
2. Open your project: **zeabnuknlnaranrpmyne**
3. Navigate to: **Project Settings → Database**
4. Copy your database password
5. Add to `.env.local`:
   ```bash
   SUPABASE_DB_PASSWORD=your_password_here
   ```

### Slack Bot Token (Optional)

1. Go to https://api.slack.com/apps
2. Create a new app or select existing
3. Add Bot Token Scopes:
   - `chat:write` (Send messages)
   - `channels:read` (List channels)
   - `users:read` (Read user info)
4. Install app to workspace
5. Copy Bot User OAuth Token
6. Add to `.env.local`:
   ```bash
   SLACK_BOT_TOKEN=xoxb-your-token-here
   SLACK_TEAM_ID=T01234567
   ```

### Google Drive (Optional)

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Google Drive API
4. Create OAuth2 credentials
5. Follow detailed setup: https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive

## 🎯 Usage with GitHub Copilot

Once configured, you can use these commands in GitHub Copilot Chat:

### Filesystem Operations
```
@workspace Can you analyze the structure of this project?
@workspace Update all icon imports to use emoji instead
@workspace Find all TODO comments in the codebase
```

### GitHub Operations
```
@workspace Create an issue for the login bug
@workspace Show me recent commits
@workspace List open pull requests
```

### Database Operations
```
@workspace Show me the user_profiles table schema
@workspace Write a query to get all birth chart data
@workspace Optimize the database queries in this file
```

### Time & Timezone Operations (Astrology)
```
@workspace Convert this birth date to UTC timezone
@workspace Calculate planetary positions for 15 Mart 1990, 14:30, Istanbul
@workspace What timezone was Istanbul using in 1985?
```

### Web Search & Documentation
```
@workspace Search for React Native best practices for forms
@workspace Find latest Expo Router documentation
@workspace Look up Supabase RLS policy examples
```

### API Testing
```
@workspace Test the n8n webhook with sample birth data
@workspace Fetch and validate the Supabase API response
@workspace Check if the astrology API is responding
```

### Git Operations
```
@workspace Show me the git history for profile.tsx
@workspace Create a new branch for the login feature
@workspace Show uncommitted changes in the current branch
```

### Browser Automation
```
@workspace Take a screenshot of the login page
@workspace Test the registration form with Puppeteer
@workspace Capture the birth chart calculation screen
```

### Team Collaboration
```
@workspace Send a Slack message to #dev-team about the deployment
@workspace Post the test results to Slack
@workspace Create a Slack channel for this feature
```

## 📝 Environment Variables

Create `.env.local` file (already in .gitignore):

```bash
# ===== HIGH PRIORITY =====
# GitHub Personal Access Token (REQUIRED for GitHub MCP)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx

# Supabase Database Password (REQUIRED for PostgreSQL MCP)
SUPABASE_DB_PASSWORD=xxxxxxxxxxxxxxxxxxxxx

# ===== MEDIUM PRIORITY =====
# Brave Search API Key (OPTIONAL for Brave Search MCP)
# Get free key: https://brave.com/search/api/
# Free tier: 2000 queries/month
BRAVE_API_KEY=BSA_xxxxxxxxxxxxxxxxxxxxx

# ===== LOW PRIORITY =====
# Slack Bot Token (OPTIONAL for Slack MCP)
SLACK_BOT_TOKEN=xoxb-your-token-here
SLACK_TEAM_ID=T01234567

# Google Drive OAuth2 (OPTIONAL for GDrive MCP)
# Setup: https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive
```

## ✅ Testing MCP Servers

After setup, restart VS Code and test:

1. Open GitHub Copilot Chat (Cmd+Shift+I)
2. Type: `@workspace test connection`
3. You should see MCP servers listed

## 🔒 Security Notes

- ⚠️ Never commit `.env.local` to git
- 🔐 Keep your tokens secure
- 🔄 Rotate tokens regularly
- 🚫 Don't share tokens in screenshots or logs

## 📚 Documentation

- [MCP Specification](https://modelcontextprotocol.io)
- [GitHub Copilot Docs](https://docs.github.com/copilot)
- [Supabase Docs](https://supabase.com/docs)

## 🆘 Troubleshooting

### MCP servers not showing up?
1. Restart VS Code completely
2. Check `.vscode/settings.json` syntax
3. Verify environment variables in `.env.local`
4. Check VS Code Output → GitHub Copilot logs

### Database connection failing?
1. Verify Supabase password is correct
2. Check network connectivity
3. Ensure Supabase project is active

### GitHub operations not working?
1. Verify token has correct scopes
2. Check token hasn't expired
3. Test token at https://github.com/settings/tokens
